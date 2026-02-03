import { useParams } from 'react-router-dom'
import { useChargingSession } from '../../../hooks/useFeatures'

const ChargingSessionTab = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const droneId = `ORCA${assetId?.padStart(3, '0')}`
  const { data, loading, error } = useChargingSession(droneId)

  const session = data?.charging_session

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading autonomous charging plan...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center glass-panel p-8 max-w-md">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">analytics</span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Awaiting Session Data</h3>
          <p className="text-slate-500 font-normal">No autonomous charging plan generated for this asset yet. Re-running planner after next mission completion.</p>
        </div>
      </div>
    )
  }

  // Helper for dynamic SVG scaling
  const timeData = session.profile_graph.time
  const currentData = session.profile_graph.current
  const voltageData = session.profile_graph.voltage
  const totalDuration = session.summary.total_duration || 120

  const getX = (t: number) => (t / totalDuration) * 800
  // Scaling Current (0 to 40A range)
  const getYCurrent = (c: number) => 300 - (Math.min(c || 0, 40) / 40) * 300
  // Scaling Voltage (350V to 550V range)
  const getYVoltage = (v: number) => 300 - ((Math.min(Math.max(v || 350, 350), 550) - 350) / 200) * 300
  
  const currentPath = `M${timeData.map((t, i) => `${getX(t)},${getYCurrent(currentData[i])}`).join(' L')}`
  const voltagePath = `M${timeData.map((t, i) => `${getX(t)},${getYVoltage(voltageData[i])}`).join(' L')}`

  return (
    <div className="h-full flex flex-col gap-8 fade-in">
      {/* Primary Graph Container: Separated Tile */}
      <div className="glass-panel p-10 flex flex-col min-h-[600px] shadow-lg border-slate-200/60 bg-white/40">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-slate-900 text-xl font-bold tracking-tight">AI-Generated Charging Policy</h3>
            <p className="text-slate-500 text-sm font-normal">Dynamic Current and Voltage vs Time Profile</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-electric-blue"></div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Current (A)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-primary"></div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Voltage (V)</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-1">
          {/* Y-Axis Primary: Current */}
          <div className="flex gap-3 shrink-0">
            <div className="w-6 flex items-center justify-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 h-32 text-center">
                Current (Amps)
              </p>
            </div>
            <div className="w-8 flex flex-col justify-between py-1 items-end pr-1 text-[9px] font-mono font-bold text-slate-400 h-[300px]">
              <span>40</span>
              <span>30</span>
              <span>20</span>
              <span>10</span>
              <span>0</span>
            </div>
          </div>

          {/* Graph Content Area */}
          <div className="flex-1 flex flex-col">
            <div className="relative h-[300px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
                {/* Horizontal Grid Lines */}
                {[0, 75, 150, 225, 300].map(y => (
                  <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.5" />
                ))}
                
                {/* Vertical Segment Annotations */}
                {session.profile_graph.annotations.map((ann, idx) => (
                  <line key={idx} x1={getX(ann.time)} y1="0" x2={getX(ann.time)} y2="300" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                ))}

                {/* Profile Curves */}
                <path d={voltagePath} fill="none" stroke="#1FA971" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d={currentPath} fill="none" stroke="#2BB0E6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between mt-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">
              {[0, 20, 40, 60, 80, 100, 120].map(t => (
                <span key={t} style={{ visibility: t <= totalDuration ? 'visible' : 'hidden' }}>{t}</span>
              ))}
            </div>
            <div className="text-center mt-2 text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              Charging Duration (Minutes)
            </div>
          </div>

          {/* Y-Axis Secondary: Voltage */}
          <div className="flex gap-3 shrink-0">
            <div className="w-10 flex flex-col justify-between py-1 items-start pl-1 text-[9px] font-mono font-bold text-slate-400 h-[300px]">
              <span>550</span>
              <span>500</span>
              <span>450</span>
              <span>400</span>
              <span>350</span>
            </div>
            <div className="w-6 flex items-center justify-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] [writing-mode:vertical-lr] h-32 text-center">
                Voltage (Volts)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomous Intervention Insight: Generation Map & Policy Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Charging Strategy Map (Segments) */}
        <div className="glass-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-electric-blue">map</span>
            <h3 className="text-slate-900 font-bold uppercase tracking-widest text-xs">Autonomous Strategy Map</h3>
          </div>
          <div className="flex flex-col gap-4">
            {session.segments.map((seg, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-primary/30 transition-all group">
                <div className="size-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-mono text-xs font-bold group-hover:text-primary transition-colors">
                  0{idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-slate-900 font-bold text-sm uppercase tracking-tight">{seg.mode} Phase</p>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{seg.status}</span>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{seg.current}A @ {seg.voltage}V</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{seg.duration} Minutes</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                  <p className="text-xs font-bold text-primary">{seg.confidence}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Generation Map & Physics Markers */}
        <div className="glass-panel p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">analytics</span>
              <h3 className="text-slate-900 font-bold uppercase tracking-widest text-xs">Generation Physics & Metadata</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100/50">
                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Target SoC</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{session.metadata.target_soc}%</p>
                <p className="text-[9px] text-blue-600 font-bold mt-2 uppercase">Safety Threshold Met</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Est. Duration</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">120 min</p>
                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Optimization: Balanced</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Expected ΔT</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">+{session.metadata.expected_delta_T}°C</p>
                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Thermal Limit: Nominal</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Predicted ΔSoH</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">-{session.metadata.predicted_delta_soh.toFixed(4)}%</p>
                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Degradation Penalty</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
              "Strategy includes **Step Charging** at mid-SOC, **Bump Charging** for cell equalization, and designated **Relaxation Points** to manage internal impedance and heat."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChargingSessionTab
