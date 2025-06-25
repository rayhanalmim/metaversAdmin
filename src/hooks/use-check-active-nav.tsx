import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    // Handle exact path matches only
    return pathname === nav
  }

  return { checkActiveNav }
}
