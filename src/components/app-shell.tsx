import { Outlet, Navigate } from 'react-router-dom'
import { useMetaverseAdminAuth } from '@/hooks/useMetaverseAdminAuth'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const { isAuthenticated, isLoading } = useMetaverseAdminAuth()

  console.log('🏠 [APP-SHELL] Authentication state:', { isAuthenticated, isLoading });

  // Show loading state while checking authentication
  if (isLoading) {
    console.log('🏠 [APP-SHELL] Showing loading state...');
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    console.log('🏠 [APP-SHELL] Not authenticated, redirecting to sign-in...');
    return <Navigate to="/sign-in" replace />
  }

  console.log('🏠 [APP-SHELL] Authenticated, rendering dashboard content...');
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden overflow-y-auto h-full transition-[margin-left] ease-in-out duration-300 ${
          isCollapsed ? 'md:ml-14' : 'md:ml-64'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}
