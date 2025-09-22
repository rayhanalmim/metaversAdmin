import { Button } from '@/components/custom/button';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';

const Header = () => {
    return (
        <Layout.Header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between w-full gap-4 px-6">
                {/* Left section */}
                <div className="flex items-center gap-4 flex-1">
                    <Search />

                </div>

                {/* Right section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            Documentation
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                    </Button>

                    {/* Quick Actions */}
                    <Button variant="ghost" size="icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                    </Button>

                    {/* Theme Switch */}
                    <ThemeSwitch />

                    {/* Divider */}
                    <div className="h-6 w-px bg-border"></div>

                    {/* User Navigation */}
                    <UserNav />
                </div>
            </div>
        </Layout.Header>
    );
};

export default Header;