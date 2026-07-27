import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Đang tải...</p>
      </div>
    )
  }

  // Cho phép bypass login ở môi trường Local Dev nếu không có session
  const isBypassEnabled = import.meta.env.DEV || import.meta.env.VITE_BYPASS_AUTH === 'true'

  if (!session && !isBypassEnabled) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
