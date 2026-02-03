/**
 * Shared type definitions
 * Backend and frontend MUST use these exact interfaces
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
  // Pack-level features
  avg_pack_voltage_V?: number
  avg_discharge_power_W?: number
  energy_throughput_Wh?: number
  // Module-level features (10 modules)
  module_1_avg_voltage_V?: number
  module_2_avg_voltage_V?: number
  module_3_avg_voltage_V?: number
  module_4_avg_voltage_V?: number
  module_5_avg_voltage_V?: number
  module_6_avg_voltage_V?: number
  module_7_avg_voltage_V?: number
  module_8_avg_voltage_V?: number
  module_9_avg_voltage_V?: number
  module_10_avg_voltage_V?: number
  module_1_avg_power_W?: number
  module_2_avg_power_W?: number
  module_3_avg_power_W?: number
  module_4_avg_power_W?: number
  module_5_avg_power_W?: number
  module_6_avg_power_W?: number
  module_7_avg_power_W?: number
  module_8_avg_power_W?: number
  module_9_avg_power_W?: number
  module_10_avg_power_W?: number
  module_1_power_per_EFC_W?: number
  module_2_power_per_EFC_W?: number
  module_3_power_per_EFC_W?: number
  module_4_power_per_EFC_W?: number
  module_5_power_per_EFC_W?: number
  module_6_power_per_EFC_W?: number
  module_7_power_per_EFC_W?: number
  module_8_power_per_EFC_W?: number
  module_9_power_per_EFC_W?: number
  module_10_power_per_EFC_W?: number
}

// SoH features (multi-day history)
export interface SoHFeatures extends DailyFeatures {
  EFC_lifetime: number
  SoH: number
  RUL_cycles?: number
  degradation_rate?: number
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

// Multi-day comparison for Module Drilldown (Days 1, 7, 15)
export interface MultiDayComparisonResponse {
  drone_id: string
  days: number[]
  features: DailyFeatures[]
}

// Charging Session features
export interface ChargingSegment {
  mode: string
  current: number
  voltage: number
  duration: number
  status: 'autonomously scheduled'
  confidence: number
}

export interface ChargingSession {
  drone_id: string
  profile_graph: {
    time: number[]
    current: number[]
    voltage: number[]
    power: number[]
    annotations: { time: number; label: string }[]
  }
  segments: ChargingSegment[]
  summary: {
    total_duration: number
    target_soc: number
    avg_power: number
  }
  metadata: {
    target_soc: number
    estimated_duration: number
    expected_delta_T: number
    predicted_delta_soh: number
  }
}

export interface ChargingSessionResponse {
  drone_id: string
  charging_session: ChargingSession | null
}

// HPPC (Dynamic Power Capability) features
export interface HPPCPoint {
  soc_pct: number
  pack_resistance_median: number
  pack_resistance_low: number
  pack_resistance_high: number
  stress_index: number
  confidence_samples: number
}

export interface HPPCResponse {
  drone_id: string
  data: HPPCPoint[]
}
