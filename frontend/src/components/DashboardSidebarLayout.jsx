import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, MessageSquare, LogOut, Menu, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { profileData } from '@/pages/Profile/Te profile/mockData';

/**
 * DashboardSidebarLayout
 *
 * Renders the exact same sidebar as DashboardLayout — copied pixel-for-pixel —
 * but without requiring ProfileContext. Uses useAuth for user info and
 * useNavigate/useLocation for active-state highlighting.
 *
 * Wrap any standalone TE page with this to get the persistent sidebar.
 */
export default function DashboardSidebarLayout({ children }) {
    const { logout, user, authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    React.useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('no-custom-cursor');
        return () => {
            document.documentElement.classList.add('dark');
            document.body.classList.remove('no-custom-cursor');
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsSidebarOpen(false);
        navigate('/');
    };

    const panelPath = `/profile/${user?.year || 'TE'}`;

    // Same tabs as DashboardLayout — clicking them navigates back to the panel
    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'members', label: 'Team Members', icon: Users },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
    ];

    // Use profile clubs from mockData for the Switch Club section (same as TePanel)
    const clubs = profileData?.clubs || [];
    const [activeClubId, setActiveClubId] = useState(clubs[0]?.id || null);
    const activeClub = clubs.find(c => c.id === activeClubId) || clubs[0] || null;

    const isActive = (path) => location.pathname === path;

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-sm text-gray-500">Loading dashboard…</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">You need to log in to access this page.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-500/30"
            style={{
                backgroundImage: "url('/back.svg')",
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
            }}
        >
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar — exact copy from DashboardLayout ── */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-66 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">

                    {/* Panel header */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-lg">{user?.year}</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-gray-900">{user?.year} Panel</h1>
                        </div>
                    </div>

                    {/* Switch Club */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Switch Club</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {clubs.map(club => (
                                <button
                                    key={club.id}
                                    onClick={() => setActiveClubId(club.id)}
                                    className={cn(
                                        "h-10 w-10 min-w-10 rounded-full border-2 flex items-center justify-center transition-all bg-white relative group",
                                        activeClub?.id === club.id
                                            ? "border-blue-600 ring-2 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300"
                                    )}
                                    title={club.name}
                                >
                                    <img src={club.logo} alt={club.name} className="h-6 w-6 object-contain" />
                                    {activeClub?.id === club.id && (
                                        <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-blue-600 rounded-full border-2 border-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="mt-2 text-sm font-medium text-gray-900 truncate">{activeClub?.name}</div>
                        <div className="text-xs text-gray-500 truncate">{activeClub?.role}</div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 space-y-2">
                        {/* Regular tabs — navigate back to panel */}
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    navigate(panelPath);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    isActive(panelPath) && tab.id === 'overview'
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {isActive(panelPath) && tab.id === 'overview' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                                <tab.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive(panelPath) && tab.id === 'overview'
                                        ? "text-blue-600"
                                        : "text-gray-400 group-hover:text-gray-600"
                                )} />
                                {tab.label}
                            </button>
                        ))}

                        {/* TE-exclusive links */}
                        <button
                            onClick={() => { setIsSidebarOpen(false); navigate('/my-forms'); }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive('/my-forms')
                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            )}
                        >
                            {isActive('/my-forms') && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                            )}
                            <FileText className={cn(
                                "h-5 w-5 transition-colors",
                                isActive('/my-forms') ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                            )} />
                            Manage Forms
                        </button>

                        <button
                            onClick={() => { setIsSidebarOpen(false); navigate('/response'); }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive('/response') || location.pathname.startsWith('/response/')
                                    ? "bg-blue-50 text-blue-700 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            )}
                        >
                            {(isActive('/response') || location.pathname.startsWith('/response/')) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                            )}
                            <Users className={cn(
                                "h-5 w-5 transition-colors",
                                isActive('/response') || location.pathname.startsWith('/response/')
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-gray-600"
                            )} />
                            Responses
                        </button>
                    </nav>

                    {/* User footer */}
                    <div className="pt-6 border-t border-gray-200 mt-auto space-y-4">
                        <div
                            className="flex items-center gap-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                            onClick={() => { setIsSidebarOpen(false); navigate(panelPath); }}
                        >
                            <img
                                src={profileData?.avatar || "/clubprofiles/ns.png"}
                                alt="Profile"
                                className="h-9 w-9 rounded-full border border-gray-200 bg-gray-100 object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent md:ml-64 relative">
                {/* Mobile header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-xs">{user?.year}</span>
                        </div>
                        <span className="font-semibold text-gray-900">Dashboard</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-gray-900">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
