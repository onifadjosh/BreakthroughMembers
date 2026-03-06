import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

const API_BASE_URL = 'https://breakthrough-users.vercel.app/api'

function App() {
  const [user, setUser] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null
    return saved ? JSON.parse(saved) : null
  })
  const [message, setMessage] = useState(null)

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Register 
            message={message} 
            setMessage={setMessage} 
            API_BASE_URL={API_BASE_URL} 
          />
        } 
      />
      <Route 
        path="/admin/login" 
        element={
          <Login 
            message={message} 
            setMessage={setMessage} 
            setUser={setUser} 
            API_BASE_URL={API_BASE_URL} 
          />
        } 
      />
      <Route 
        path="/admin" 
        element={
          <Dashboard 
            user={user} 
            setUser={setUser} 
            API_BASE_URL={API_BASE_URL} 
          />
        } 
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
