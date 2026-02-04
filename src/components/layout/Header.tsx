import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
    setShowDropdown(false)
  }

  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-slate-900 cursor-pointer">
          <img
            src="/avin/electicalogo.png"
            alt="Electica Logo"
            className="h-8 w-auto object-contain"
          />
          <h2 className="text-xl font-bold tracking-tight">Electica EAM</h2>
        </div>
      </Link>

      {user && (
        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-primary/30 shadow-lg"
                style={{ backgroundImage: `url('${user.avatar}')` }}
              />
              <span className="material-symbols-outlined text-slate-400 text-[18px]">
                {showDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-full bg-cover bg-center border-2 border-primary/30"
                      style={{ backgroundImage: `url('${user.avatar}')` }}
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span className="text-sm">My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span className="text-sm">Settings</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left">
                    <span className="material-symbols-outlined text-[20px]">help</span>
                    <span className="text-sm">Help & Support</span>
                  </button>
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
