const HPPCTab = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span>Engineering Validation</span>
            <span className="text-slate-300">•</span>
            <span>Cycle 245</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">HPPC & Performance Intelligence</h2>
        </div>
      </div>

      {/* KPI Lenses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Card 1: Main Result */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">HPPC Status</span>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(31,169,113,0.6)]"></span>
                <span className="text-primary font-bold text-lg">Within Spec</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary/40 bg-primary/5 p-2 rounded-xl">verified</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">Margin: &gt; 4.5% above min req</div>
        </div>

        {/* KPI Card 2: Discharge Resistance */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Discharge R (R_dch)</span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">trending_down</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tracking-tighter relative z-10">1.204</span>
            <span className="text-sm font-medium text-slate-500">mΩ</span>
          </div>
          <div className="flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 w-fit px-2 py-0.5 rounded-lg">
            <span className="material-symbols-outlined text-[12px]">arrow_downward</span>
            <span>0.5% vs baseline</span>
          </div>
        </div>

        {/* KPI Card 3: Regen Resistance */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Regen R (R_cha)</span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tracking-tighter relative z-10">1.150</span>
            <span className="text-sm font-medium text-slate-500">mΩ</span>
          </div>
          <div className="flex items-center gap-1 text-warning text-xs font-bold bg-warning/10 w-fit px-2 py-0.5 rounded-lg">
            <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
            <span>0.2% vs baseline</span>
          </div>
        </div>

        {/* KPI Card 4: Min Voltage */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Min Voltage (Sag)</span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">show_chart</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-slate-900 tracking-tighter relative z-10">3.20</span>
            <span className="text-sm font-medium text-slate-500">V</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium bg-slate-100 w-fit px-2 py-0.5 rounded-lg">
            <span>Stable at 10s Pulse</span>
          </div>
        </div>
      </div>

      {/* Main Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Large Chart: Pulse Response (Spans 2 columns) */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-slate-900 text-lg font-bold">HPPC Pulse Response Profile</h3>
              <p className="text-slate-500 text-sm">Voltage vs Time (10s Discharge Pulse)</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="size-2 rounded-full bg-electric-blue"></div>
                <span className="text-xs font-medium text-slate-600">Voltage</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="size-2 rounded-full bg-slate-400"></div>
                <span className="text-xs font-medium text-slate-600">Current</span>
              </div>
            </div>
          </div>
          <div className="relative flex-1 w-full min-h-[300px]">
            {/* Chart Area */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 300">
              {/* Grid Lines */}
              <line className="stroke-slate-200" strokeWidth="1" strokeDasharray="4" x1="0" x2="800" y1="50" y2="50" opacity="0.5"></line>
              <line className="stroke-slate-200" strokeWidth="1" strokeDasharray="4" x1="0" x2="800" y1="150" y2="150" opacity="0.5"></line>
              <line className="stroke-slate-200" strokeWidth="1" strokeDasharray="4" x1="0" x2="800" y1="250" y2="250" opacity="0.5"></line>
              
              {/* Pulse Curve */}
              <defs>
                <linearGradient id="curveGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2BB0E6" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#2BB0E6" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              
              {/* Voltage Line Path (Blue/Teal) */}
              <path d="M0 50 L100 50 L100 200 L110 210 Q250 215 400 212 L400 100 L410 80 Q550 70 800 65" fill="url(#curveGradient)" stroke="none"></path>
              <path d="M0 50 L100 50 L100 200 L110 210 Q250 215 400 212 L400 100 L410 80 Q550 70 800 65" fill="none" stroke="#2BB0E6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              
              {/* Annotations */}
              <circle cx="100" cy="50" fill="#fff" r="4" stroke="#2BB0E6" strokeWidth="2"></circle>
              <circle cx="100" cy="200" fill="#fff" r="4" stroke="#2BB0E6" strokeWidth="2"></circle>
              <circle cx="400" cy="212" fill="#fff" r="4" stroke="#2BB0E6" strokeWidth="2"></circle>
              
              {/* Peak Drop Indicator */}
              <line stroke="#F4B740" strokeDasharray="4" strokeWidth="1" x1="120" x2="120" y1="50" y2="200"></line>
              <text className="fill-warning text-xs font-mono font-bold" x="130" y="125">ΔV = 0.45V</text>
            </svg>
            {/* X Axis Labels */}
            <div className="flex justify-between mt-2 text-xs font-mono text-slate-400">
              <span>0s</span>
              <span>2s</span>
              <span>4s</span>
              <span>6s</span>
              <span>8s</span>
              <span>10s</span>
              <span>12s</span>
              <span>14s</span>
            </div>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-4 h-full">
          {/* Power Capability Chart */}
          <div className="glass-panel p-6 flex-1 min-h-[200px] flex flex-col">
            <h3 className="text-slate-900 text-sm font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">bolt</span>
              Power Capability vs SoC
            </h3>
            <div className="relative w-full flex-1">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 140">
                {/* Grid */}
                <line stroke="#cbd5e1" strokeWidth="1" x1="0" x2="300" y1="139" y2="139"></line>
                <line stroke="#cbd5e1" strokeWidth="1" x1="0" x2="0" y1="0" y2="140"></line>
                {/* Discharge Power (Blue) */}
                <path d="M0 120 Q50 115 100 80 Q200 30 300 20" fill="none" stroke="#2BB0E6" strokeWidth="2.5"></path>
                {/* Regen Power (Green) */}
                <path d="M0 130 Q100 130 150 100 Q250 50 300 10" fill="none" stroke="#1FA971" strokeDasharray="4 2" strokeWidth="2.5"></path>
                {/* Label */}
                <text className="fill-primary text-[10px] font-bold" x="220" y="15">Regen Limit</text>
                <text className="fill-electric-blue text-[10px] font-bold" x="220" y="45">Dch Limit</text>
              </svg>
            </div>
          </div>

          {/* Internal Resistance Trend */}
          <div className="glass-panel p-6 flex-1 min-h-[200px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-slate-900 text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-warning text-lg">candlestick_chart</span>
                Resistance Trend
              </h3>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 pb-2">
              {[35, 42, 38, 45, 48, 50, 48, 46, 44, 40].map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-primary/20 rounded-t" style={{ height: `${height}%` }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HPPCTab
