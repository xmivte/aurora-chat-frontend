import { initializeApp } from 'firebase/app'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './index.css'
import AuthRoute from './components/AuthRoute.tsx'
import App from './pages/App.tsx'
import Login from './pages/Login.tsx'

const firebaseConfig = {
  apiKey: 'REDACTED_FIREBASE_API_KEY',
  authDomain: 'sourcery-academy.firebaseapp.com',
  projectId: 'sourcery-academy',
  storageBucket: 'sourcery-academy.firebasestorage.app',
  messagingSenderId: '353162277002',
  appId: '1:353162277002:web:0f5529cfcf6303a66bfd73',
}

initializeApp(firebaseConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <App />
            </AuthRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </StrictMode>
)
