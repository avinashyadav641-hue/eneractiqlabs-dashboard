import { useState } from 'react'
import { mockModules } from '../../../utils/mockData'
import ModuleDrilldown from './ModuleDrilldown'

const DigitalTwinTab = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null)

  // If a module is selected, show the drilldown view
  if (selectedModule !== null) {
    return (
      <ModuleDrilldown
        moduleNumber={selectedModule}
        serialNumber={`BAT-8892-${selectedModule}`}
        onBack={() => setSelectedModule(null)}
      />
    )
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Battery Architecture</h2>
      <p className="text-slate-500">Real-time visualization · Click any module to drill down</p>
      
      <h3 className="text-xl font-bold text-slate-900">Module Status (Real-time)</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mockModules.map(module => (
          <button
            key={module.id}
            onClick={() => setSelectedModule(parseInt(module.id.replace('Module ', '')))}
            className={`module-card p-4 text-left hover:scale-105 transition-transform cursor-pointer ${
              module.status === 'warning' ? 'border-warning/30' : 'hover:border-electric-blue/30'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-slate-900 text-lg">{module.id}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${
                  module.status === 'warning'
                    ? 'bg-warning/10 text-warning border-warning/20'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                {module.status}
              </span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                <span>SoC</span>
                <span className="text-slate-900">{module.soc}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    module.status === 'warning' ? 'bg-warning' : 'bg-electric-blue'
                  } rounded-full transition-all`}
                  style={{ width: `${module.soc}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-semibold mb-0.5">SoH</p>
                <p className="text-sm font-bold text-slate-900">{module.soh}%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-slate-500 font-semibold mb-0.5">Voltage</p>
                <p className="text-sm font-bold text-slate-900">{module.voltage} V</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default DigitalTwinTab
