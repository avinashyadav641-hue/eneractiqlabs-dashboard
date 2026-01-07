interface ModuleDrilldownProps {
  moduleNumber: number
  serialNumber: string
  onBack: () => void
}

interface CellData {
  id: number
  voltage: number
  height: number
  fillHeight: number
  color: string
  isWarning?: boolean
}

const ModuleDrilldown = ({ moduleNumber, serialNumber, onBack }: ModuleDrilldownProps) => {
  // Generate realistic cell voltages with slight variations
  const generateCellData = (): CellData[] => {
    const baseVoltage = 4.1
    const cells: CellData[] = []
    
    for (let i = 1; i <= 12; i++) {
      const variance = (Math.random() - 0.5) * 0.015 // ±7.5mV variance
      const voltage = baseVoltage + variance
      const isWarning = i === 7 && Math.random() > 0.5 // Randomly flag cell 7
      
      cells.push({
        id: i,
        voltage: parseFloat(voltage.toFixed(3)),
        height: 80 + Math.random() * 10, // 80-90% height
        fillHeight: 60 + Math.random() * 20, // 60-80% fill
        color: isWarning ? 'warning' : 'primary',
        isWarning
      })
    }
    
    return cells
  }

  const cellData = generateCellData()
  const maxVoltage = Math.max(...cellData.map(c => c.voltage))
  const minVoltage = Math.min(...cellData.map(c => c.voltage))
  const spread = ((maxVoltage - minVoltage) * 1000).toFixed(0) // Convert to mV

  const maxTemp = 38 + Math.floor(Math.random() * 6) // 38-44°C
  const minTemp = 35 + Math.floor(Math.random() * 4) // 35-39°C
  const deltaT = maxTemp - minTemp

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
                Module {moduleNumber} Drilldown
                <span className="text-slate-400 font-light mx-2">|</span>
                <span className="text-xl font-mono text-slate-600">SN: {serialNumber}</span>
              </h2>
              <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                Telemetry Latency: 12ms (Stable)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* LEFT PANEL: Cell Voltage Spread (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-8 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bar_chart</span>
                Cell Voltage Spread
              </h3>
              <p className="text-sm text-slate-500 mt-1">Real-time millivolt (mV) readings per cell</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-slate-800 tracking-tight">
                {spread}<span className="text-base text-slate-500 font-sans ml-1">mV</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-secondary">Max Spread</div>
            </div>
          </div>

          {/* Voltage Chart Container */}
          <div className="flex-1 flex flex-col justify-end relative">
            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
              <div className="w-full border-t border-dashed border-slate-200 h-0 flex items-center">
                <span className="text-[10px] text-slate-400 pl-1 -mt-4">4.200V</span>
              </div>
              <div className="w-full border-t border-dashed border-slate-200 h-0 flex items-center">
                <span className="text-[10px] text-slate-400 pl-1 -mt-4">4.000V</span>
              </div>
              <div className="w-full border-t border-dashed border-slate-200 h-0 flex items-center">
                <span className="text-[10px] text-slate-400 pl-1 -mt-4">3.800V</span>
              </div>
              <div className="w-full border-t border-dashed border-slate-200 h-0 flex items-center">
                <span className="text-[10px] text-slate-400 pl-1 -mt-4">3.600V</span>
              </div>
            </div>

            {/* Bars */}
            <div className="grid grid-cols-12 gap-3 h-[320px] items-end z-10 px-2">
              {cellData.map((cell) => (
                <div key={cell.id} className="group flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="relative w-full bg-slate-100 rounded-t-md rounded-b-md overflow-hidden flex flex-col justify-end hover:bg-slate-200 transition-colors duration-300"
                    style={{ height: `${cell.height}%` }}
                  >
                    <div
                      className={`w-full ${
                        cell.isWarning
                          ? 'bg-warning/80 group-hover:bg-warning shadow-[0_0_15px_rgba(244,183,64,0.3)]'
                          : 'bg-primary/90 group-hover:bg-primary shadow-[0_0_15px_rgba(31,168,113,0.3)]'
                      } transition-all duration-500 rounded-t-md`}
                      style={{ height: `${cell.fillHeight}%` }}
                    ></div>
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono z-20">
                      {cell.voltage.toFixed(3)} V
                    </div>
                  </div>
                  <span
                    className={`text-xs font-mono font-medium ${
                      cell.isWarning ? 'text-warning' : 'text-slate-500'
                    }`}
                  >
                    {cell.id.toString().padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer of Voltage Chart */}
          <div className="mt-4 flex justify-between items-center bg-white/40 p-3 rounded-lg border border-white/50">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary"></span>
              <span className="text-xs text-slate-500 font-medium">Nominal Range (3.7V - 4.2V)</span>
            </div>
            <div className="text-xs text-slate-400 font-mono">Sampling: 100Hz</div>
          </div>
        </div>

        {/* RIGHT PANEL: Thermal & Health (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Thermal Card */}
          <div className="glass-panel p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">thermostat</span>
                Thermal Management
              </h3>
            </div>

            {/* Dual Temperature Lenses */}
            <div className="grid grid-cols-2 gap-4 z-10">
              {/* Max Temp Lens */}
              <div className="aspect-square rounded-full border border-white/60 bg-gradient-to-br from-white/80 to-white/20 shadow-lg flex flex-col items-center justify-center relative group">
                <div className="absolute inset-2 rounded-full bg-gradient-radial from-primary/10 to-transparent opacity-70"></div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold z-10 mb-1">Max</span>
                <div className="text-4xl font-mono font-bold text-slate-800 z-10 tracking-tighter">
                  {maxTemp}<span className="text-lg align-top text-slate-400">°</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1 bg-white/50 px-2 py-0.5 rounded-full z-10">
                  Sensor #8
                </span>
              </div>

              {/* Min Temp Lens */}
              <div className="aspect-square rounded-full border border-white/60 bg-gradient-to-br from-white/80 to-white/20 shadow-lg flex flex-col items-center justify-center relative group">
                <div className="absolute inset-2 rounded-full bg-gradient-radial from-primary/10 to-transparent opacity-50"></div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold z-10 mb-1">Min</span>
                <div className="text-4xl font-mono font-bold text-slate-800 z-10 tracking-tighter">
                  {minTemp}<span className="text-lg align-top text-slate-400">°</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-1 bg-white/50 px-2 py-0.5 rounded-full z-10">
                  Sensor #2
                </span>
              </div>
            </div>

            {/* Delta T Section */}
            <div className="flex items-center gap-4 bg-white/40 p-4 rounded-xl border border-white/50 z-10">
              {/* CSS Ring */}
              <div
                className="relative size-16 rounded-full flex items-center justify-center bg-white shadow-inner"
                style={{
                  background: `conic-gradient(#2BB0E6 0% ${(deltaT / 10) * 100}%, #e2e8f0 ${(deltaT / 10) * 100}% 100%)`
                }}
              >
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-slate-700">{deltaT}°</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-700">Delta T (Δ)</div>
                <div className="text-xs text-slate-500 leading-snug">Temperature differential across module.</div>
              </div>
            </div>
          </div>

          {/* SoH & Status Card */}
          <div className="glass-panel p-6 flex flex-col gap-5 flex-1">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">health_and_safety</span>
              Module Health (SoH)
            </h3>

            {/* Imbalance Severity */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Imbalance</span>
                <span className="text-sm font-medium text-slate-700">Cell Variance</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-bold shadow-sm">
                Stable ({spread}mV)
              </div>
            </div>

            {/* Aging Indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aging Rate</span>
                <span className="text-sm font-medium text-slate-700">Cycle Degradation</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                Normal
              </div>
            </div>

            {/* Cycle Count Mini Stat */}
            <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Total Cycles</span>
              <span className="font-mono font-bold text-slate-800">
                {1200 + moduleNumber * 50 + Math.floor(Math.random() * 100)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModuleDrilldown
