import { useParams } from 'react-router-dom'
import { useHPPC } from '../../../hooks/useFeatures'
import { useState } from 'react'

const HPPCTab = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const droneId = assetId ? `ORCA${assetId.padStart(3, '0')}` : ''
  const { data, loading, error } = useHPPC(droneId)
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)

  // Transform data
  const hppcData = (data?.data || []).map(p => {
    const soc_pct = p.soc_pct;
    const pack_resistance_median = p.pack_resistance_median;
    const pack_resistance_low = p.pack_resistance_low;
    const pack_resistance_high = p.pack_resistance_high;
    const confidence_samples = p.confidence_samples;
    const stress_index = p.stress_index;

    return {
      ...p,
      soc_pct,
      pack_resistance_median,
      pack_resistance_low,
      pack_resistance_high,
      confidence_samples,
      stress_index,
      x: (soc_pct / 100) * 800,
      // Mapping for primary graph (Resistance)
      // Range: 0.0 to 0.5 V/A (Tightened for better calibration)
      yR: 200 - (Math.min(pack_resistance_median || 0, 0.5) / 0.5 * 200), 
      yR10: 200 - (Math.min(pack_resistance_low || 0, 0.5) / 0.5 * 200),
      yR90: 200 - (Math.min(pack_resistance_high || 0, 0.5) / 0.5 * 200),
      // Mapping for confidence graph (Samples)
      // Range: 0 to 3000 samples (Based on observed thousands of samples)
      yConf: 120 - (Math.min(confidence_samples || 0, 3000) / 3000 * 120),
      // Mapping for stress graph (Normalized view of resistance)
      // Range: 0.90 to 1.1 (Recalculated per specification)
      yStress: 120 - ((Math.max(0.90, Math.min(stress_index || 1.0, 1.1)) - 0.90) / 0.2 * 120),
    }
  }).sort((a, b) => a.soc_pct - b.soc_pct)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin size-12 border-4 border-primary/30 border-t-primary rounded-full"></div>
          <p className="text-slate-500 font-medium animate-pulse text-sm">Inferring Power Capability Model...</p>
        </div>
      </div>
    )
  }

  if (error || hppcData.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center h-full min-h-[400px]">
        <div className="glass-panel p-8 max-w-md text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">analytics</span>
          <h3 className="text-xl font-bold text-slate-900 mb-2">HPPC Model Unavailable</h3>
          <p className="text-slate-500 text-sm mb-6">
            {error || `No diagnostic power capability data found for ${droneId}. The model requires a full characterization flight to generate inference.`}
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnostics</p>
            <ul className="text-xs text-slate-600 space-y-1">
              <li className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-slate-300"></div>
                Asset ID: {droneId}
              </li>
              <li className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-slate-300"></div>
                Data Path: /features/hppc/
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Reusable background zones component
  const SoCZones = ({ height }: { height: number }) => (
    <>
      <rect x="0" y="0" width="160" height={height} fill="#fef2f2" opacity="0.6" />
      <rect x="160" y="0" width="160" height={height} fill="#fffbeb" opacity="0.6" />
      <rect x="320" y="0" width="320" height={height} fill="#f0fdf4" opacity="0.6" />
      <rect x="640" y="0" width="160" height={height} fill="#f0f9ff" opacity="0.6" />
    </>
  )

  const ZoneLabels = () => (
    <div className="flex w-full pl-12 pr-4 mb-2">
      <div className="w-[20%] text-center text-[9px] font-bold uppercase tracking-[0.2em] text-red-500/50">Critical</div>
      <div className="w-[20%] text-center text-[9px] font-bold uppercase tracking-[0.2em] text-amber-500/50">Power Caution</div>
      <div className="w-[40%] text-center text-[9px] font-bold uppercase tracking-[0.2em] text-green-500/50">Nominal</div>
      <div className="w-[20%] text-center text-[9px] font-bold uppercase tracking-[0.2em] text-blue-500/50">Full Power</div>
    </div>
  )

  return (
    <div className="h-full flex flex-col gap-6 relative">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span>Autonomous Model Inference</span>
          <span className="text-slate-300">•</span>
          <span>Dynamic Power Capability Model</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pack Power Stress vs Charge</h2>
        <p className="text-slate-500 text-sm italic">"This graph shows how much the battery pack struggles to deliver power as charge drops, with uncertainty and safety zones clearly marked."</p>
      </div>

      {/* Responsive Grid of Graph Tiles */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Tile 1: Pack Power Envelope (Spans full width on desktop) */}
        <div className="glass-panel p-6 xl:col-span-2 flex flex-col">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-slate-900 font-bold text-lg">Pack Power Envelope (Dot–Bracket)</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-1">Primary Decision Graph</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-electric-blue"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Typical Behavior</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-electric-blue/20 rounded"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Uncertainty Band</span>
              </div>
            </div>
          </div>
          
          <ZoneLabels />
          
          <div className="flex gap-4">
            {/* 1. Meaning Label */}
            <div className="w-6 flex items-center justify-center shrink-0">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 h-32 text-center">
                Battery Struggle
              </p>
            </div>
            
            {/* 2. Numeric Values */}
            <div className="w-8 flex flex-col justify-between py-2 items-end pr-1 text-[8px] font-mono font-bold text-slate-400 h-[250px]">
              <span>0.5</span>
              <span>0.4</span>
              <span>0.3</span>
              <span>0.2</span>
              <span>0.1</span>
              <span>0.0</span>
            </div>

            {/* 3. Graph */}
            <div className="flex-1 flex flex-col">
              <div className="relative h-[250px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <SoCZones height={200} />
                  
                  {/* Grid Lines (Y) */}
                  {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map(val => (
                    <line 
                      key={val} 
                      x1="0" x2="800" 
                      y1={200 - (val / 0.5 * 200)} 
                      y2={200 - (val / 0.5 * 200)} 
                      stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 4" 
                    />
                  ))}
                  
                  {/* Uncertainty Band */}
                  {hppcData.length > 1 && (
                    <path
                      d={`M${hppcData.map(p => `${p.x},${p.yR10}`).join(' L')} L${hppcData.slice().reverse().map(p => `${p.x},${p.yR90}`).join(' L')} Z`}
                      fill="currentColor"
                      className="text-electric-blue/10"
                    />
                  )}

                  {/* Median Line */}
                  {hppcData.length > 1 && (
                    <path
                      d={`M${hppcData.map(p => `${p.x},${p.yR}`).join(' L')}`}
                      fill="none"
                      stroke="#2BB0E6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Median Dots */}
                  {hppcData.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.yR}
                      r="3.5"
                      fill="#2BB0E6"
                      stroke="white"
                      strokeWidth="1.5"
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </svg>

                {/* Local Tooltip Overlay */}
                {hoveredPoint && (
                  <div className="absolute top-2 bg-slate-900/95 text-white p-2 rounded border border-white/10 text-[9px] shadow-xl pointer-events-none z-10 whitespace-nowrap"
                       style={{ 
                         left: `${hoveredPoint.soc_pct}%`,
                         transform: hoveredPoint.soc_pct > 80 ? 'translateX(-110%)' : 'translateX(10%)'
                       }}>
                    <p className="font-bold text-electric-blue">{hoveredPoint.soc_pct.toFixed(1)}% SoC</p>
                    <p className="font-mono">Resistance: {hoveredPoint.pack_resistance_median.toFixed(3)} V/A</p>
                  </div>
                )}
              </div>
              {/* X-Axis Labels */}
              <div className="w-full flex justify-between px-2 pt-3 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                <span>0% SoC</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tile 2: Confidence / Sample Density */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-slate-900 font-bold mb-6">Confidence / Sample Density</h3>
          <div className="flex gap-4">
            {/* 1. Meaning Label */}
            <div className="w-6 flex items-center justify-center shrink-0">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 h-24 text-center">
                Reliability Signal
              </p>
            </div>

            {/* 2. Numeric Values */}
            <div className="w-8 flex flex-col justify-between py-2 items-end pr-1 text-[7px] font-mono font-bold text-slate-400 h-[150px]">
              <span>3k</span>
              <span>2k</span>
              <span>1k</span>
              <span>0</span>
            </div>

            {/* 3. Graph */}
            <div className="flex-1 flex flex-col">
              <div className="relative h-[150px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
                <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                  <SoCZones height={120} />
                  
                  {/* Grid Lines (Y) */}
                  {[0, 1000, 2000, 3000].map(val => (
                    <line 
                      key={val} 
                      x1="0" x2="800" 
                      y1={120 - (val / 3000 * 120)} 
                      y2={120 - (val / 3000 * 120)} 
                      stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="4 4" 
                    />
                  ))}

                  {/* Sample density area */}
                  {hppcData.length > 1 && (
                    <path
                      d={`M0,120 L${hppcData.map(p => `${p.x},${p.yConf}`).join(' L')} L800,120 Z`}
                      fill="currentColor"
                      className="text-slate-400/20"
                    />
                  )}
                  
                  {/* Confidence Line */}
                  {hppcData.length > 1 && (
                    <path
                      d={`M${hppcData.map(p => `${p.x},${p.yConf}`).join(' L')}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  )}
                </svg>

                {/* Local Tooltip Overlay */}
                {hoveredPoint && (
                  <div className="absolute top-2 bg-slate-900/95 text-white p-2 rounded border border-white/10 text-[9px] shadow-xl pointer-events-none z-10 whitespace-nowrap"
                       style={{ 
                         left: `${hoveredPoint.soc_pct}%`,
                         transform: hoveredPoint.soc_pct > 80 ? 'translateX(-110%)' : 'translateX(10%)'
                       }}>
                    <p className="font-mono">Confidence: {hoveredPoint.confidence_samples} samples</p>
                  </div>
                )}
              </div>
              {/* X-Axis Labels */}
              <div className="w-full flex justify-between px-2 pt-3 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                <span>0% SoC</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tile 3: Relative Stress Indicator */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-slate-900 font-bold mb-6">Relative Stress Indicator</h3>
          <div className="flex gap-4">
            {/* 1. Meaning Label */}
            <div className="w-6 flex items-center justify-center shrink-0">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180 h-24 text-center">
                Relative Stress
              </p>
            </div>

            {/* 2. Numeric Values (Range: 0.90 to 1.1) */}
            <div className="w-10 flex flex-col justify-between py-2 items-end pr-1 text-[7px] font-mono font-bold text-slate-400 h-[150px]">
              <span>1.10</span>
              <span>1.05</span>
              <span>1.00</span>
              <span>0.95</span>
              <span>0.90</span>
            </div>

            {/* 3. Graph Area */}
            <div className="flex-1 flex flex-col">
              <div className="relative h-[150px] bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
                <svg className="w-full h-full" viewBox="0 0 800 120" preserveAspectRatio="none">
                  <SoCZones height={120} />
                  
                  {/* Horizontal dotted line at exactly 1.0 (Baseline) */}
                  <line 
                    x1="0" x2="800" 
                    y1={120 - ((1.0 - 0.90) / 0.2 * 120)} 
                    y2={120 - ((1.0 - 0.90) / 0.2 * 120)} 
                    stroke="#475569" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 4" 
                    opacity="0.8"
                  />

                  {/* Model-Driven Stress Line (stress_index) */}
                  {hppcData.length > 1 && (
                    <g>
                      <path
                        d={`M${hppcData.map(p => `${p.x},${p.yStress}`).join(' L')}`}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Markers for each model point */}
                      {hppcData.map((p, idx) => (
                        <circle 
                          key={idx} 
                          cx={p.x} 
                          cy={p.yStress} 
                          r="3.5" 
                          fill="#f43f5e" 
                          stroke="white" 
                          strokeWidth="1.5"
                          className="cursor-crosshair"
                          onMouseEnter={() => setHoveredPoint(p)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}
                    </g>
                  )}
                </svg>

                {/* Local Tooltip Overlay */}
                {hoveredPoint && (
                  <div className="absolute top-2 bg-slate-900/95 text-white p-2 rounded border border-white/10 text-[9px] shadow-xl pointer-events-none z-10 whitespace-nowrap"
                       style={{ 
                         left: `${hoveredPoint.soc_pct}%`,
                         transform: hoveredPoint.soc_pct > 80 ? 'translateX(-110%)' : 'translateX(10%)'
                       }}>
                    <p className="font-mono text-rose-400">Stress: {hoveredPoint.stress_index.toFixed(2)}x</p>
                  </div>
                )}
              </div>
              
              {/* X-Axis: SoC Percentage */}
              <div className="w-full flex justify-between px-2 pt-3 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                <span>0% SoC</span>
                <span>20%</span>
                <span>40%</span>
                <span>60%</span>
                <span>80%</span>
                <span>100%</span>
              </div>

              {/* Legend Box (Strictly below X-axis) */}
              <div className="mt-4 flex justify-center">
                <div className="px-3 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 shadow-sm flex items-center gap-2">
                  <span className="w-4 border-t-2 border-slate-600 border-dashed"></span>
                  <span>Normal (1.0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Model Definition Card */}
      <div className="glass-panel p-6 bg-slate-50/30 border-dashed">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">info</span>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700 uppercase">Model Definition:</span> This section visually communicates one battery intelligence model viewed through three complementary lenses: 
            how the pack behaves, how confident the model is based on flight data density, and what it means for operational stress.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HPPCTab
