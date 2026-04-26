import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useProfile } from './ProfileContext';
import SharedOverview from './SharedOverview';
import SharedMembers from './SharedMembers';
import SharedProfile from './SharedProfile';
import SharedMyClubs from './SharedMyClubs';
import AvailableForms from './AvailableForms';
import MyForms from '@/pages/Forms/MyForms';
import Dashboard from '@/pages/response/Dashboard';
import { LayoutDashboard, Users, LogOut, Menu, FileText, X, ChevronRight, Building, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SharedDashboardLayout({ children }) {
    const { activeTab, setActiveTab, profile, role, activeClub } = useProfile();
    const { logout, user, authLoading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
    const isStandalonePage = Boolean(children);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);


    React.useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('no-custom-cursor');
        return () => {
            document.documentElement.classList.add('dark');
            document.body.classList.remove('no-custom-cursor');
        };
    }, []);

    const handleLogout = async () => {
        setIsSidebarOpen(false);
        const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        try {
            if (role === 'Admin') {
                await axios.post(`${API}/api/admin/logout`, {}, { withCredentials: true });
            }
        } catch (_) {
        } finally {
            await logout();
            toast.success('Signed out successfully! 👋');
            navigate('/', { replace: true });
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'members', label: 'Team Members', icon: Users },
        { id: 'my-clubs', label: 'My Clubs', icon: Building },
        { id: 'profile', label: 'Profile', icon: Users },
    ];

    const getVisibleTabs = () => {
        if (role === 'Applicant') {
            return tabs.filter(t => t.id === 'my-clubs');
        }
        if (role === 'Admin') {
            return tabs.filter(t => t.id !== 'profile' && t.id !== 'my-clubs');
        }
        if (role === 'Member') {
            return tabs.filter(t => ['overview', 'my-clubs'].includes(t.id));
        }
        return tabs.filter(t => t.id !== 'profile');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <SharedOverview />;
            case 'members': return <SharedMembers />;
            case 'profile': return <SharedProfile />;
            case 'forms': return <AvailableForms />;
            case 'my-clubs': return <SharedMyClubs />;
            case 'manage-forms': return <MyForms />;
            case 'responses': return <Dashboard viewerRole={role === 'Admin' ? 'admin' : 'member'} isEmbedded={true} />;
            default: return role === 'Admin' ? <SharedOverview /> : <SharedMyClubs />;
        }
    };

    // Guard: while auth is being verified on reload, show a spinner
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

    if (!user && role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return (
        <div
            className="flex min-h-screen bg-gray-50 text-gray-900 font-mono selection:bg-blue-500/30"
            style={{
                backgroundImage: "url('/back.svg')",
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
            }}
        >
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                // style={{
                //     backgroundImage: "url('/back.svg')",
                //     backgroundSize: 'cover',
                //     backgroundAttachment: 'fixed',
                //     backgroundPosition: 'center'
                // }}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-68 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
                (isSidebarOpen || !isDesktopCollapsed) ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-3">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                                <span className="font-bold text-white text-lg">{role === 'Admin' ? 'A' : role === 'Member' ? 'M' : user?.year?.[0]}</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-lg tracking-tight text-gray-900">{role === 'Admin' ? 'Admin' : role === 'Member' ? 'Member' : user?.year} Panel</h1>
                            </div>
                        </div>
                        <button
                            onClick={() => { setIsDesktopCollapsed(true); setIsSidebarOpen(false); }}
                            className="flex p-1.5 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
                            title="Close Sidebar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>



                    <nav className="flex-1 space-y-2">
                        {getVisibleTabs().map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    if (isStandalonePage) {
                                        navigate(`/profile/${role}`, { state: { activeTab: tab.id } });
                                    } else {
                                        setActiveTab(tab.id);
                                    }
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    !isStandalonePage && activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {!isStandalonePage && activeTab === tab.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                                <tab.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    !isStandalonePage && activeTab === tab.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                )} />
                                {tab.label}
                            </button>
                        ))}

                        {/* Admin Exclusive Links */}
                        {role === 'Admin' && (
                            <>
                                <button
                                    onClick={() => {
                                        setActiveTab('manage-forms');
                                        setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                        activeTab === 'manage-forms'
                                            ? "bg-blue-50 text-blue-700 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    {activeTab === 'manage-forms' && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                    )}
                                    <FileText className={cn(
                                        "h-5 w-5 transition-colors",
                                        activeTab === 'manage-forms' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                    )} />
                                    Manage Forms
                                </button>
                                <button
                                    onClick={() => {
                                        setActiveTab('responses');
                                        setIsSidebarOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                        activeTab === 'responses'
                                            ? "bg-blue-50 text-blue-700 shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    )}
                                >
                                    {activeTab === 'responses' && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                    )}
                                    <ClipboardList className={cn(
                                        "h-5 w-5 transition-colors",
                                        activeTab === 'responses' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                    )} />
                                    Responses
                                </button>
                            </>
                        )}

                        {role === 'Member' && (
                            <button
                                onClick={() => {
                                    setActiveTab('responses');
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    activeTab === 'responses'
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {activeTab === 'responses' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                                <ClipboardList className={cn(
                                    "h-5 w-5 transition-colors",
                                    activeTab === 'responses' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                )} />
                                Responses
                            </button>
                        )}

                        {/* Applicant can see & fill public forms */}
                        {role === 'Applicant' && (
                            <button
                                onClick={() => {
                                    if (isStandalonePage) {
                                        navigate(`/profile/${role}`, { state: { activeTab: 'forms' } });
                                    } else {
                                        setActiveTab('forms');
                                    }
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                    activeTab === 'forms'
                                        ? "bg-blue-50 text-blue-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                )}
                            >
                                {activeTab === 'forms' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                )}
                                <FileText className={cn(
                                    "h-5 w-5 transition-colors",
                                    activeTab === 'forms' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                                )} />
                                Forms
                            </button>
                        )}
                    </nav>

                    <div className="pt-6 border-t border-gray-200 mt-auto space-y-4">
                        <div
                            className="flex items-center gap-2 px-1 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                            onClick={() => {
                                if (isStandalonePage) {
                                    navigate(`/profile/${role}`, { state: { activeTab: 'profile' } });
                                } else {
                                    setActiveTab('profile');
                                }
                                setIsSidebarOpen(false);
                            }}
                        >
                            <img src={profile?.avatar || "/clubprofiles/ns.png"} alt="Profile" className="h-9 w-9 rounded-full border border-gray-200 bg-gray-100 object-cover" />
                            <div className="flex-1 min-w-0">

                                <p className="text-sm font-medium truncate text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 break-all">{user?.email}</p>

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

            <main className={cn(
                "flex-1 flex flex-col min-w-0 bg-transparent relative transition-all duration-300",
                !isDesktopCollapsed ? "md:ml-68" : "md:ml-0"
            )}>
                {/* Floating expand button when collapsed */}
                {isDesktopCollapsed && (
                    <button
                        onClick={() => setIsDesktopCollapsed(false)}
                        className="hidden md:flex absolute top-3 left-4 z-40 items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-100 hover:text-slate-900 text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                        title="Expand Sidebar"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}

                <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-xs">{role === 'Admin' ? 'A' : role === 'Member' ? 'M' : user?.year?.[0]}</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-gray-900">{role === 'Admin' ? 'Admin' : role === 'Member' ? 'Member' : user?.year} Panel</h1>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-gray-900">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <div className={`flex-1 overflow-y-auto ${!isStandalonePage && activeTab !== 'responses' ? (activeTab === 'overview' ? 'p-4 md:px-8' : 'p-4 md:p-8') : ''}`}>
                    <div className={`${!isStandalonePage && activeTab !== 'responses' ? (`max-w-6xl mx-auto w-full ${activeTab === 'overview' ? 'space-y-4 pb-2' : 'space-y-8 pb-12'}`) : activeTab === 'responses' ? 'flex flex-col h-full' : 'flex flex-col h-full'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        {children ?? renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
