import {
  IconLayoutDashboard,
  IconUsers,
  IconDiamond,
  IconShoppingCart,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Overview',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Users',
    label: '',
    href: '/dashboard/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'NFTs',
    label: '',
    href: '/dashboard/nfts',
    icon: <IconDiamond size={18} />,
  },
  {
    title: 'Marketplace',
    label: '',
    href: '/dashboard/marketplace',
    icon: <IconShoppingCart size={18} />,
  }
]
