import { mockMaintenanceLogs } from '../../../utils/mockData'

const MaintenanceLogsTab = () => {
  return (
    <div className="h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Autonomous Interventions</h2>
          <p className="text-slate-500 text-sm mt-1">AI-initiated control actions executed on live battery systems</p>
        </div>
        <div className="group relative">
          <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-help">
            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
            Autonomous by default
          </span>
          <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
            Actions shown here were triggered by Eneractiq Labs models unless explicitly overridden.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {mockMaintenanceLogs.map(log => (
          <div
            key={log.id}
            className={`glass-panel p-6 hover:shadow-lg transition-all border-l-4 ${log.type === 'critical'
                ? 'border-l-critical'
                : log.type === 'warning'
                  ? 'border-l-warning'
                  : 'border-l-electric-blue'
              }`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase ${log.type === 'critical'
                        ? 'bg-critical text-white'
                        : log.type === 'warning'
                          ? 'bg-warning/10 text-warning border border-warning/20'
                          : 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20'
                      }`}
                  >
                    {log.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{log.title}</h3>
                <p className="text-sm text-slate-500 mb-2">{log.module}</p>
                <p className="text-sm text-slate-700">{log.reason}</p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-slate-500">Confidence:</span>{' '}
                    <span className="font-bold text-slate-900">{log.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Impact:</span>{' '}
                    <span className="font-bold text-slate-900">{log.impact}</span>
                  </div>
                </div>
              </div>
              <button
                className={`btn-primary px-6 py-3 font-semibold text-sm whitespace-nowrap ${log.type === 'critical'
                    ? 'bg-gradient-to-br from-critical to-red-600 text-white shadow-lg'
                    : log.type === 'warning'
                      ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                      : 'bg-gradient-to-br from-primary to-electric-blue text-white shadow-lg'
                  }`}
              >
                {log.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaintenanceLogsTab
