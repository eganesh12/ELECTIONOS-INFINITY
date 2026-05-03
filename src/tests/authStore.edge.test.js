import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../firebase', () => ({ auth: {}, db: {}, googleProvider: {} }))
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn().mockRejectedValue({ code: 'auth/wrong-password' }),
  createUserWithEmailAndPassword: vi.fn().mockRejectedValue({ code: 'auth/email-already-in-use' }),
  signInWithPopup: vi.fn().mockRejectedValue({ code: 'auth/popup-closed-by-user' }),
  signOut: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return () => {} }),
  updateProfile: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(), setDoc: vi.fn(),
  getDoc: vi.fn(() => ({ exists: () => false, data: () => ({}) })),
  serverTimestamp: vi.fn(), updateDoc: vi.fn(),
}))

import { useAuthStore } from '../store/authStore'

describe('authStore error handling', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, userProfile: null, loading: false, error: null, isAuthenticated: false })
  })

  it('signIn sets error on wrong password', async () => {
    await useAuthStore.getState().signIn('test@test.com', 'wrong')
    expect(useAuthStore.getState().error).toBe('Incorrect password. Try again.')
  })

  it('signUp sets error on duplicate email', async () => {
    await useAuthStore.getState().signUp('test@test.com', 'pass123', 'Test')
    expect(useAuthStore.getState().error).toBe('This email is already registered.')
  })

  it('signInWithGoogle sets error on popup closed', async () => {
    await useAuthStore.getState().signInWithGoogle()
    expect(useAuthStore.getState().error).toBe('Google sign-in was cancelled.')
  })

  it('loading is false after failed signIn', async () => {
    await useAuthStore.getState().signIn('test@test.com', 'wrong')
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('updateXP does not crash for demo user', async () => {
    useAuthStore.setState({ user: { uid: 'demo' }, userProfile: { stats: { xp: 0 } } })
    await expect(useAuthStore.getState().updateXP(10)).resolves.not.toThrow()
    expect(useAuthStore.getState().userProfile.stats.xp).toBe(10)
  })
})
