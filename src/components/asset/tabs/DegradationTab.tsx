const DegradationTab = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      {/* Page Heading & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-2">
        <div className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Degradation & Life Prediction
          </h1>
          <p className="text-slate-500 text-base font-normal leading-relaxed max-w-xl">
            AI-driven State of Health (SoH) analysis and Remaining Useful Life (RUL) forecasting for safety-critical operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="glass-card px-4 h-11 flex items-center gap-2 text-slate-600 font-bold text-sm hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            Last 30 Days
            <span className="material-symbols-outlined text-[20px] text-slate-400">expand_more</span>
          </button>
          <button className="btn-primary px-5 h-11 flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* KPI 1: Current SoH */}
        <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-sm font-medium">Current SoH</p>
            <span className="material-symbols-outlined text-green-600 bg-green-50 rounded-xl p-1 text-[20px]">ecg_heart</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-slate-900 tracking-tight">98.4%</p>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="flex items-center justify-center bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded-lg">
              +0.1%
            </span>
            <p className="text-green-700 text-xs font-medium">Above predicted curve</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-2xl"></div>
        </div>

        {/* KPI 2: Cycle Count */}
        <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-sm font-medium">Cycle Count</p>
            <span className="material-symbols-outlined text-slate-400 bg-slate-50 rounded-xl p-1 text-[20px]">cycle</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-slate-900 tracking-tight">215</p>
            <span className="text-slate-400 text-sm font-medium">cycles</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <p className="text-slate-500 text-xs font-medium">Early lifecycle phase (&lt; 300)</p>
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
            <p className="text-4xl font-bold text-slate-900 tracking-tight">≤ 0.02%</p>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="material-symbols-outlined text-green-600 text-[16px]">check_circle</span>
            <p className="text-slate-500 text-xs font-medium">Coulombic efficiency nominal</p>
          </div>
        </div>

        {/* KPI 4: Cell Imbalance */}
        <div className="glass-card p-6 flex flex-col gap-1 relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 text-sm font-medium">Cell Imbalance</p>
            <span className="material-symbols-outlined text-slate-400 bg-slate-50 rounded-xl p-1 text-[20px]">battery_alert</span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-slate-900 tracking-tight">9 mV</p>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <p className="text-slate-500 text-xs font-medium">Within ±20mV threshold</p>
          </div>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-300/40 bg-amber-50/30">
        <div className="flex items-start md:items-center gap-4">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
            <span className="material-symbols-outlined">info</span>
          </div>
          <div>
            <p className="text-slate-900 text-base font-bold leading-tight">Deviation Detected</p>
            <p className="text-slate-600 text-sm font-normal leading-normal mt-1">
              Minor deviation observed relative to fleet baseline. No corrective action required at current lifecycle stage.
            </p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-primary transition-colors pl-12 md:pl-0">
          View Analysis
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Main Charts & RUL Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Chart Column (2/3) */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 flex flex-col h-full">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">State of Health (SoH) Forecast</h3>
              <p className="text-slate-500 text-sm mt-1">Historical vs. Predicted Degradation Curve</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-slate-600">Historical SoH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary/40 border border-primary border-dashed"></span>
                <span className="text-slate-600">AI Prediction</span>
              </div>
            </div>
          </div>
          <div className="relative w-full h-[300px] flex-1">
            {/* Chart SVG */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
              <defs>
                <linearGradient id="grid-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="fill-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines (Horizontal) */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="125" x2="800" y2="125" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="200" x2="800" y2="200" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="275" x2="800" y2="275" stroke="#f1f5f9" strokeWidth="1" />
              {/* Y-Axis Labels */}
              <text x="-10" y="55" className="text-xs fill-slate-400" textAnchor="end">99%</text>
              <text x="-10" y="130" className="text-xs fill-slate-400" textAnchor="end">97%</text>
              <text x="-10" y="205" className="text-xs fill-slate-400" textAnchor="end">95%</text>
              {/* Today Line Marker */}
              <line x1="450" y1="20" x2="450" y2="280" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1" />
              <rect x="420" y="0" width="60" height="24" rx="4" fill="#f1f5f9" />
              <text x="450" y="16" className="text-xs font-bold fill-slate-600" textAnchor="middle">Today</text>
              {/* Historical Line (Solid Green) */}
              <path d="M0,20 C50,25 100,22 150,30 S250,35 300,45 S400,60 450,75" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
              {/* Area fill for Historical */}
              <path d="M0,20 C50,25 100,22 150,30 S250,35 300,45 S400,60 450,75 V300 H0 Z" fill="url(#fill-gradient)" stroke="none" />
              {/* Point at Today */}
              <circle cx="450" cy="75" r="5" fill="#22c55e" stroke="white" strokeWidth="2" />
              {/* Today Label Float */}
              <rect x="465" y="60" width="90" height="30" rx="6" fill="#1e293b" />
              <text x="510" y="80" className="text-xs font-bold fill-white" textAnchor="middle">98.4% SoH</text>
              {/* Prediction Line (Dashed Blue) */}
              <path d="M450,75 C550,105 650,120 800,160" fill="none" stroke="#135bec" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right RUL Card (1/3) */}
        <div className="glass-card p-6 md:p-8 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Remaining Useful Life</h3>
            <p className="text-slate-500 text-sm mt-1">Estimated at 80% SoH threshold</p>
          </div>
          
          {/* Large RUL Display */}
          <div className="flex flex-col items-center justify-center flex-1 py-8">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <defs>
                  <linearGradient id="rul-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Background circle */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                {/* Progress circle */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="url(#rul-gradient)" strokeWidth="12"
                  strokeDasharray="440" strokeDashoffset="110" strokeLinecap="round"
                  transform="rotate(-90 90 90)" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-slate-600">2,850</span>
                <span className="text-sm text-slate-500 font-medium mt-1">cycles</span>
              </div>
            </div>
            
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Confidence Interval</span>
                <span className="font-bold text-slate-900">±180 cycles</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Model Accuracy</span>
                <span className="font-bold text-green-600">96.2%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Next Revision</span>
                <span className="font-bold text-slate-900">Cycle 250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DegradationTab
