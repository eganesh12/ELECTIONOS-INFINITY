import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock firebase modules
vi.mock('../firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
}))

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return () => {} }),
  updateProfile: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => ({ exists: () => false, data: () => ({}) })),
  serverTimestamp: vi.fn(),
  updateDoc: vi.fn(),
}))

import { useAuthStore } from '../store/authStore'

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null, userProfile: null, loading: false,
      error: null, isAuthenticated: false, initialized: false,
    })
  })

  it('enterDemo sets demo user and authenticates', () => {
    useAuthStore.getState().enterDemo()
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user.uid).toBe('demo')
    expect(state.userProfile.isDemo).toBe(true)
  })

  it('clearError resets error to null', () => {
    useAuthStore.setState({ error: 'Some error' })
    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it('updateXP increments XP correctly', async () => {
    useAuthStore.setState({
      user: { uid: 'demo' },
      userProfile: { stats: { xp: 100 } },
    })
    await useAuthStore.getState().updateXP(50)
    expect(useAuthStore.getState().userProfile.stats.xp).toBe(150)
  })

  it('signOut clears user state', async () => {
    useAuthStore.setState({ user: { uid: '123' }, isAuthenticated: true })
    await useAuthStore.getState().signOut()
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})
