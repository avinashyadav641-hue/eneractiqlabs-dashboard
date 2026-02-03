import { useParams } from 'react-router-dom'
import { useMultiDayComparison } from '../../../hooks/useFeatures'

interface ModuleDrilldownProps {
  moduleNumber: number
  serialNumber: string
  onBack: () => void
}

const ModuleDrilldown = ({ moduleNumber, serialNumber: _serialNumber, onBack }: ModuleDrilldownProps) => {
  const { assetId } = useParams<{ assetId: string }>()
  const droneId = `ORCA${assetId?.padStart(3, '0')}`
  const { data, loading, error } = useMultiDayComparison(droneId)

  // Prepare chart data for all 10 modules
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const idx = i + 1
    const key_voltage = `module_${idx}_avg_voltage_V`
    const key_power = `module_${idx}_avg_power_W`
    const key_power_efc = `module_${idx}_power_per_EFC_W`

    return {
      module: idx,
      day1_voltage: (data?.features[0] as any)?.[key_voltage] || 0,
      day7_voltage: (data?.features[1] as any)?.[key_voltage] || 0,
      day15_voltage: (data?.features[2] as any)?.[key_voltage] || 0,
      day1_power: (data?.features[0] as any)?.[key_power] || 0,
      day7_power: (data?.features[1] as any)?.[key_power] || 0,
      day15_power: (data?.features[2] as any)?.[key_power] || 0,
      day1_power_efc: (data?.features[0] as any)?.[key_power_efc] || 0,
      day7_power_efc: (data?.features[1] as any)?.[key_power_efc] || 0,
      day15_power_efc: (data?.features[2] as any)?.[key_power_efc] || 0,
    }
  })

  // Calculate min/max for scaling
  const allVoltages = chartData.flatMap(d => [d.day1_voltage, d.day7_voltage, d.day15_voltage])
  const maxVoltage = Math.max(...allVoltages, 40)
  const minVoltage = Math.min(...allVoltages.filter(v => v > 0), 36)

  const allPowers = chartData.flatMap(d => [d.day1_power, d.day7_power, d.day15_power])
  const maxPower = Math.max(...allPowers, 100)

  const allPowerEFC = chartData.flatMap(d => [d.day1_power_efc, d.day7_power_efc, d.day15_power_efc])
  const maxPowerEFC = Math.max(...allPowerEFC, 10)

  return (
    <div className="h-full flex flex-col gap-6 fade-in">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="interactive-card p-2 hover:scale-105"
            >
              <span className="material-symbols-outlined text-slate-600">arrow_back</span>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                Module {moduleNumber} Comparison
                <span className="text-slate-400 font-light mx-2">|</span>
                <span className="text-xl font-mono text-slate-600">Day 1 vs 7 vs 15</span>
              </h2>
              <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                {loading ? (
                  <span>Loading model data...</span>
                ) : error ? (
                  <span className="text-red-500">Error: {error}</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                )}
                Autonomous Model Inference
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin size-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500">Loading model data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* Module Power vs Module Index Chart */}
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Module Power vs Module Index
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Average discharge power (W) per module</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-blue-500"></span>
                    <span className="text-slate-600">Day 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-green-500"></span>
                    <span className="text-slate-600">Day 7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-orange-500"></span>
                    <span className="text-slate-600">Day 15</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-64 bg-white/40 rounded-xl p-6">
                <svg className="w-full h-full" viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="80" y1={40 + i * 50} x2="980" y2={40 + i * 50}
                      stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  ))}

                  {/* Y-axis labels */}
                  <text x="70" y="45" className="text-sm fill-slate-600 font-medium" textAnchor="end">{maxPower.toFixed(0)}W</text>
                  <text x="70" y="140" className="text-sm fill-slate-600 font-medium" textAnchor="end">{(maxPower / 2).toFixed(0)}W</text>
                  <text x="70" y="235" className="text-sm fill-slate-600 font-medium" textAnchor="end">0W</text>

                  {/* Lines */}
                  {/* Day 1 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - (d.day1_power / maxPower) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Day 7 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - (d.day7_power / maxPower) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Day 15 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - (d.day15_power / maxPower) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* X-axis labels */}
                  {chartData.map((d, i) => (
                    <text key={i} x={80 + (i * 900 / 9)} y="258"
                      className="text-sm fill-slate-600 font-medium" textAnchor="middle">
                      M{d.module}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Module Voltage vs Module Index Chart */}
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-electric-blue">electric_bolt</span>
                    Module Voltage vs Module Index
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Average cell voltage (V) per module</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-blue-500"></span>
                    <span className="text-slate-600">Day 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-green-500"></span>
                    <span className="text-slate-600">Day 7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-orange-500"></span>
                    <span className="text-slate-600">Day 15</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-64 bg-white/40 rounded-xl p-6">
                <svg className="w-full h-full" viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="80" y1={40 + i * 50} x2="980" y2={40 + i * 50}
                      stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  ))}

                  {/* Y-axis labels */}
                  <text x="70" y="45" className="text-sm fill-slate-600 font-medium" textAnchor="end">{maxVoltage.toFixed(1)}V</text>
                  <text x="70" y="140" className="text-sm fill-slate-600 font-medium" textAnchor="end">{((maxVoltage + minVoltage) / 2).toFixed(1)}V</text>
                  <text x="70" y="235" className="text-sm fill-slate-600 font-medium" textAnchor="end">{minVoltage.toFixed(1)}V</text>

                  {/* Lines */}
                  {/* Day 1 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - ((d.day1_voltage - minVoltage) / (maxVoltage - minVoltage)) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Day 7 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - ((d.day7_voltage - minVoltage) / (maxVoltage - minVoltage)) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Day 15 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - ((d.day15_voltage - minVoltage) / (maxVoltage - minVoltage)) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* X-axis labels */}
                  {chartData.map((d, i) => (
                    <text key={i} x={80 + (i * 900 / 9)} y="258"
                      className="text-sm fill-slate-600 font-medium" textAnchor="middle">
                      M{d.module}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Module Power per Cycle Chart */}
            <div className="glass-panel p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-warning">cycle</span>
                    Module Power per EFC
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Power per equivalent full cycle (W/EFC)</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-blue-500"></span>
                    <span className="text-slate-600">Day 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-green-500"></span>
                    <span className="text-slate-600">Day 7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-1 bg-orange-500"></span>
                    <span className="text-slate-600">Day 15</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="relative h-64 bg-white/40 rounded-xl p-6">
                <svg className="w-full h-full" viewBox="0 0 1000 260" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="80" y1={40 + i * 50} x2="980" y2={40 + i * 50}
                      stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  ))}

                  {/* Y-axis labels */}
                  <text x="70" y="45" className="text-sm fill-slate-600 font-medium" textAnchor="end">{maxPowerEFC.toFixed(1)}</text>
                  <text x="70" y="140" className="text-sm fill-slate-600 font-medium" textAnchor="end">{(maxPowerEFC / 2).toFixed(1)}</text>
                  <text x="70" y="235" className="text-sm fill-slate-600 font-medium" textAnchor="end">0</text>

                  {/* Lines */}
                  {/* Day 1 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - (d.day1_power_efc / maxPowerEFC) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Day 7 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - (d.day7_power_efc / maxPowerEFC) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Day 15 Line */}
                  <polyline
                    points={chartData.map((d, i) => {
                      const x = 80 + (i * 900 / 9)
                      const y = 240 - (d.day15_power_efc / maxPowerEFC) * 200
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* X-axis labels */}
                  {chartData.map((d, i) => (
                    <text key={i} x={80 + (i * 900 / 9)} y="258"
                      className="text-sm fill-slate-600 font-medium" textAnchor="middle">
                      M{d.module}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ModuleDrilldown
