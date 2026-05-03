import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useAgentStore } from './store/agentStore'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import TutorPage from './pages/TutorPage'
import QuizPage from './pages/QuizPage'
import SimulatorPage from './pages/SimulatorPage'
import GlobePage from './pages/GlobePage'
import ProfilePage from './pages/ProfilePage'

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
      <Toaster position="top-right" toastOptions={{ style:{ background:'#060d1a', color:'#f0f4ff', border:'1px solid rgba(0,212,255,0.2)' }, duration:3000 }} />
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
    </BrowserRouter>
  )
}
