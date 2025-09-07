import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import backgroundImage from '@/assets/plastic-beach.png'
import supabase, { type Profile, type ProfileUpdate } from '@/libs/supabase'

function toUndef(v: string) {
  const t = v.trim()
  return t === '' ? undefined : t
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    const loadOrCreateProfile = async () => {
      setLoading(true)

      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession()

        if (sessionError) {
          toast.error('세션을 확인할 수 없습니다.')
          return
        }

        if (!sessionData?.session) {
          setLoading(false)
          return
        }

        const { user: authUser } = sessionData.session

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()

        if (profileError) {
          toast.error(`프로필 조회 실패: ${profileError.message}`)
          return
        }

        if (profile) {
          setUser(profile)
          setUsername(profile.username || '')
          setEmail(profile.email || '')
          setBio(profile.bio || '')
        } else {
          const newProfileData = {
            id: authUser.id,
            email: authUser.email || null,
            username: authUser.user_metadata?.username || null,
            bio: authUser.user_metadata?.bio || null,
          }

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single()

          if (createError) {
            toast.error(`프로필 생성 실패: ${createError.message}`)
          } else {
            setUser(newProfile)
            setUsername(newProfile.username || '')
            setEmail(newProfile.email || '')
            setBio(newProfile.bio || '')
            toast.success('프로필이 자동으로 생성되었습니다!')
          }
        }
      } catch (error) {
        toast.error('프로필을 처리하는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadOrCreateProfile()
  }, [])

  // 유효성 검사
  const isValidEmail = (v: string): boolean => {
    const trimmed = v.trim()
    return trimmed === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
  }

  const isValidUsername = (v: string): boolean => {
    const trimmed = v.trim()
    return trimmed === '' || trimmed.length >= 2
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error('로그인 후 이용해 주세요.')
      return
    }

    // 유효성 검사
    if (!isValidUsername(username)) {
      toast.error('사용자명은 2자 이상 입력해 주세요.')
      return
    }
    if (!isValidEmail(email)) {
      toast.error('이메일 형식이 올바르지 않습니다.')
      return
    }

    setSaving(true)

    try {
      const payload: ProfileUpdate = {
        username: toUndef(username),
        email: toUndef(email),
        bio: toUndef(bio),
      }

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)

      if (error) {
        toast.error(`프로필 저장 실패: ${error.message}`)
      } else {
        toast.success('프로필이 성공적으로 저장되었습니다!')
        setUser({ ...user, ...payload })
      }
    } catch (error) {
      toast.error('프로필 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  // 로딩 상태
  if (loading) {
    return (
      <div
        className="gorillaz-profile-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="gorillaz-auth-overlay" />
        <section className="gorillaz-profile-card">
          <h2 className="gorillaz-form-title">Profile</h2>
          <div className="gorillaz-profile-loading">
            <div className="gorillaz-loading-message">
              프로필을 불러오는 중...
            </div>
          </div>
        </section>
      </div>
    )
  }

  // 비로그인 상태
  if (!user) {
    return (
      <div
        className="gorillaz-profile-container"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="gorillaz-auth-overlay" />
        <section className="gorillaz-profile-card">
          <h2 className="gorillaz-form-title">Profile</h2>
          <div className="gorillaz-profile-loading">
            <p className="gorillaz-profile-message">
              프로필을 보려면 로그인이 필요합니다.
            </p>
            <button
              className="gorillaz-button"
              onClick={() => (window.location.href = '/?page=login')}
            >
              로그인 페이지로 이동
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div
      className="gorillaz-profile-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="gorillaz-auth-overlay" />

      <section className="gorillaz-profile-card">
        <h2 className="gorillaz-form-title">Profile</h2>
        <div className="gorillaz-profile-info">
          <h3 className="gorillaz-profile-info-title">현재 프로필 정보</h3>
          <div className="gorillaz-profile-info-content">
            <div className="gorillaz-profile-info-item">
              <span className="gorillaz-profile-info-label">이름:</span>
              <span className="gorillaz-profile-info-value">
                {user.username || '(없음)'}
              </span>
            </div>
            <div className="gorillaz-profile-info-item">
              <span className="gorillaz-profile-info-label">이메일:</span>
              <span className="gorillaz-profile-info-value">
                {user.email || '(없음)'}
              </span>
            </div>
            <div className="gorillaz-profile-info-item">
              <span className="gorillaz-profile-info-label">소개:</span>
              <span className="gorillaz-profile-info-value">
                {user.bio || '(없음)'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="gorillaz-form">
          <div className="gorillaz-form-group">
            <label className="gorillaz-form-label">
              사용자명 <span className="gorillaz-required-mark">*</span>
            </label>
            <input
              name="username"
              type="text"
              className={`gorillaz-input ${!isValidUsername(username) && username.trim() !== '' ? 'border-red-300' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="사용자명을 입력하세요 (2자 이상)"
              minLength={2}
            />
            {!isValidUsername(username) && username.trim() !== '' && (
              <p className="gorillaz-error-message">
                사용자명은 2자 이상이어야 합니다.
              </p>
            )}
          </div>

          <div className="gorillaz-form-group">
            <label className="gorillaz-form-label">이메일</label>
            <input
              name="email"
              type="email"
              className={`gorillaz-input ${!isValidEmail(email) ? 'border-red-300' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
            {!isValidEmail(email) && (
              <p className="gorillaz-error-message">
                올바른 이메일 형식을 입력해주세요.
              </p>
            )}
          </div>

          <div className="gorillaz-form-group">
            <label className="gorillaz-form-label">자기소개</label>
            <textarea
              name="bio"
              className="gorillaz-textarea"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요."
            />
          </div>

          <button
            type="submit"
            className="gorillaz-button"
            disabled={
              saving || !isValidUsername(username) || !isValidEmail(email)
            }
          >
            {saving ? '저장 중...' : '프로필 저장'}
          </button>
        </form>
      </section>
    </div>
  )
}
