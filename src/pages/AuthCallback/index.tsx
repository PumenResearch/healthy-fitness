import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../contexts/ToastContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get('error_description') || params.get('error')

    if (errorParam) {
      showToast(errorParam, 'error')
      navigate('/login', { replace: true })
      return
    }

    let redirected = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (redirected) return
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        redirected = true
        showToast('Đăng nhập thành công!', 'success')
        navigate('/dashboard', { replace: true })
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !redirected) {
        redirected = true
        showToast('Đăng nhập thành công!', 'success')
        navigate('/dashboard', { replace: true })
      }
    })

    const timeout = setTimeout(() => {
      if (!redirected) {
        showToast('Đăng nhập thất bại. Vui lòng thử lại.', 'error')
        navigate('/login', { replace: true })
      }
    }, 10000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [navigate, showToast])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Đang xử lý đăng nhập...</p>
    </div>
  )
}
