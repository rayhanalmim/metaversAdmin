import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, UserMinus, BarChart3 } from 'lucide-react'

const newSubscribers = [
  { id: 1, name: 'Nabul Ding', avatar: '👤', date: 'Just now' },
  { id: 2, name: 'Umar Ding', avatar: '👤', date: '5 min ago' },
  { id: 3, name: 'Jabil Gana', avatar: '👤', date: '10 min ago' },
  { id: 4, name: 'Karlay Diamma', avatar: '👤', date: '15 min ago' },
  { id: 5, name: 'Folka Morrison', avatar: '👤', date: '20 min ago' },
  { id: 6, name: 'Woody Macy', avatar: '👤', date: '25 min ago' },
  { id: 7, name: 'Guy Hawkins', avatar: '👤', date: '30 min ago' },
  { id: 8, name: 'Jerome Bell', avatar: '👤', date: '35 min ago' },
  { id: 9, name: 'Theresa Webb', avatar: '👤', date: '40 min ago' },
  { id: 10, name: 'Devon Lane', avatar: '👤', date: '45 min ago' },
  { id: 11, name: 'Albert Flores', avatar: '👤', date: '50 min ago' },
  { id: 12, name: 'Jacob Jones', avatar: '👤', date: '55 min ago' },
  { id: 13, name: 'Robert Fox', avatar: '👤', date: '1 hour ago' },
  { id: 14, name: 'Jenny Wilson', avatar: '👤', date: '1 hour ago' },
  { id: 15, name: 'Floyd Miles', avatar: '👤', date: '1 hour ago' },
  { id: 16, name: 'Courtney Henry', avatar: '👤', date: '2 hours ago' },
  { id: 17, name: 'Kristin Watson', avatar: '👤', date: '2 hours ago' }
]

const unsubscribed = [
  { id: 1, name: 'John Doe', avatar: '👤', date: 'View all' },
  { id: 2, name: 'Jane Smith', avatar: '👤', date: 'View all' },
  { id: 3, name: 'Mike Johnson', avatar: '👤', date: 'View all' },
  { id: 4, name: 'Sarah Wilson', avatar: '👤', date: 'View all' },
  { id: 5, name: 'Tom Brown', avatar: '👤', date: 'View all' }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Layout className="dark:bg-gray-950">
        {/* ===== Top Heading ===== */}
        <Layout.Header className="dark:bg-gray-950 dark:border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2">
                <BarChart3 className="w-6 h-6 dark:text-gray-300" />
              </div>
              <span className="text-lg font-medium dark:text-white">Dashboard</span>
            </div>
          </div>
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>

        {/* ===== Main ===== */}
        <Layout.Body className="dark:bg-gray-950">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Side - Stats and Chart */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total User</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1K</div>
                    <p className="text-xs text-green-600">+1.03% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">956</div>
                    <p className="text-xs text-red-600">-0.04% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Free Users</CardTitle>
                    <UserMinus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">44</div>
                    <p className="text-xs text-green-600">+0.08% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Subscription Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subscription this Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">500</span>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Trials</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                            <span>Subscribed</span>
                          </div>
                        </div>
                      </div>

                      {/* Simple Chart Representation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Monthly</span>
                          <span>5</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="flex-1 h-8 bg-blue-500 rounded"></div>
                          <div className="flex-1 h-8 bg-blue-400 rounded"></div>
                          <div className="flex-1 h-8 bg-blue-300 rounded"></div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span>Yearly</span>
                          <span>25</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="flex-1 h-12 bg-gray-800 rounded"></div>
                          <div className="flex-1 h-12 bg-gray-700 rounded"></div>
                          <div className="flex-1 h-12 bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Rate */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Subscription Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${82 * 3.51} 351`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">82%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side - User Lists */}
            <div className="space-y-6">
              {/* New Subscribers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">New Subscribers</CardTitle>
                  <span className="text-sm text-blue-600 cursor-pointer">View all</span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {newSubscribers.slice(0, 10).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                            {user.avatar}
                          </div>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{user.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Unsubscribed */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Unsubscribed</CardTitle>
                  <span className="text-sm text-blue-600 cursor-pointer">View all</span>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {unsubscribed.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                            {user.avatar}
                          </div>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                        <span className="text-xs text-blue-600 cursor-pointer">{user.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </div>
  )
}
