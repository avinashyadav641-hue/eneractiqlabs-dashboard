const ThermalTab = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Thermal Intelligence</h2>
        <p className="text-slate-500 mt-1">Real-time Battery Digital Twin Monitoring</p>
      </div>

      {/* State of Safety Card + Pack Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-slate-900">State of Safety</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/40 rounded-xl p-4 border border-white/60">
              <div className="text-xs text-slate-500 mb-1">Safety Score</div>
              <div className="text-xl font-bold text-slate-900">98/100</div>
            </div>
            <div className="bg-white/40 rounded-xl p-4 border border-white/60">
              <div className="text-xs text-slate-500 mb-1">Predictive Health</div>
              <div className="text-xl font-bold text-slate-900">Good</div>
            </div>
          </div>
        </div>

        {/* Pack Telemetry */}
        <div className="glass-card p-6 lg:col-span-2">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Pack Telemetry</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/30 transition-colors border border-transparent hover:border-white/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">thermostat</span>
                </div>
                <span className="text-sm font-medium text-slate-700">Max Temp</span>
              </div>
              <span className="text-base font-bold text-slate-900">42°C</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/30 transition-colors border border-transparent hover:border-white/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">ac_unit</span>
                </div>
                <span className="text-sm font-medium text-slate-700">Min Temp</span>
              </div>
              <span className="text-base font-bold text-slate-900">38°C</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/30 transition-colors border border-transparent hover:border-white/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-orange-50 text-warning flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">difference</span>
                </div>
                <span className="text-sm font-medium text-slate-700">Delta T</span>
              </div>
              <span className="text-base font-bold text-slate-900">4°C</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/30 transition-colors border border-transparent hover:border-white/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-green-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <span className="text-sm font-medium text-slate-700">Iso Resistance</span>
              </div>
              <span className="text-base font-bold text-slate-900">&gt;50 MΩ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Lenses Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thermal Runaway Risk */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Thermal Runaway Risk</h3>
                <p className="text-xs text-slate-500">AI-predicted probability</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">gpp_maybe</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-slate-900">0.01%</span>
              <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-lg">LOW</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '1%' }}></div>
          </div>
        </div>

        {/* Time to Threshold */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Time to Threshold</h3>
                <p className="text-xs text-slate-500">Before thermal event</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">timer</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="relative size-16">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-electric-blue" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-electric-blue">hourglass_top</span>
                </div>
              </div>
              <div>
                <span className="text-4xl font-bold text-slate-900">&gt; 4 hrs</span>
                <div className="text-xs text-slate-500">Stable Condition</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heat Map Visualization */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-semibold text-slate-900">Pack Thermal Distribution</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="size-2 rounded-full bg-electric-blue"></div> 35°C
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="size-2 rounded-full bg-primary"></div> 40°C
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="size-2 rounded-full bg-warning"></div> 45°C
            </div>
          </div>
        </div>
        {/* Abstract Battery Pack Grid with Diffused Gradients */}
        <div className="w-full rounded-xl overflow-hidden relative bg-white/40 border border-white/50 backdrop-blur-md grid grid-cols-12 grid-rows-4 gap-1 p-3" style={{ minHeight: '200px', maxHeight: '280px' }}>
          {/* Row 1 */}
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/25 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/30 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/10 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          {/* Row 2 */}
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/40 hover:bg-primary/50 transition-colors"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-warning/20 hover:bg-warning/40 transition-colors" title="Slightly Elevated"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/30 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          {/* Row 3 */}
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/25 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/30 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/30 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/10 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          {/* Row 4 */}
          <div className="rounded-sm bg-primary/10 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/15 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/10 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/10 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/20 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/10 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/20 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/10 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/10 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-electric-blue/05 hover:bg-electric-blue/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/10 hover:bg-primary/40 transition-colors"></div>
          <div className="rounded-sm bg-primary/10 hover:bg-primary/40 transition-colors"></div>
        </div>
      </div>

      {/* Temperature Trend Chart */}
      <div className="glass-card p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Temperature Trend (24h)</h3>
            <p className="text-xs text-slate-500">Cell Max vs Cell Avg</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 rounded-full bg-primary"></span>
              <span className="text-xs text-slate-600">Max</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 rounded-full bg-electric-blue"></span>
              <span className="text-xs text-slate-600">Avg</span>
            </div>
          </div>
        </div>
        <div className="relative w-full h-64 flex items-end gap-1 px-2 pb-6 border-b border-slate-200/50">
          {/* Temperature bars - simulating 24 hours */}
          {[42, 43, 44, 45, 44, 43, 41, 40, 39, 38, 39, 40, 42, 43, 45, 46, 45, 44, 43, 42, 41, 40, 41, 42].map((temp, idx) => (
            <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-0.5 h-full">
              <div 
                className="w-full bg-primary/40 rounded-t hover:bg-primary/60 transition-all" 
                style={{ height: `${(temp - 30) * 5}%` }}
                title={`Max: ${temp}°C`}
              ></div>
              <div 
                className="w-full bg-electric-blue/40 rounded-t hover:bg-electric-blue/60 transition-all" 
                style={{ height: `${(temp - 30) * 5 - 15}%` }}
                title={`Avg: ${temp - 3}°C`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThermalTab
