import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import characterImage from '@/assets/murdoc.png'
import backgroundImage from '@/assets/plastic-beach.png'
import supabase from '@/libs/supabase'
import navigate from '@/utils/SPA/navigate'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)

  const subRef = useRef<ReturnType<
    typeof supabase.auth.onAuthStateChange
  > | null>(null)

  useEffect(() => {
    return () => {
      subRef.current?.data.subscription.unsubscribe()
      subRef.current = null
    }
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !pw) return toast.error('이메일과 비밀번호를 입력하세요.')

    if (
      location.hash &&
      /access_token|refresh_token|type=/.test(location.hash)
    ) {
      history.replaceState({}, '', location.pathname + location.search)
    }

    setLoading(true)

    if (!subRef.current) {
      subRef.current = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            toast.success('로그인 성공!')
            setLoading(false)
            navigate('profile')
          }
        }
      )
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      })
      if (error) {
        setLoading(false)
        return toast.error(error.message)
      }

      setTimeout(async () => {
        if (!loading) return
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          toast.success('로그인 성공!')
          setLoading(false)
          navigate('profile')
        } else {
          setLoading(false)
          toast.error('로그인이 지연됩니다. 다시 시도해 주세요.')
        }
      }, 4000)
    } catch (err: any) {
      setLoading(false)
      toast.error(err?.message ?? '로그인 중 오류가 발생했어요.')
    }
  }

  return (
    <div
      className="gorillaz-auth-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="gorillaz-auth-overlay" />

      <div className="gorillaz-form-section">
        <section className="gorillaz-form-card">
          <h2 className="gorillaz-form-title">Sign In</h2>
          <form onSubmit={onSubmit} className="gorillaz-form">
            <input
              name="email"
              type="email"
              className="gorillaz-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              name="password"
              type="password"
              className="gorillaz-input"
              placeholder="Password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
            />
            <button
              type="submit"
              className="gorillaz-button"
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Sign in'}
            </button>
          </form>
        </section>
      </div>

      <div className="gorillaz-character-section">
        <img
          src={characterImage}
          alt="Murdoc Gorillaz Character"
          className="gorillaz-character-image"
        />
      </div>
    </div>
  )
}
