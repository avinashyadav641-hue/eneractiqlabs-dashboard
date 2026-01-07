import { Link } from 'react-router-dom'

const Header = () => {
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
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pl-6">
          <div 
            className="size-9 bg-slate-200 rounded-full bg-cover bg-center border-2 border-white shadow-sm"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSXfBZTFE-ADyN5umv9ej7L9NgNecjggMikxzOhPSusIocN_U8cMVfZBSsGkd-VrbGmsHmF0HUdq1DsqnbJF0oEOk4bh-XI6Jp9h_3VjFOpsTwOqRw6HYNV_gO4PJjvm_MZ15Fau2oSkwW6INQd5bkeScJF2kE2KvzdH64hTbSBkzvjRbX75sdFUdvLbeZOivIdSBTre60pbLeRr8WPTuRYcKOEUOPC9Qv5Pyg0nRHpTVkPvAqaH0T0pslIWkdA9bw1xBi9ByCxp8x')`
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
