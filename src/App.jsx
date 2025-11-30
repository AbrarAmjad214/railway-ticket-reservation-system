import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Trains from './pages/Trains'
import Bookings from './pages/Bookings'
import Schedules from './pages/Schedules'
import BookingForm from './pages/BookingForm'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar user={user} setUser={setUser} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} />
              <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/dashboard" replace />} />
              <Route path="/trains" element={user ? <Trains /> : <Navigate to="/login" replace />} />
              <Route path="/schedules" element={user ? <Schedules /> : <Navigate to="/login" replace />} />
              <Route path="/bookings" element={user ? <Bookings user={user} /> : <Navigate to="/login" replace />} />
              <Route path="/book/:scheduleId" element={user ? <BookingForm user={user} /> : <Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
