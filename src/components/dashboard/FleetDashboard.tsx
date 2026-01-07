import { useState } from 'react'
import { Link } from 'react-router-dom'
import { mockFleetKPI, mockDrones } from '../../utils/mockData'
import DroneCard from './DroneCard'

type FilterType = 'all' | 'active' | 'critical'

const FleetDashboard = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Filter drones based on selected filter
  const filteredDrones = mockDrones.filter(drone => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'active') return drone.status === 'flight'
    if (activeFilter === 'critical') return drone.status === 'fault' || drone.soh < 85
    return true
  })

  return (
    <div className="flex flex-col gap-8 fade-in">
      {/* Header & KPIs */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <span>Fleet Overview</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-primary">Orca Series</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mission Control</h1>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
              <span className="text-slate-500 font-medium text-sm">Fleet Availability</span>
              <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">
                check_circle
              </span>
            </div>
            <div className="z-10">
              <div className="text-3xl font-bold text-slate-900 glow-text tracking-tight">
                {mockFleetKPI.fleetAvailability}%
              </div>
              <div className="text-primary text-xs font-medium flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.4% vs
                last week
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
              <span className="text-slate-500 font-medium text-sm">Active Flights</span>
              <span className="material-symbols-outlined text-electric-blue bg-electric-blue/10 p-1.5 rounded-lg text-xl">
                flight_takeoff
              </span>
            </div>
            <div className="z-10">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {mockFleetKPI.activeFlights}
              </div>
              <div className="text-electric-blue text-xs font-medium flex items-center gap-1 mt-1">
                On schedule
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="flex justify-between items-start z-10">
              <span className="text-slate-500 font-medium text-sm">Charging</span>
              <span className="material-symbols-outlined text-warning bg-warning/10 p-1.5 rounded-lg text-xl">
                bolt
              </span>
            </div>
            <div className="z-10">
              <div className="text-3xl font-bold text-slate-900 tracking-tight">
                {mockFleetKPI.charging}
              </div>
              <div className="text-slate-500 text-xs font-medium flex items-center gap-1 mt-1">
                Avg. time to full: 24m
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group border-critical/30 bg-critical/5">
            <div className="flex justify-between items-start z-10">
              <span className="text-critical font-medium text-sm">Critical Alerts</span>
              <span className="material-symbols-outlined text-critical bg-critical/10 p-1.5 rounded-lg text-xl animate-pulse">
                warning
              </span>
            </div>
            <div className="z-10">
              <div className="text-3xl font-bold text-critical glow-text-critical tracking-tight">
                {mockFleetKPI.criticalAlerts}
              </div>
              <div className="text-critical text-xs font-medium flex items-center gap-1 mt-1">
                Requires immediate action
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveFilter('all')}
          className={`glass-card px-5 py-2 rounded-xl text-sm font-medium border shadow-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeFilter === 'all' 
              ? 'bg-slate-800 text-white border-slate-700 shadow-slate-900/10' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span> All Drones
        </button>
        <button 
          onClick={() => setActiveFilter('active')}
          className={`glass-card px-5 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeFilter === 'active'
              ? 'bg-electric-blue text-white border-electric-blue shadow-lg shadow-electric-blue/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">flight</span>{' '}
          Active Flights
        </button>
        <button 
          onClick={() => setActiveFilter('critical')}
          className={`glass-card px-5 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeFilter === 'critical'
              ? 'bg-critical text-white border-critical shadow-lg shadow-critical/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">error</span>{' '}
          Critical Alerts
        </button>
      </div>

      {/* Drone Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-12">
        {filteredDrones.length > 0 ? (
          filteredDrones.map(drone => (
            <Link key={drone.id} to={`/asset/${drone.id}`}>
              <DroneCard drone={drone} />
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No drones found</h3>
            <p className="text-slate-500">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FleetDashboard
