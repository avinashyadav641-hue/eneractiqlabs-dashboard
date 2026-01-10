#!/usr/bin/env python3
import pandas as pd
import json
import sys

# Read first parquet file
df = pd.read_parquet('backend/data/telemetry/orca-001/drone_day_01.parquet')

print("📋 Parquet Schema:")
print(f"Columns: {', '.join(df.columns.tolist())}")
print(f"\nRow count: {len(df)}")
print(f"\nData types:\n{df.dtypes}")

print("\n📊 Sample Records (first 3 rows):")
print(df.head(3).to_json(orient='records', indent=2))

print("\n📊 Data Summary:")
print(df.describe())
