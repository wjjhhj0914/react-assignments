import { useState } from 'react'
import { toast } from 'sonner'
import characterImage from '@/assets/murdoc.png'
// 이미지 import
import backgroundImage from '@/assets/plastic-beach.png'
import supabase from '@/libs/supabase'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !pw) return toast.error('이메일과 비밀번호를 입력하세요.')
    if (pw !== pw2) return toast.error('비밀번호가 일치하지 않습니다.')

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: { data: { username, bio } },
      })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('회원가입 완료! 이메일 인증 링크를 확인해 주세요.')
    } finally {
      setLoading(false)
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
          <h2 className="gorillaz-form-title">Sign Up</h2>
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
              name="username"
              type="text"
              className="gorillaz-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={2}
            />
            <input
              name="bio"
              type="text"
              className="gorillaz-input"
              placeholder="Bio (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
            <input
              name="confirmPassword"
              type="password"
              className="gorillaz-input"
              placeholder="Confirm Password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              required
            />
            <button
              type="submit"
              className="gorillaz-button"
              disabled={loading}
            >
              {loading ? 'Loading…' : 'Create account'}
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
