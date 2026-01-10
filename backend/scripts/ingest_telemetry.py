#!/usr/bin/env python3
"""
Ingest telemetry data from Parquet files (Day 1-15) for Orca-001
"""
import pandas as pd
import sqlite3
import uuid
from datetime import datetime
import os

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), '../prisma/dev.db')
ASSET_ID = 'orca-001'
DATA_DIR = os.path.join(os.path.dirname(__file__), '../data/telemetry/orca-001')

# Validation thresholds
MIN_VOLTAGE = 3.0
MAX_VOLTAGE = 4.2
MAX_TEMPERATURE = 60.0
MIN_SOC = 0
MAX_SOC = 100

def validate_and_clean(df, day_index):
    """
    Clean and validate data according to STEP 2 rules
    Returns: (cleaned_df, stats)
    """
    original_count = len(df)
    
    # Drop rows with any NaN
    df = df.dropna()
    after_nan = len(df)
    nan_dropped = original_count - after_nan
    
    # Check cell voltages (V1 to V120)
    voltage_cols = [f'V{i}' for i in range(1, 121)]
    voltage_mask = df[voltage_cols].apply(
        lambda row: ((row >= MIN_VOLTAGE) & (row <= MAX_VOLTAGE)).all(),
        axis=1
    )
    df = df[voltage_mask]
    after_voltage = len(df)
    voltage_dropped = after_nan - after_voltage
    
    # Check temperature
    df = df[df['Temperature_C'] <= MAX_TEMPERATURE]
    after_temp = len(df)
    temp_dropped = after_voltage - after_temp
    
    # Check SoC (if exists, else skip)
    if 'SoC' in df.columns:
        df = df[(df['SoC'] >= MIN_SOC) & (df['SoC'] <= MAX_SOC)]
    
    final_count = len(df)
    total_dropped = original_count - final_count
    
    stats = {
        'day_index': day_index,
        'rows_read': original_count,
        'nan_dropped': nan_dropped,
        'voltage_dropped': voltage_dropped,
        'temp_dropped': temp_dropped,
        'total_dropped': total_dropped,
        'rows_stored': final_count
    }
    
    return df, stats

def detect_weak_cell(df):
    """
    Detect weakest cell across all samples in this day
    Returns: cell_index (1-120) or None
    """
    voltage_cols = [f'V{i}' for i in range(1, 121)]
    avg_voltages = df[voltage_cols].mean()
    min_idx = avg_voltages.idxmin()
    cell_number = int(min_idx[1:])  # Extract number from 'V1', 'V2', etc.
    
    # Only report if significantly lower
    min_voltage = avg_voltages.min()
    mean_voltage = avg_voltages.mean()
    
    if (mean_voltage - min_voltage) > 0.05:  # 50mV threshold
        return cell_number
    return None

def ingest_day(conn, day_index):
    """
    Ingest one day of telemetry data
    """
    file_path = os.path.join(DATA_DIR, f'drone_day_{day_index:02d}.parquet')
    
    if not os.path.exists(file_path):
        print(f"⚠️  Day {day_index}: File not found")
        return None
    
    # Read parquet
    df = pd.read_parquet(file_path)
    
    # Clean and validate
    df_clean, stats = validate_and_clean(df, day_index)
    
    if len(df_clean) == 0:
        print(f"❌ Day {day_index}: All rows dropped after cleaning")
        return stats
    
    # Detect weak cell
    weak_cell = detect_weak_cell(df_clean)
    stats['weak_cell'] = weak_cell
    
    # Insert telemetry samples
    cursor = conn.cursor()
    voltage_cols = [f'V{i}' for i in range(1, 121)]
    
    for _, row in df_clean.iterrows():
        sample_id = str(uuid.uuid4())
        
        # Insert TelemetrySample
        cursor.execute('''
            INSERT INTO TelemetrySample 
            (id, assetId, dayIndex, cycleIndex, missionId, currentA, temperatureC, timestamp, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            sample_id,
            ASSET_ID,
            int(row['Day_Index']),
            float(row['Cycle_Index_EFC']),
            int(row['Mission_ID']),
            float(row['Current_A']),
            float(row['Temperature_C']),
            datetime.now().isoformat(),
            datetime.now().isoformat()
        ))
        
        # Insert 120 CellTelemetry records
        for i, col in enumerate(voltage_cols, start=1):
            cell_id = str(uuid.uuid4())
            cursor.execute('''
                INSERT INTO CellTelemetry
                (id, sampleId, cellIndex, voltage)
                VALUES (?, ?, ?, ?)
            ''', (
                cell_id,
                sample_id,
                i,
                float(row[col])
            ))
    
    conn.commit()
    
    return stats

def main():
    """
    Main ingestion pipeline for Day 1-15
    """
    print("🚀 Starting telemetry ingestion for Orca-001")
    print(f"📂 Database: {DB_PATH}")
    print(f"📁 Data directory: {DATA_DIR}")
    print("=" * 70)
    
    # Connect to SQLite
    conn = sqlite3.connect(DB_PATH)
    
    # Clear existing telemetry for orca-001
    cursor = conn.cursor()
    cursor.execute('DELETE FROM CellTelemetry WHERE sampleId IN (SELECT id FROM TelemetrySample WHERE assetId = ?)', (ASSET_ID,))
    cursor.execute('DELETE FROM TelemetrySample WHERE assetId = ?', (ASSET_ID,))
    conn.commit()
    print(f"🗑️  Cleared existing telemetry for {ASSET_ID}")
    print("=" * 70)
    
    # Ingest each day
    all_stats = []
    for day in range(1, 16):  # Day 1 to 15
        stats = ingest_day(conn, day)
        
        if stats:
            all_stats.append(stats)
            
            # Print per-day stats
            print(f"\n📅 Day {stats['day_index']:02d}")
            print(f"   📖 Rows read:      {stats['rows_read']}")
            print(f"   🗑️  Rows dropped:   {stats['total_dropped']} " +
                  f"(NaN: {stats['nan_dropped']}, " +
                  f"Voltage: {stats['voltage_dropped']}, " +
                  f"Temp: {stats['temp_dropped']})")
            print(f"   ✅ Rows stored:    {stats['rows_stored']}")
            
            if stats.get('weak_cell'):
                print(f"   ⚠️  Weak cell:      Cell #{stats['weak_cell']}")
    
    conn.close()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 INGESTION SUMMARY")
    print("=" * 70)
    
    total_read = sum(s['rows_read'] for s in all_stats)
    total_dropped = sum(s['total_dropped'] for s in all_stats)
    total_stored = sum(s['rows_stored'] for s in all_stats)
    
    print(f"Total rows read:    {total_read}")
    print(f"Total rows dropped: {total_dropped} ({100*total_dropped/total_read:.1f}%)")
    print(f"Total rows stored:  {total_stored}")
    
    # Count weak cells
    weak_days = [s for s in all_stats if s.get('weak_cell')]
    if weak_days:
        print(f"\n⚠️  Weak cells detected on {len(weak_days)} days:")
        for s in weak_days:
            print(f"   Day {s['day_index']:02d}: Cell #{s['weak_cell']}")
    
    print("\n✅ Ingestion complete!")

if __name__ == '__main__':
    main()
