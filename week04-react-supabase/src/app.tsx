import { useEffect } from 'react'
import type { JSX } from 'react'
import SignInPage from '@/pages/auth/SignInPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import Navigation, { type Page } from '@/pages/common/Navigation'
import ProfilePage from '@/pages/profile/ProfilePage'
import usePageQuery from '@/utils/SPA/use-page-query'

export default function AppPage(): JSX.Element {
  const page = usePageQuery<Page>('login')

  useEffect(() => {
    if (
      location.hash &&
      /access_token|refresh_token|type=/.test(location.hash)
    ) {
      history.replaceState({}, '', location.pathname + location.search)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }, [])

  let renderPage: JSX.Element | null = null
  switch (page) {
    case 'login':
      renderPage = <SignInPage />
      break
    case 'signup':
      renderPage = <SignUpPage />
      break
    case 'profile':
      renderPage = <ProfilePage />
      break
  }

  return (
    <div className="min-h-screen">
      <Navigation user={null} current={page} />
      {renderPage}
    </div>
  )
}
