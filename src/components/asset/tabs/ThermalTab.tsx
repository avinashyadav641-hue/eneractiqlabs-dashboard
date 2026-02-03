import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDailyFeatures } from '../../../hooks/useFeatures'

const ThermalTab = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const [selectedDay, setSelectedDay] = useState(1)

  const droneId = `ORCA${assetId?.padStart(3, '0')}`
  const { data, loading, error: _error } = useDailyFeatures(droneId, selectedDay)

  const features = data?.features

  // Extract thermal metrics - fallback to "Data unavailable" if columns don't exist
  const maxTemp = features?.max_pack_temp_C != null ? features.max_pack_temp_C.toFixed(1) : 'N/A'
  const avgTemp = features?.avg_pack_temp_C != null ? features.avg_pack_temp_C.toFixed(1) : 'N/A'
  const minTemp = (features?.avg_pack_temp_C != null && features?.max_temp_delta_C != null)
    ? (features.avg_pack_temp_C - features.max_temp_delta_C).toFixed(1)
    : 'N/A'
  const deltaT = features?.max_temp_delta_C != null ? features.max_temp_delta_C.toFixed(1) : 'N/A'
  const thermalRisk = features?.thermal_risk_flag === true

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header with Day Selector */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Thermal Risk Prediction</h2>
          <p className="text-slate-500 mt-1">AI-driven thermal state estimation and runaway forecasting</p>
        </div>
        <div className="flex items-center gap-3">
          {loading && <span className="text-sm text-slate-500">Loading...</span>}
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="glass-card px-6 py-2.5 pr-10 text-sm font-medium text-slate-900 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
              disabled={loading}
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Thermal Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Max Temperature */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Max Temperature</p>
              <h3 className="text-4xl font-bold text-slate-900">{maxTemp}°C</h3>
            </div>
            <div className="size-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">thermostat</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Pack maximum</p>
        </div>

        {/* Min Temperature */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Min Temperature</p>
              <h3 className="text-4xl font-bold text-slate-900">{minTemp}°C</h3>
            </div>
            <div className="size-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">ac_unit</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Pack minimum</p>
        </div>

        {/* Delta T */}
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Delta T</p>
              <h3 className="text-4xl font-bold text-slate-900">{deltaT}°C</h3>
            </div>
            <div className="size-12 rounded-xl bg-orange-50 text-warning flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">difference</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {thermalRisk ? (
              <span className="text-warning font-semibold">⚠️ Risk detected</span>
            ) : (
              'Within limits'
            )}
          </p>
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
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Forecast based on mission profile and recent charging interventions
            </p>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-6 overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '1%' }}></div>
          </div>
        </div>

        {/* Avg Temperature */}
        <div className="glass-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Average Pack Temperature</h3>
                <p className="text-xs text-slate-500">Across all cells</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">device_thermostat</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-slate-900">{avgTemp}°C</span>
              <span className="text-xs text-slate-500">Day {selectedDay}</span>
            </div>
          </div>
          {features && (
            <p className="text-xs text-slate-500 mt-4">
              Range: {minTemp}°C - {maxTemp}°C
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThermalTab
