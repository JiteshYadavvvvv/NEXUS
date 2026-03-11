import { Link, useLocation } from "react-router-dom";
import { Github, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export function Navbar({ onOpenLogin, onOpenSidebar, isSidebarOpen }) {
    const [profile, setProfile] = React.useState(null);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;
    const isActiveHash = (hash) => location.hash === hash;

    React.useEffect(() => {
        let mounted = true;
        fetch('/auth/profile')
            .then((res) => {
                if (!res.ok) throw new Error('not-authenticated');
                return res.json();
            })
            .then((data) => {
                if (mounted) setProfile(data);
            })
            .catch(() => {
                // Not authenticated or error
            });
        return () => {
            mounted = false;
        };
    }, []);

    const navItems = React.useMemo(() => [
        { label: 'Home', href: '/', isActive: () => isActive("/") && !location.hash },
        ...(profile?.role === 'Admin' ? [{ label: 'Dashboard', href: '/profile/Admin', isActive: () => isActive("/profile/Admin") }] : []),
        { label: 'About Us', href: '#about', isHash: true, isActive: () => isActiveHash("#about") },
        { label: 'Clubs', href: '/clubs', isActive: () => isActive("/clubs") },
        { label: 'Developers', href: '/developers', isActive: () => isActive("/developers") },
    ], [profile, location.pathname, location.hash]);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 transition-all font-mono duration-300 bg-black/40 dark:bg-[#0d1117]/60 backdrop-blur-md border-b border-white/10 dark:border-white/5">
            <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1200px]">
                <div className="flex items-center justify-between h-[72px]">

                    {/* Left Section: Logo + Navigation Links */}
                    <div className="flex items-center gap-6 lg:gap-10">
                        {/* Logo */}
                        <Link to="/" className="flex items-center flex-shrink-0 group">
                            <img src="/nexus.svg" alt="NEXUS Logo" className="h-6 w-10 sm:w-16 object-contain group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300 ease-in-out rounded-full" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-4 lg:gap-6">
                            {navItems.map((item, idx) => (
                                item.isHash ? (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        className={cn(
                                            "text-sm lg:text-[15px] font-medium transition-colors hover:text-white whitespace-nowrap",
                                            item.isActive() ? "text-white" : "text-gray-400"
                                        )}
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={idx}
                                        to={item.href}
                                        className={cn(
                                            "text-sm lg:text-[15px] font-medium transition-colors hover:text-white whitespace-nowrap",
                                            item.isActive() ? "text-white" : "text-gray-400"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Right Section: Search, Actions & Mobile Toggle */}
                    <div className="flex items-center gap-3 lg:gap-4 ml-auto">

                        {/* Search Bar (Desktop Only) */}
                        <div className="hidden lg:flex w-64 xl:w-80">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full h-10 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2 lg:gap-3">
                            <Button
                                variant="ghost"
                                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-4 lg:px-5 font-medium whitespace-nowrap"
                                onClick={onOpenLogin}
                            >
                                Login
                            </Button>

                            <Link to="/connect" className="inline-flex items-center justify-center h-10 px-4 lg:px-5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors shadow-lg whitespace-nowrap">
                                Connect
                            </Link>

                            <Link to="https://github.com/Jitesh-Yadav01/SYNC-AIT" target="_blank" className="hidden lg:inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all flex-shrink-0">
                                <Github className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-white rounded-full hover:bg-white/10 flex-shrink-0"
                            onClick={onOpenSidebar}
                            aria-label="Toggle Menu"
                        >
                            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>

                </div>
            </div>
        </nav>
    );
}

