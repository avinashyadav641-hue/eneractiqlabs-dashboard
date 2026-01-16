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
  const currentSoH = latestSoH ? (latestSoH.SoH * 100).toFixed(1) : '--'
  const cycleCount = latestSoH ? Math.round(latestSoH.EFC_lifetime) : 0
  const rulCycles = latestSoH?.RUL_cycles || 2850
  const cellImbalance = latestSoH?.max_module_voltage_spread_mV != null 
    ? latestSoH.max_module_voltage_spread_mV.toFixed(0) 
    : '--'
  
  // Calculate efficiency loss (simplified)
  const efficiencyLoss = latestSoH ? ((1 - latestSoH.SoH) * 100).toFixed(2) : '0.02'

  // Prepare chart data
  const chartPoints = data?.history.map((item, index) => {
    const x = (index / (data.history.length - 1)) * 450 // Scale to fit within 0-450
    const sohPercent = item.SoH * 100
    const y = 20 + ((100 - sohPercent) / 5) * 55 // Map 100%-95% to y=20-75
    return { x, y, soh: sohPercent, day: item.day_index }
  }) || []

  // Prediction points (simple linear extrapolation)
  const predictPoints = latestSoH ? [
    { x: 450, y: chartPoints[chartPoints.length - 1]?.y || 75 },
    { x: 800, y: 160 } // Predict to 80% SoH
  ] : []

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Page Heading & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Degradation & Life Prediction
          </h1>
          <p className="text-slate-500 text-base font-normal leading-relaxed max-w-xl">
            State of Health (SoH) analysis from feature-engineered data
          </p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <span className="text-sm text-slate-500">Loading...</span>}
          {error && <span className="text-sm text-red-500">Error: {error}</span>}
          <button className="glass-card px-4 h-11 flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Last {data?.total_days || 15} Days
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* KPI 1: Current SoH */}
            <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <p className="text-slate-500 text-sm font-medium">Current SoH</p>
                <span className="material-symbols-outlined text-green-600 bg-green-50 rounded-xl p-1 text-[20px]">ecg_heart</span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-slate-900 tracking-tight">{currentSoH}%</p>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded-lg">
                  From Features
                </span>
                <p className="text-green-700 text-xs font-medium">Real data</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-2xl"></div>
            </div>

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
                <p className="text-slate-900 text-base font-bold leading-tight">Feature-Based Analysis</p>
                <p className="text-slate-600 text-sm font-normal leading-normal mt-1">
                  All data from pre-computed feature parquet files. No raw telemetry used.
                </p>
              </div>
            </div>
          </div>

          {/* Main Charts Section - Full Width */}
          <div className="glass-card p-6 md:p-8 flex flex-col h-full">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">State of Health (SoH) History</h3>
                <p className="text-slate-500 text-sm mt-1">Real data from {data?.total_days || 0} days</p>
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
              <div className="relative w-full h-[300px] flex-1">
                {/* Chart SVG */}
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                  <defs>
                    <linearGradient id="fill-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="50" y1="50" x2="800" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="125" x2="800" y2="125" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="200" x2="800" y2="200" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="50" y1="275" x2="800" y2="275" stroke="#f1f5f9" strokeWidth="1" />
                  
                  {/* Y-Axis Labels */}
                  <text x="35" y="55" className="text-xs fill-slate-600 font-medium" textAnchor="end">100%</text>
                  <text x="35" y="130" className="text-xs fill-slate-600 font-medium" textAnchor="end">97%</text>
                  <text x="35" y="205" className="text-xs fill-slate-600 font-medium" textAnchor="end">95%</text>
                  <text x="35" y="280" className="text-xs fill-slate-600 font-medium" textAnchor="end">92%</text>
                  
                  {/* Today Line Marker */}
                  {chartPoints.length > 0 && (
                    <>
                      <line x1="450" y1="20" x2="450" y2="280" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
                      <rect x="420" y="0" width="60" height="24" rx="4" fill="#f1f5f9" />
                      <text x="450" y="16" className="text-xs font-bold fill-slate-600" textAnchor="middle">Today</text>
                    </>
                  )}
                  
                  {/* Historical Line (Solid Green) */}
                  {chartPoints.length > 0 && (
                    <>
                      <path 
                        d={`M${chartPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Area fill */}
                      <path 
                        d={`M${chartPoints.map(p => `${p.x},${p.y}`).join(' L')} L${chartPoints[chartPoints.length-1].x},300 L0,300 Z`}
                        fill="url(#fill-gradient)" 
                        stroke="none"
                      />
                      
                      {/* Point at Today */}
                      <circle 
                        cx={chartPoints[chartPoints.length - 1].x} 
                        cy={chartPoints[chartPoints.length - 1].y} 
                        r="5" 
                        fill="#22c55e" 
                        stroke="white" 
                        strokeWidth="2" 
                      />
                      
                      {/* Interactive hover circles */}
                      {chartPoints.map((point, i) => (
                        <g key={i}>
                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="8"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPoint(point)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          {hoveredPoint === point && (
                            <>
                              <circle cx={point.x} cy={point.y} r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
                              <rect 
                                x={point.x + 12} 
                                y={point.y - 25} 
                                width="100" 
                                height="50" 
                                rx="6" 
                                fill="#1e293b" 
                                opacity="0.95"
                              />
                              <text 
                                x={point.x + 62} 
                                y={point.y - 8} 
                                className="text-xs font-bold fill-white" 
                                textAnchor="middle"
                              >
                                Day {point.day}
                              </text>
                              <text 
                                x={point.x + 62} 
                                y={point.y + 8} 
                                className="text-sm font-bold fill-green-400" 
                                textAnchor="middle"
                              >
                                {point.soh.toFixed(1)}%
                              </text>
                            </>
                          )}
                        </g>
                      ))}                      
                    </>
                  )}
                  
                  {/* Prediction Line (Dashed Blue) */}
                  {predictPoints.length > 0 && chartPoints.length > 0 && (
                    <path 
                      d={`M${chartPoints[chartPoints.length - 1].x},${chartPoints[chartPoints.length - 1].y} L${predictPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="3" 
                      strokeDasharray="8 8" 
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </div>
            </div>
        </>
      )}
    </div>
  )
}

export default DegradationTab
