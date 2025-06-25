import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/custom/button'
import { Users, UserPlus, UserMinus } from 'lucide-react'

const subscribersData = [
    {
        id: 1,
        name: 'Lucas Alexander',
        email: 'lucas.alexander@example.com',
        type: 'Subscribed',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'subscribed'
    },
    {
        id: 2,
        name: 'Ethan Russell',
        email: 'ethan.russell@example.com',
        type: 'Unsubscribed',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'unsubscribed'
    },
    {
        id: 3,
        name: 'Delphine Robertson',
        email: 'delphine.robertson@example.com',
        type: 'Pending',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'pending'
    },
    {
        id: 4,
        name: 'Johnna McCoy',
        email: 'johnna.mccoy@example.com',
        type: 'Pending',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'pending'
    },
    {
        id: 5,
        name: 'Jacob Jones',
        email: 'jacob.jones@example.com',
        type: 'Subscribed',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'subscribed'
    },
    {
        id: 6,
        name: 'Eleanor Pena',
        email: 'eleanor.pena@example.com',
        type: 'Unsubscribed',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'unsubscribed'
    },
    {
        id: 7,
        name: 'Esther Howard',
        email: 'esther.howard@example.com',
        type: 'Subscribed',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'subscribed'
    },
    {
        id: 8,
        name: 'Tim Jennings',
        email: 'tim.jennings@example.com',
        type: 'Pending',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'pending'
    },
    {
        id: 9,
        name: 'Annette Black',
        email: 'annette.black@example.com',
        type: 'Pending',
        startDate: '4/4/19',
        endDate: '4/4/19',
        status: 'pending'
    }
]

export default function Subscribers() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'subscribed':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Subscribed</Badge>
            case 'unsubscribed':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unsubscribed</Badge>
            case 'pending':
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Layout className="dark:bg-gray-950">
                {/* ===== Top Heading ===== */}
                <Layout.Header className="dark:bg-gray-950 dark:border-gray-800">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                            <div className="p-2">
                                <Users className="w-6 h-6 dark:text-gray-300" />
                            </div>
                            <span className="text-lg font-medium dark:text-white">Subscribers</span>
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
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">821K</div>
                                <p className="text-xs text-green-600">+1.03% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">New Subscribed</CardTitle>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,156</div>
                                <p className="text-xs text-green-600">+0.08% from last month</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
                                <UserMinus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">167</div>
                                <p className="text-xs text-red-600">-1.03% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Subscribers Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscribers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 font-medium">#</th>
                                            <th className="text-left p-2 font-medium">Name</th>
                                            <th className="text-left p-2 font-medium">Email</th>
                                            <th className="text-left p-2 font-medium">Type</th>
                                            <th className="text-left p-2 font-medium">Start Date</th>
                                            <th className="text-left p-2 font-medium">End Date</th>
                                            <th className="text-left p-2 font-medium">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {subscribersData.map((subscriber) => (
                                            <tr key={subscriber.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="p-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                                                        {subscriber.id.toString().padStart(2, '0')}
                                                    </div>
                                                </td>
                                                <td className="p-2 font-medium">{subscriber.name}</td>
                                                <td className="p-2 text-gray-600 dark:text-gray-400">{subscriber.email}</td>
                                                <td className="p-2">{getStatusBadge(subscriber.status)}</td>
                                                <td className="p-2 text-gray-600 dark:text-gray-400">{subscriber.startDate}</td>
                                                <td className="p-2 text-gray-600 dark:text-gray-400">{subscriber.endDate}</td>
                                                <td className="p-2">
                                                    <Button variant="ghost" size="sm">...</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing 1 to 9 of 100 entries
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">Previous</Button>
                                    <Button variant="outline" size="sm" className="bg-blue-500 text-white">1</Button>
                                    <Button variant="outline" size="sm">2</Button>
                                    <Button variant="outline" size="sm">3</Button>
                                    <Button variant="outline" size="sm">...</Button>
                                    <Button variant="outline" size="sm">10</Button>
                                    <Button variant="outline" size="sm">Next</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Layout.Body>
            </Layout>
        </div>
    )
} 