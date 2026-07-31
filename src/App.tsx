import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import './contexts/Toast.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AuthCallback from './pages/AuthCallback'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout'
import Feed from './pages/DashboardPage/Feed'
import ComingSoon from './pages/ComingSoon'
import ProgressPage from './pages/ProgressPage'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<ComingSoon title="Tổng quan" />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/tien-canh" element={<Feed channel="tien_canh" />} />
                <Route path="/workouts" element={<ComingSoon title="Bài tập" />} />
                <Route path="/nutrition" element={<ComingSoon title="Dinh dưỡng" />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/schedule" element={<ComingSoon title="Lịch tập" />} />
                <Route path="/settings" element={<ComingSoon title="Cài đặt" />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
