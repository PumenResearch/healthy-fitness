import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardLayout from './components/DashboardLayout'
import Dashboard from './pages/DashboardPage'
import Feed from './pages/DashboardPage/Feed'
import ComingSoon from './pages/ComingSoon'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ComingSoon title="Tổng quan" />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/workouts" element={<ComingSoon title="Bài tập" />} />
          <Route path="/nutrition" element={<ComingSoon title="Dinh dưỡng" />} />
          <Route path="/progress" element={<ComingSoon title="Tiến trình" />} />
          <Route path="/schedule" element={<ComingSoon title="Lịch tập" />} />
          <Route path="/settings" element={<ComingSoon title="Cài đặt" />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
