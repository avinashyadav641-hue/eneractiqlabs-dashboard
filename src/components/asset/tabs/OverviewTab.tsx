import { useLatestSnapshot } from '../../../hooks/useFeatures'
import { TabType } from '../../../types'

interface OverviewTabProps {
  assetId: string
  setActiveTab: (tab: TabType) => void
}

const OverviewTab = ({ assetId, setActiveTab }: OverviewTabProps) => {
  const droneId = `ORCA${assetId.padStart(3, '0')}`
  const { data, loading, error } = useLatestSnapshot(droneId)

  // Extract features or use defaults
  const features = data?.daily_features
  const soh = data?.soh_snapshot

  const systemVoltage = features ? (features.avg_cell_voltage_V * 120).toFixed(1) : '402.5'
  const deltaT = features?.max_temp_delta_C?.toFixed(1) || '2.4'
  const avgCurrent = features?.avg_current_A?.toFixed(1) || '25.4'
  const efcLifetime = soh?.EFC_lifetime?.toFixed(1) || '0'
  const dayIndex = features?.day_index || 0

  // SoH health status from features data
  const sohValue = soh ? soh.SoH * 100 : 83
  const sohPercent = sohValue.toFixed(0)
  const healthStatus = sohValue > 95 ? 'Excellent' : sohValue >= 90 ? 'Good' : sohValue >= 80 ? 'Average' : 'Poor'
  const healthColor = sohValue > 95 ? 'text-green-600' : sohValue >= 90 ? 'text-primary' : sohValue >= 80 ? 'text-yellow-600' : 'text-red-600'

  const hasWarnings = features?.voltage_imbalance_flag || features?.thermal_risk_flag

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            System Health
          </h1>
          <p className="text-slate-500 text-base">
            Battery system autonomous health state · <span className="font-mono text-slate-900">ORCA-{assetId}</span>
            {!loading && features && (
              <span className="ml-2 text-xs">· Day {dayIndex}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <span className="text-sm text-slate-500">Loading...</span>
          )}
          {error && (
            <span className="text-sm text-red-500">Failed to load</span>
          )}
          <button
            onClick={() => window.location.reload()}
            className="glass-panel px-4 h-10 rounded-xl flex items-center gap-2 text-slate-600 text-sm hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content Grid - Image on Right, Content on Left */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - All Content */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">System Health State</p>
                <span className="material-symbols-outlined text-primary bg-primary/10 rounded-xl p-1 text-[20px]">favorite</span>
              </div>
              <h3 className={`text-3xl font-bold mt-1 ${healthColor}`}>
                {healthStatus}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-2">
                {sohValue < 87 ? '⚠️ Intervention Required' : hasWarnings ? 'Model flags detected' : 'Autonomous policy active'}
              </p>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">System Voltage</p>
                <span className="material-symbols-outlined text-electric-blue bg-electric-blue/10 rounded-xl p-1 text-[20px]">bolt</span>
              </div>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">{systemVoltage} V</h3>
              <p className="text-xs font-medium text-slate-500 mt-2">
                10 Modules · Series Connected
              </p>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Thermal State</p>
                <span className="material-symbols-outlined text-warning bg-warning/10 rounded-xl p-1 text-[20px]">thermostat</span>
              </div>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">ΔT {deltaT}°C</h3>
              <p className="text-xs font-medium text-primary mt-2">
                {features?.thermal_risk_flag ? 'Warning' : 'Stable'}
              </p>
            </div>
            <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">EFC Lifetime</p>
                <span className="material-symbols-outlined text-slate-400 bg-slate-100 rounded-xl p-1 text-[20px]">cycle</span>
              </div>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">{efcLifetime}</h3>
              <p className="text-xs font-medium text-primary mt-2">
                Equivalent Full Cycles
              </p>
            </div>
          </div>

          {/* Battery Health & Policy Summary */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Battery Health & Policy Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Average Voltage</p>
                <p className="text-2xl font-bold text-slate-900">3.54 V</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Max Voltage</p>
                <p className="text-2xl font-bold text-slate-900">4.25 V</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">State of Health</p>
                <p className="text-2xl font-bold text-slate-900">{sohPercent}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Avg Current</p>
                <p className="text-2xl font-bold text-slate-900">{avgCurrent} A</p>
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          <div className={`glass-panel p-4 flex items-center justify-between gap-4 ${hasWarnings ? 'border-warning/30 bg-warning/5' : 'border-primary/30 bg-primary/5'
            }`}>
            <div className="flex items-center gap-4">
              <div className={`${hasWarnings ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                } p-2 rounded-xl`}>
                <span className="material-symbols-outlined">
                  {hasWarnings ? 'warning' : 'check_circle'}
                </span>
              </div>
              <div>
                <p className="text-slate-900 text-sm font-bold">
                  {hasWarnings ? 'System Warnings Detected' : 'All Systems Nominal'}
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  {features?.voltage_imbalance_flag && 'Voltage imbalance detected · '}
                  {features?.thermal_risk_flag && 'Thermal risk detected · '}
                  {!hasWarnings && 'Last updated: Just now'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Drone Image */}
        <div className="xl:col-span-1">
          <div className="glass-panel p-6 flex items-center justify-center bg-gradient-to-br from-slate-50/80 to-white/60 sticky top-6 min-h-[400px]">
            <div className="w-full">
              <img
                src="/drone-orca.webp"
                alt="ORCA Drone"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('hppc')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-[28px]">speed</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Dynamic Power Model</h4>
          <p className="text-sm text-slate-500">View Power Capability</p>
        </button>
        <button
          onClick={() => setActiveTab('thermal')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-warning transition-colors text-[28px]">thermostat</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-warning transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Thermal Risk Prediction</h4>
          <p className="text-sm text-slate-500">View Risk Forecast</p>
        </button>
        <button
          onClick={() => setActiveTab('degradation')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-[28px]">eco</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Remaining Useful Life Forecast</h4>
          <p className="text-sm text-slate-500">View Life Projection</p>
        </button>
      </div>

      {/* Additional Quick Links Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('twin')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-electric-blue transition-colors text-[28px]">view_in_ar</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-electric-blue transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Battery Digital Twin</h4>
          <p className="text-sm text-slate-500">View Model-Driven State</p>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-[28px]">checklist</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Intervention History</h4>
          <p className="text-sm text-slate-500">View Autonomous Interventions</p>
        </button>
        <div className="glass-panel p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-slate-400 text-[28px]">history</span>
          </div>
          <h4 className="font-bold text-slate-700 text-lg mb-1">Recent Activity</h4>
          <p className="text-sm text-slate-500">Last charge completed at 14:32</p>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
