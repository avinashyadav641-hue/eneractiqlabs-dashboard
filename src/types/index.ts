export interface Drone {
  id: string
  name: string
  status: 'flight' | 'charging' | 'idle' | 'fault'
  soh: number // State of Health percentage
  soc: number // State of Charge percentage
  voltage?: number
  temperature?: number
  cycleCount?: number
}

export interface FleetKPI {
  fleetAvailability: number
  activeFlights: number
  charging: number
  criticalAlerts: number
}

export interface ModuleData {
  id: string
  name: string
  status: 'normal' | 'warning' | 'critical'
  soc: number
  soh: number
  voltage: number
  temperature?: number
}

export interface SafetyMetrics {
  runawayRisk: number
  isolationResistance: number
  activeAlerts: {
    critical: number
    warning: number
    info: number
  }
}

export interface HPPCData {
  status: 'within-spec' | 'warning' | 'critical'
  dischargeResistance: number
  regenResistance: number
  minVoltage: number
  margin: number
}

export interface ThermalData {
  stateOfSafety: number
  maxTemp: number
  minTemp: number
  deltaT: number
  isoResistance: number
  runawayRisk: number
  timeToThreshold: string
}

export interface DegradationData {
  currentSoH: number
  cycleCount: number
  efficiencyLoss: number
  cellImbalance: number
  remainingCycles: number
  remainingFlightHours: number
  aiConfidence: number
}

export interface MaintenanceLog {
  id: string
  type: 'critical' | 'optimization' | 'warning'
  title: string
  module: string
  reason: string
  confidence: number
  impact: string
  action: string
}

export type TabType = 'overview' | 'hppc' | 'thermal' | 'degradation' | 'twin' | 'logs'
