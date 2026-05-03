import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useAgentStore } from './store/agentStore'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load pages for better efficiency / code splitting
const AuthPage       = lazy(() => import('./pages/AuthPage'))
const DashboardPage  = lazy(() => import('./pages/DashboardPage'))
const TutorPage      = lazy(() => import('./pages/TutorPage'))
const QuizPage       = lazy(() => import('./pages/QuizPage'))
const SimulatorPage  = lazy(() => import('./pages/SimulatorPage'))
const GlobePage      = lazy(() => import('./pages/GlobePage'))
const ProfilePage    = lazy(() => import('./pages/ProfilePage'))

function PageLoader() {
  return (
    <div role="status" aria-label="Loading page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020408' }}>
      <div style={{ width: 32, height: 32, border: '3px solid rgba(0,212,255,0.2)', borderTopColor: '#00d4ff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

function Guard({ children }) {
  const auth = useAuthStore(s => s.isAuthenticated)
  return auth ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const initAuth = useAuthStore(s => s.initAuth)
  const initEventListeners = useAgentStore(s => s.initEventListeners)
  useEffect(() => { initAuth(); initEventListeners() }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#060d1a', color: '#f0f4ff', border: '1px solid rgba(0,212,255,0.2)' }, duration: 3000 }} />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/auth"      element={<AuthPage />} />
            <Route path="/"          element={<Guard><DashboardPage /></Guard>} />
            <Route path="/tutor"     element={<Guard><TutorPage /></Guard>} />
            <Route path="/quiz"      element={<Guard><QuizPage /></Guard>} />
            <Route path="/simulator" element={<Guard><SimulatorPage /></Guard>} />
            <Route path="/globe"     element={<Guard><GlobePage /></Guard>} />
            <Route path="/profile"   element={<Guard><ProfilePage /></Guard>} />
            <Route path="*"          element={<Navigate to="/auth" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
