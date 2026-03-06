import { Link, useLocation } from "react-router-dom";
import { Github, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";
import PillNav from "./PillNav";



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
                
            });
        return () => {
            mounted = false;
        };
    }, []);

    const navItems = React.useMemo(() => [
        { label: 'Home', href: '/' },
        ...(profile?.role === 'Technical Executive' ? [{ label: 'Dashboard', href: '/profile/Te' }] : []),
        { label: 'About Us', href: '#about' },
        { label: 'Clubs', href: '/clubs' },
        // { label: 'Team', href: 'https://www.gdgaitpune.me/',target:'_blank' },
        { label: 'Developers', href: '/developers' },
        { type: 'search', placeholder: 'Search...' },
        { label: 'Login', href:'/login'},
        { label: 'Connect', href:'/connect'}
        // { 
        //     label: (
        //         <span className="flex items-center gap-2">
        //             <Github className="w-4 h-4" />
        //             Star on GitHub
        //         </span>
        //     ), 
        //     href: 'https://github.com/Jitesh-Yadav01/SYNC-AIT',
        //     target: '_blank'
        // }
    ], [profile, onOpenLogin]);

    return (
        <>
            <PillNav
                logo="/clublogos/google-developers.svg"
                logoAlt="NEXUS Logo"
                items={navItems}
                activeHref={location.pathname}
                className="md:mx-auto"
                baseColor="#000"
                pillColor="#fff"
                hoveredPillTextColor="#fff"
                pillTextColor="#000"
                initialLoadAnimation
                mobileMenuTrigger={
                    <Button variant="ghost" size="icon" className="md:hidden text-black dark:text-white" onClick={onOpenSidebar}>
                        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                }
            />
            {/*
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl rounded-xl border border-white/20 bg-white/10 dark:bg-black/40 dark:border-white/10 backdrop-blur-md shadow-2xl supports-backdrop-filter:bg-white/30">
            <div className="flex h-18 items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="#" alt="SYNC-AIT Logo" width={18} height={18} className="h-6 w-auto" />
                        <span className="font-jersey-20 text-4xl font-bold text-black/82 dark:text-white/90">SYNC-AIT</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link to="/" className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-transparent data-[state=open]:bg-transparent", isActive("/") && !location.hash ? "text-blue-500" : "text-muted-foreground")}>
                                            Home
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {profile?.role === 'Technical Executive' && (
                                    <NavigationMenuItem>
                                        <NavigationMenuLink asChild>
                                            <Link to="/profile/Te" className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-transparent data-[state=open]:bg-transparent", isActive("/profile/Te") ? "text-blue-500" : "text-muted-foreground")}>
                                                Dashboard
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                )}

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <a href="/#about" className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-transparent data-[state=open]:bg-transparent", isActiveHash("#about") ? "text-blue-500" : "text-muted-foreground")}>
                                            About Us
                                        </a>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>


                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link to="/clubs" className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-transparent data-[state=open]:bg-transparent", isActive("/clubs") ? "text-blue-500" : "text-muted-foreground")}>
                                            Clubs
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link to="https://www.gdgaitpune.me/" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors focus:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-transparent data-[state=open]:bg-transparent">
                                            Team
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link to="/developers" className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors focus:bg-transparent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-active:bg-transparent data-[state=open]:bg-transparent", isActive("/developers") ? "text-blue-500" : "text-muted-foreground")}>
                                            Developers
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                       
                       
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="hidden sm:inline-flex text-muted-foreground dark:text-gray-300 cursor-pointer"
                                onClick={onOpenLogin}
                            >
                                Login
                            </Button>
                           

                        <Button asChild className="rounded-lg bg-black/20 text-black dark:bg-white/10 dark:text-white font-medium px-6 h-9 gap-2 text-sm">
                            <a href="https://github.com/Jitesh-Yadav01/SYNC-AIT" target="_blank">
                                <Github className="w-4 h-4" />
                                Star on GitHub
                            </a>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-black dark:text-white"
                        onClick={onOpenSidebar}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
            </div>
        </nav>
        */}
        </>
    );
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
