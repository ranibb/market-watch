import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCfo9v6mUIJuF-7XauFWbijd1J2vxuxDJM',
  authDomain: 'market-watch-e121b.firebaseapp.com',
  projectId: 'market-watch-e121b',
  storageBucket: 'market-watch-e121b.firebasestorage.app',
  messagingSenderId: '612962891796',
  appId: '1:612962891796:web:54d071c5511ff79bea0f01',
}

// =================================================================
// THE SINGLETON PATTERN
// Initialize Firebase ONCE when this module is first imported.
const app = initializeApp(firebaseConfig)

// Initialize and export the services ONCE.
// Any other file that imports 'auth' will get this exact same instance.
export const auth = getAuth(app)
// =================================================================
