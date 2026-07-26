import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'
import './SignupPage.css'

function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    if (!agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản sử dụng!')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('Đăng ký thành công!')
    }, 2000)
  }

  const EyeOpen = () => (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const EyeClosed = () => (
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div className="login-page">
      {/* Background */}
      <div className="login-bg">
        <div className="login-bg-overlay" />
      </div>

      {/* Animated particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Signup Card */}
      <div className="login-container signup-container">
        <div className="login-card">
          {/* Logo / Brand */}
          <div className="login-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="brand-title">TẠO TÀI KHOẢN</h1>
            <p className="brand-subtitle">Tham gia cộng đồng Healthy Fitness ngay hôm nay</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} id="signup-form">
            {/* Full Name */}
            <div className="form-group">
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  id="fullname-input"
                  type="text"
                  placeholder="Họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <div className="input-glow" />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                  <path
                    d="M22 6l-10 7L2 6"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
                <input
                  id="signup-email-input"
                  type="email"
                  placeholder="Địa chỉ email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <div className="input-glow" />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="signup-password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  id="toggle-signup-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
                <div className="input-glow" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  id="toggle-confirm-password-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
                <div className="input-glow" />
              </div>
            </div>

            {/* Password strength indicator */}
            <div className="password-strength">
              <div className="strength-bars">
                <span className={`strength-bar ${password.length >= 1 ? (password.length >= 8 ? 'strong' : 'weak') : ''}`} />
                <span className={`strength-bar ${password.length >= 4 ? (password.length >= 8 ? 'strong' : 'medium') : ''}`} />
                <span className={`strength-bar ${password.length >= 6 ? (password.length >= 10 ? 'strong' : 'medium') : ''}`} />
                <span className={`strength-bar ${password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'strong' : ''}`} />
              </div>
              {password.length > 0 && (
                <span className="strength-text">
                  {password.length < 6 ? 'Yếu' : password.length < 8 ? 'Trung bình' : 'Mạnh'}
                </span>
              )}
            </div>

            {/* Terms */}
            <div className="form-options">
              <label className="remember-me" htmlFor="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="custom-checkbox" />
                <span className="terms-text">
                  Tôi đồng ý với{' '}
                  <a href="#" className="terms-link" id="terms-link">Điều khoản</a>
                  {' '}và{' '}
                  <a href="#" className="terms-link" id="privacy-link">Chính sách bảo mật</a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              id="signup-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner" />
              ) : (
                <>
                  <span>ĐĂNG KÝ</span>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>HOẶC</span>
          </div>

          {/* Social Signup */}
          <div className="social-login">
            <button type="button" className="social-btn google-btn google-btn--full" id="google-signup-btn">
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.55c2.08-1.92 3.29-4.74 3.29-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.55-2.76c-.99.66-2.25 1.06-3.73 1.06-2.87 0-5.29-1.94-6.16-4.54H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.1a6.18 6.18 0 0 1 0-4.2V7.06H2.18a10.02 10.02 0 0 0 0 9.88l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.06l3.66 2.84c.87-2.6 3.29-4.15 6.16-4.15z" fill="#EA4335"/>
              </svg>
              <span>Đăng ký bằng Google</span>
            </button>
          </div>

          {/* Login link */}
          <p className="signup-text">
            Đã có tài khoản?{' '}
            <Link to="/login" className="signup-link" id="login-link">
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Motivational quote */}
        <div className="motivational-quote">
          <p>"The only bad workout is the one that didn't happen"</p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
