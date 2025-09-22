import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'
import SignIn from '@/pages/auth/sign-in'
import SignUp from '@/pages/auth/sign-up'

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  // Auth routes
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },

  // Main routes
  {
    path: '/dashboard',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard/overview')).default,
        }),
      },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('./pages/dashboard/users')).default,
        }),
      },
      {
        path: 'nfts',
        lazy: async () => ({
          Component: (await import('./pages/dashboard/nfts')).default,
        }),
      },
      {
        path: 'marketplace',
        lazy: async () => ({
          Component: (await import('./pages/dashboard/marketplace')).default,
        }),
      },
      {
        path: 'analytics',
        lazy: async () => ({
          Component: (await import('./pages/dashboard/analytics')).default,
        }),
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
