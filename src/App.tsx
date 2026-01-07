import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header'
import FleetDashboard from './components/dashboard/FleetDashboard'
import AssetWorkspace from './components/asset/AssetWorkspace'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-background-light">
        <Header />
        <main className="flex-1 px-6 py-8 max-w-[1600px] mx-auto w-full relative z-10">
          <Routes>
            <Route path="/" element={<FleetDashboard />} />
            <Route path="/asset/:assetId" element={<AssetWorkspace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
