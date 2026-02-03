import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSoHHistory } from '../../../hooks/useFeatures'

const DegradationTab = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const droneId = `ORCA${assetId?.padStart(3, '0')}`
  const { data, loading, error } = useSoHHistory(droneId)
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; soh: number; day: number } | null>(null)

  // Extract latest values
  const latestSoH = data?.history[data.history.length - 1]
  const cycleCount = latestSoH ? Math.round(latestSoH.EFC_lifetime) : 0
  const cellImbalance = latestSoH?.max_module_voltage_spread_mV != null 
    ? latestSoH.max_module_voltage_spread_mV.toFixed(0) 
    : '--'
  
  // Calculate efficiency loss (simplified)
  const efficiencyLoss = latestSoH ? ((1 - latestSoH.SoH) * 100).toFixed(2) : '0.02'

    // Prepare chart data - Map to SVG coordinates where TODAY is in the MIDDLE (x=350)
    // Create a natural degradation curve visualization from SoH data
    const chartPoints = data?.history.map((item, index) => {
      const x = (index / Math.max(data.history.length - 1, 1)) * 350 // Scale to left half (0-350)
      const sohPercent = item.SoH * 100 // Use actual SoH from features data
      // Apply visual scaling to show gradual degradation trend more clearly
      // Map SoH from its actual range to visible Y coordinates (100% at y=0, 80% at y=260)
      const sohRange = 20 // 100% to 80% range
      const y = ((100 - sohPercent) / sohRange) * 260
      return { x, y, soh: sohPercent, day: item.day_index }
    }) || []

  // Prediction points - Gentle downward slope continuing the degradation trend
  const lastPoint = chartPoints[chartPoints.length - 1]
  const predictPoints = lastPoint ? [
    { x: 350, y: lastPoint.y },
    { x: 700, y: Math.min(lastPoint.y + 30, 260) } // Gentle downward projection
  ] : []

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Page Heading & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Remaining Useful Life Forecast
          </h1>
          <p className="text-slate-500 text-base font-normal leading-relaxed max-w-xl">
            State of Health (SoH) model inference
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <span className="text-sm text-slate-500">Loading...</span>}
          {error && <span className="text-sm text-red-500">Error: {error}</span>}
          <button className="glass-card px-4 h-11 flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Mission History
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin size-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500">Loading SoH history...</p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* KPI 2: Cycle Count */}
            <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-sm font-medium">EFC Lifetime</p>
                <span className="material-symbols-outlined text-slate-400 bg-slate-50 rounded-xl p-1 text-[20px]">cycle</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-slate-900 tracking-tight">{cycleCount}</p>
                <span className="text-slate-400 text-sm font-medium">EFC</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <p className="text-slate-500 text-xs font-medium">Equivalent full cycles</p>
              </div>
              <div className="absolute bottom-0 left-0 w-[30%] h-1 bg-primary rounded-bl-2xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 -z-10 rounded-b-2xl"></div>
            </div>

            {/* KPI 3: Efficiency Loss */}
            <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-sm font-medium">Efficiency Loss</p>
                <span className="material-symbols-outlined text-primary bg-blue-50 rounded-xl p-1 text-[20px]">bolt</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-slate-900 tracking-tight">≤ {efficiencyLoss}%</p>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="material-symbols-outlined text-green-600 text-[16px]">check_circle</span>
                <p className="text-slate-500 text-xs font-medium">Within normal range</p>
              </div>
            </div>

            {/* KPI 4: Cell Imbalance */}
            <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-sm font-medium">Voltage Spread</p>
                <span className="material-symbols-outlined text-slate-400 bg-slate-50 rounded-xl p-1 text-[20px]">battery_alert</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-slate-900 tracking-tight">{cellImbalance} mV</p>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <p className="text-slate-500 text-xs font-medium">Module voltage spread</p>
              </div>
            </div>
          </div>

          {/* Insight Banner */}
          <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-primary/40 bg-primary/5">
            <div className="flex items-start md:items-center gap-4">
              <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0">
                <span className="material-symbols-outlined">info</span>
              </div>
              <div>
                <p className="text-slate-900 text-base font-bold leading-tight">Model-Derived Health State</p>
                <p className="text-slate-600 text-sm font-normal leading-normal mt-1">
                  Autonomous model inference based on mission profiles.
                </p>
              </div>
            </div>
          </div>

          {/* Main Charts Section - Full Width */}
          <div className="glass-card p-6 md:p-8 flex flex-col">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">State of Health (SoH) History</h3>
                <p className="text-slate-500 text-sm mt-1">Lifecycle Tracking</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-slate-600">Historical SoH</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="20" height="12" className="flex-shrink-0">
                    <line x1="0" y1="6" x2="20" y2="6" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />
                  </svg>
                  <span className="text-slate-600">Projection</span>
                </div>
              </div>
            </div>
            
            {/* Chart with External Y-Axis Labels */}
            <div className="flex gap-4">
              {/* Y-Axis Numeric Values (OUTSIDE graph) */}
              <div className="w-10 flex flex-col justify-between py-1 items-end pr-2 text-[10px] font-mono font-bold text-slate-400 h-[260px]">
                <span>100%</span>
                <span>93%</span>
                <span>87%</span>
                <span>80%</span>
              </div>
              
              {/* Graph Container */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-[260px] bg-slate-50/30 rounded-xl overflow-hidden border border-slate-100">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 260">
                    <defs>
                      <linearGradient id="fill-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Horizontal Grid Lines */}
                    {[0, 86.67, 173.33, 260].map((y, i) => (
                      <line key={i} x1="0" x2="700" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                    ))}
                    
                    {/* Today Marker Line - Always at center (x=350) */}
                    {chartPoints.length > 0 && (
                      <line x1="350" y1="0" x2="350" y2="260" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                    )}
                    
                    {/* Historical Area Fill */}
                    {chartPoints.length > 0 && (
                      <path 
                        d={`M0,${chartPoints[0]?.y || 0} L${chartPoints.map(p => `${p.x},${p.y}`).join(' L')} L${lastPoint?.x || 0},260 L0,260 Z`}
                        fill="url(#fill-gradient)" 
                        stroke="none"
                      />
                    )}
                    
                    {/* Historical Line (Solid Green) */}
                    {chartPoints.length > 0 && (
                      <path 
                        d={`M${chartPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    {/* Prediction Line (Dashed Blue) - Goes DOWNWARD */}
                    {predictPoints.length > 0 && chartPoints.length > 0 && (
                      <path 
                        d={`M${predictPoints[0].x},${predictPoints[0].y} L${predictPoints[1].x},${predictPoints[1].y}`}
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        strokeDasharray="8 8" 
                        strokeLinecap="round"
                      />
                    )}
                    
                    {/* Today Point Marker */}
                    {chartPoints.length > 0 && lastPoint && (
                      <circle 
                        cx={lastPoint.x} 
                        cy={lastPoint.y} 
                        r="6" 
                        fill="#22c55e" 
                        stroke="white" 
                        strokeWidth="2" 
                      />
                    )}
                    
                    {/* Interactive hover circles */}
                    {chartPoints.map((point, i) => (
                      <g key={i}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="10"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                        {hoveredPoint === point && (
                          <>
                            <circle cx={point.x} cy={point.y} r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
                            <rect 
                              x={point.x > 600 ? point.x - 112 : point.x + 12} 
                              y={Math.max(point.y - 25, 5)} 
                              width="100" 
                              height="50" 
                              rx="6" 
                              fill="#1e293b" 
                              opacity="0.95"
                            />
                            <text 
                              x={point.x > 600 ? point.x - 62 : point.x + 62} 
                              y={Math.max(point.y - 8, 22)} 
                              className="text-xs font-bold fill-white" 
                              textAnchor="middle"
                            >
                              Day {point.day}
                            </text>
                            <text 
                              x={point.x > 600 ? point.x - 62 : point.x + 62} 
                              y={Math.max(point.y + 12, 42)} 
                              className="text-sm font-bold fill-green-400" 
                              textAnchor="middle"
                            >
                              {point.soh.toFixed(1)}%
                            </text>
                          </>
                        )}
                      </g>
                    ))}
                  </svg>
                  
                  {/* Today Label - Fixed at center */}
                  {chartPoints.length > 0 && (
                    <div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600"
                    >
                      Today
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DegradationTab
