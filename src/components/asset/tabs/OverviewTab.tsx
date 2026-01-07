import { TabType } from '../../../types'

interface OverviewTabProps {
  assetId: string
  setActiveTab: (tab: TabType) => void
}

const OverviewTab = ({ assetId, setActiveTab }: OverviewTabProps) => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            System Overview
          </h1>
          <p className="text-slate-500 text-base">
            Real-time battery system status · <span className="font-mono text-slate-900">ORCA-{assetId}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-panel px-4 h-10 rounded-xl flex items-center gap-2 text-slate-600 text-sm hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Overall Health</p>
            <span className="material-symbols-outlined text-primary bg-primary/10 rounded-xl p-1 text-[20px]">favorite</span>
          </div>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">Excellent</h3>
          <p className="text-xs font-medium text-primary mt-2">
            Ready for mission
          </p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">System Voltage</p>
            <span className="material-symbols-outlined text-electric-blue bg-electric-blue/10 rounded-xl p-1 text-[20px]">bolt</span>
          </div>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">402.5 V</h3>
          <p className="text-xs font-medium text-slate-500 mt-2">
            10 Modules · Series Connected
          </p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Thermal State</p>
            <span className="material-symbols-outlined text-warning bg-warning/10 rounded-xl p-1 text-[20px]">thermostat</span>
          </div>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">ΔT 2.4°C</h3>
          <p className="text-xs font-medium text-primary mt-2">Stable</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center h-32 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Cycle Count</p>
            <span className="material-symbols-outlined text-slate-400 bg-slate-100 rounded-xl p-1 text-[20px]">cycle</span>
          </div>
          <h3 className="text-3xl font-bold mt-1 text-slate-900">298</h3>
          <p className="text-xs font-medium text-primary mt-2">
            Early lifecycle
          </p>
        </div>
      </div>

      {/* Battery Status Card */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Battery Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">State of Charge</p>
            <p className="text-2xl font-bold text-slate-900">72%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">State of Health</p>
            <p className="text-2xl font-bold text-slate-900">98%</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Temperature</p>
            <p className="text-2xl font-bold text-slate-900">42°C</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Current</p>
            <p className="text-2xl font-bold text-slate-900">25.4 A</p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4 border-primary/30 bg-primary/5">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-xl text-primary">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <p className="text-slate-900 text-sm font-bold">All Systems Nominal</p>
            <p className="text-slate-600 text-xs mt-0.5">
              Last inspection: 2 hours ago • Next scheduled: In 4 hours
            </p>
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
          <h4 className="font-bold text-slate-900 text-lg mb-1">Performance (HPPC)</h4>
          <p className="text-sm text-slate-500">View HPPC Intelligence</p>
        </button>
        <button
          onClick={() => setActiveTab('thermal')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-warning transition-colors text-[28px]">thermostat</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-warning transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Thermal Intelligence</h4>
          <p className="text-sm text-slate-500">View Thermal Analysis</p>
        </button>
        <button
          onClick={() => setActiveTab('degradation')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-[28px]">eco</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Degradation & Life</h4>
          <p className="text-sm text-slate-500">View SoH Forecast</p>
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
          <h4 className="font-bold text-slate-900 text-lg mb-1">Digital Twin</h4>
          <p className="text-sm text-slate-500">View Module Architecture</p>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className="interactive-card p-6 text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary transition-colors text-[28px]">checklist</span>
            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-1">Maintenance Logs</h4>
          <p className="text-sm text-slate-500">View AI Recommendations</p>
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
