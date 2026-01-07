import { Drone } from '../../types'

interface DroneCardProps {
  drone: Drone
}

const DroneCard = ({ drone }: DroneCardProps) => {
  const getStatusBadge = () => {
    switch (drone.status) {
      case 'flight':
        return (
          <span className="bg-electric-blue/10 text-electric-blue px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-electric-blue/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-blue"></span>
            </span>
            Flight
          </span>
        )
      case 'charging':
        return (
          <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-warning/20">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Charging
          </span>
        )
      case 'fault':
        return (
          <span className="bg-critical/10 text-critical px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-critical/20 animate-pulse">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            Fault
          </span>
        )
      default:
        return (
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
            Idle
          </span>
        )
    }
  }

  const cardBorderClass = drone.status === 'fault' ? 'border-critical/40 bg-critical/5 shadow-[0_0_15px_rgba(226,74,74,0.1)]' : ''

  return (
    <div className={`glass-card rounded-[20px] p-7 flex flex-col gap-6 relative group cursor-pointer hover:border-primary/50 transition-all ${cardBorderClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">
            eVTOL {drone.id}
          </div>
          <div className="text-lg font-bold text-slate-900">{drone.name}</div>
        </div>
        {getStatusBadge()}
      </div>
      <div className="flex items-center justify-between">
        <div className="relative size-16 flex items-center justify-center">
          <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={drone.status === 'fault' ? 'text-critical' : 'text-primary'}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${drone.soh}, 100`}
              strokeWidth="3"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={`text-sm font-bold ${drone.status === 'fault' ? 'text-critical' : 'text-slate-900'}`}>
              {drone.soh}%
            </span>
            <span className="text-[9px] text-slate-500 uppercase">SoH</span>
          </div>
        </div>
        {drone.soc !== undefined && (
          <div className="flex flex-col gap-1 items-end">
            <div className="text-slate-400 text-xs">State of Charge</div>
            <div className="text-xl font-bold text-slate-900">{drone.soc}%</div>
            <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full ${drone.status === 'charging' ? 'bg-warning' : 'bg-electric-blue'} rounded-full`}
                style={{ width: `${drone.soc}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DroneCard
