import {
  IconLayoutDashboard,
  IconUsers,
  IconDiamond,
  IconShoppingCart,
  IconVideo,
  IconBroadcast,
  IconSword,
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { useT } from '@/i18n/I18nContext'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

/** Internal definitions: titles are i18n keys, resolved by `useSidelinks()`. */
const RAW_SIDELINKS = [
  { titleKey: 'nav.overview',     href: '/dashboard',                 icon: <IconLayoutDashboard size={18} /> },
  { titleKey: 'nav.users',        href: '/dashboard/users',           icon: <IconUsers size={18} /> },
  { titleKey: 'nav.nfts',         href: '/dashboard/nfts',            icon: <IconDiamond size={18} /> },
  { titleKey: 'nav.marketplace',  href: '/dashboard/marketplace',     icon: <IconShoppingCart size={18} /> },
  { titleKey: 'nav.live_stream',  href: '/dashboard/livestream',      icon: <IconVideo size={18} /> },
  { titleKey: 'nav.user_streams', href: '/dashboard/user-streams',    icon: <IconBroadcast size={18} /> },
  { titleKey: 'nav.ai_samurai',   href: '/dashboard/ai-samurai',      icon: <IconSword size={18} /> },
]

/** Reactive, translated sidelinks. Use this hook in components. */
export function useSidelinks(): SideLink[] {
  const t = useT()
  return useMemo(
    () =>
      RAW_SIDELINKS.map((l) => ({
        title: t(l.titleKey),
        label: '',
        href: l.href,
        icon: l.icon,
      })),
    [t],
  )
}

/** Static fallback for legacy imports — English labels, not localized. */
export const sidelinks: SideLink[] = RAW_SIDELINKS.map((l) => ({
  title: l.titleKey.replace('nav.', '').replace(/_/g, ' '),
  label: '',
  href: l.href,
  icon: l.icon,
}))
