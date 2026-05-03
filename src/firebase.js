import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDL1Ju0uZZOH8rTOdATDxqmZbzRBi0l3E4',
  authDomain: 'electionos-infinity.firebaseapp.com',
  projectId: 'electionos-infinity',
  storageBucket: 'electionos-infinity.firebasestorage.app',
  messagingSenderId: '952523561186',
  appId: '1:952523561186:web:6b8b64008f6c83faf566bb',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// persist sessions across page reloads
setPersistence(auth, browserLocalPersistence).catch(() => {})
