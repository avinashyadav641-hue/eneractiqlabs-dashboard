/**
 * Shared type definitions for feature-engineered data
 * MUST match backend/src/types/features.ts EXACTLY
 */

// Daily features (single day snapshot)
export interface DailyFeatures {
  drone_id: string
  day_index: number
  Ah_discharge_day: number
  EFC_day: number
  avg_current_A: number
  peak_current_A: number
  avg_cell_voltage_V: number
  min_cell_voltage_V: number
  max_cell_voltage_V: number
  avg_module_voltage_spread_mV: number
  max_module_voltage_spread_mV: number
  avg_pack_temp_C: number
  max_pack_temp_C: number
  max_temp_delta_C: number
  voltage_imbalance_flag: boolean
  thermal_risk_flag: boolean
}

// SoH features (multi-day history)
export interface SoHFeatures extends DailyFeatures {
  EFC_lifetime: number
  SoH: number
}

// Lifetime features (aggregated)
export interface LifetimeFeatures extends DailyFeatures {
  EFC_lifetime: number
}

// API Response Types
export interface DailyFeaturesResponse {
  drone_id: string
  day_index: number
  features: DailyFeatures
}

export interface SoHHistoryResponse {
  drone_id: string
  total_days: number
  history: SoHFeatures[]
}

export interface FleetAggregatedResponse {
  total_drones: number
  total_days: number
  data: LifetimeFeatures[]
}

// Latest snapshot for Overview tab
export interface LatestSnapshot {
  drone_id: string
  day_index: number
  daily_features: DailyFeatures
  soh_snapshot: {
    EFC_lifetime: number
    SoH: number
  } | null
}
