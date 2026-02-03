import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { TabType } from '../../types'
import OverviewTab from './tabs/OverviewTab'
import HPPCTab from './tabs/HPPCTab'
import ThermalTab from './tabs/ThermalTab'
import DegradationTab from './tabs/DegradationTab'
import DigitalTwinTab from './tabs/DigitalTwinTab'
import ChargingSessionTab from './tabs/ChargingSessionTab'
import MaintenanceLogsTab from './tabs/MaintenanceLogsTab'

const AssetWorkspace = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs = [
    { id: 'overview', label: 'System Health', icon: 'dashboard' },
    { id: 'hppc', label: 'Dynamic Power Capability Model', icon: 'speed' },
    { id: 'thermal', label: 'Thermal Risk Prediction', icon: 'thermometer' },
    { id: 'degradation', label: 'Remaining Useful Life Forecast', icon: 'history' },
    { id: 'twin', label: 'Battery Digital Twin', icon: 'view_in_ar' },
    { id: 'charging', label: 'Autonomous Charging Control', icon: 'battery_charging_full' },
    { id: 'logs', label: 'Intervention History', icon: 'article' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab assetId={assetId!} setActiveTab={setActiveTab} />
      case 'hppc':
        return <HPPCTab />
      case 'thermal':
        return <ThermalTab />
      case 'degradation':
        return <DegradationTab />
      case 'twin':
        return <DigitalTwinTab />
      case 'charging':
        return <ChargingSessionTab />
      case 'logs':
        return <MaintenanceLogsTab />
      default:
        return <OverviewTab assetId={assetId!} setActiveTab={setActiveTab} />
    }
  }

  return (
    <div className="flex flex-col gap-6 fade-in h-[calc(100vh-140px)]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium mb-8">
        <Link to="/" className="text-slate-400 hover:text-slate-600 transition-colors">
          Fleet
        </Link>
        <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
        <span className="text-slate-400">Orca Series</span>
        <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
        <span className="text-primary">ORCA {assetId}</span>
      </div>

      {/* Workspace Layout: Tabs (Left) + Content (Right) */}
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`nav-tab glass-card px-4 py-3 text-left font-medium transition-all flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'active'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-card p-6 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </div>
  )
}

export default AssetWorkspace
