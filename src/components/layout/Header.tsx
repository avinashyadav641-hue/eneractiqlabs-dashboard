import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface Notification {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  message: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'critical',
    title: 'ORCA-004 Critical Fault',
    message: 'Thermal risk detected. Immediate intervention required.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'ORCA-007 SoH Alert',
    message: 'State of Health dropped below 85%. Schedule maintenance.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update',
    message: 'ElecticOS v2.1 available for all fleet assets.',
    time: '1 hour ago',
    read: true,
  },
]

const Header = () => {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return 'error'
      case 'warning': return 'warning'
      default: return 'info'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-500 bg-red-50'
      case 'warning': return 'text-amber-500 bg-amber-50'
      default: return 'text-blue-500 bg-blue-50'
    }
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
          <h2 className="text-xl font-bold tracking-tight">ElecticaOS</h2>
        </div>
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors hover:bg-slate-100 rounded-lg"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Notifications</h3>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
                    Mark all as read
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${!notification.read ? 'bg-blue-50/30' : ''
                        }`}
                    >
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                          <span className="material-symbols-outlined text-[18px]">
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-slate-100">
                  <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                    View all notifications
                  </span>
                </div>
              </div>
            )}
          </div>

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
                style={{
                  backgroundImage: `url('${user.avatar}')`,
                  backgroundPosition: 'center 20%'
                }}
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
                      style={{
                        backgroundImage: `url('${user.avatar}')`,
                        backgroundPosition: 'center 20%'
                      }}
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
