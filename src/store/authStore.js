import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase'

const DEMO_USER = {
  uid: 'demo',
  displayName: 'Demo Citizen',
  email: 'demo@electionos.ai',
  photoURL: null,
}
const DEMO_PROFILE = {
  uid: 'demo',
  displayName: 'Demo Citizen',
  email: 'demo@electionos.ai',
  role: 'citizen',
  stats: { xp: 420, quizzesTaken: 12, aiQueries: 34 },
  createdAt: new Date().toISOString(),
  isDemo: true,
}

async function upsertProfile(user) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName || 'Citizen',
      email: user.email,
      photoURL: user.photoURL || null,
      role: 'citizen',
      stats: { xp: 0, quizzesTaken: 0, aiQueries: 0 },
      createdAt: serverTimestamp(),
    })
  }
  const fresh = await getDoc(ref)
  return fresh.data()
}

export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,

  initAuth: () => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const profile = await upsertProfile(u)
          set({ user: u, userProfile: profile, isAuthenticated: true, initialized: true })
        } catch {
          set({ user: u, userProfile: null, isAuthenticated: true, initialized: true })
        }
      } else {
        set({ user: null, userProfile: null, isAuthenticated: false, initialized: true })
      }
    })
    return unsub
  },

  enterDemo: () =>
    set({ user: DEMO_USER, userProfile: DEMO_PROFILE, isAuthenticated: true }),

  signIn: async (email, pw) => {
    set({ loading: true, error: null })
    try {
      await signInWithEmailAndPassword(auth, email, pw)
      set({ loading: false })
      return { success: true }
    } catch (e) {
      const msg = friendlyError(e.code)
      set({ loading: false, error: msg })
      return { success: false, message: msg }
    }
  },

  signUp: async (email, pw, name) => {
    set({ loading: true, error: null })
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw)
      await updateProfile(cred.user, { displayName: name })
      await upsertProfile({ ...cred.user, displayName: name })
      set({ loading: false })
      return { success: true, message: 'Account created! Welcome aboard 🎉' }
    } catch (e) {
      const msg = friendlyError(e.code)
      set({ loading: false, error: msg })
      return { success: false, message: msg }
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      const cred = await signInWithPopup(auth, googleProvider)
      await upsertProfile(cred.user)
      set({ loading: false })
      return { success: true }
    } catch (e) {
      const msg = friendlyError(e.code)
      set({ loading: false, error: msg })
      return { success: false, message: msg }
    }
  },

  signOut: async () => {
    try { await fbSignOut(auth) } catch {}
    set({ user: null, userProfile: null, isAuthenticated: false })
  },

  updateXP: async (pts) => {
    const { user, userProfile } = get()
    const newXP = (userProfile?.stats?.xp || 0) + pts
    set(s => ({
      userProfile: { ...s.userProfile, stats: { ...s.userProfile?.stats, xp: newXP } }
    }))
    if (user?.uid && user.uid !== 'demo') {
      try {
        const { updateDoc } = await import('firebase/firestore')
        await updateDoc(doc(db, 'users', user.uid), { 'stats.xp': newXP })
      } catch {}
    }
  },

  clearError: () => set({ error: null }),
}))

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
    'auth/invalid-credential': 'Incorrect email or password.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
