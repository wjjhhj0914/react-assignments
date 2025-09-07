import navigate from '@/utils/SPA/navigate'

export type Page = 'login' | 'signup' | 'profile'

interface Props {
  user?: { username?: string | null; email?: string | null } | null
  current?: Page
}

export default function Navigation({ user, current }: Props) {
  const go = (p: Page) => navigate(p)

  return (
    <nav className="gorillaz-nav">
      <div className="brand">Gorillaz</div>

      <ul className="nav-links">
        <li>
          <button
            className={`nav-link ${current === 'signup' ? 'active' : ''}`}
            onClick={() => go('signup')}
          >
            Sign Up
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${current === 'login' ? 'active' : ''}`}
            onClick={() => go('login')}
          >
            Sign In
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${current === 'profile' ? 'active' : ''}`}
            onClick={() => go('profile')}
          >
            Profile
          </button>
        </li>
      </ul>

      <div className="user-info">
        {user?.username ?? user?.email ?? 'Guest'}
      </div>
    </nav>
  )
}
