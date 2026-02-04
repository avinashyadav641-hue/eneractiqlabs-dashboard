import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import FleetDashboard from './components/dashboard/FleetDashboard'
import AssetWorkspace from './components/asset/AssetWorkspace'
import LoginPage from './components/auth/LoginPage'

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

// Main app layout with header
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />
      <main className="flex-1 px-6 py-8 max-w-[1600px] mx-auto w-full relative z-10">
        {children}
      </main>
    </div>
  )
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FleetDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/asset/:assetId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AssetWorkspace />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
