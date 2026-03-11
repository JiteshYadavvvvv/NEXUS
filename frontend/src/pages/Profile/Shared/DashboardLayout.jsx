import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from './ProfileContext';
import SharedOverview from './SharedOverview';
import SharedMembers from './SharedMembers';
import SharedTasks from './SharedTasks';
import SharedMessages from './SharedMessages';
import SharedProfile from './SharedProfile';
import AvailableForms from './AvailableForms';
import { LayoutDashboard, Users, CheckSquare, MessageSquare, LogOut, Menu, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SharedDashboardLayout({ children }) {
    const { activeTab, setActiveTab, profile, role } = useProfile();
    const { logout, user, authLoading } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isStandalonePage = Boolean(children);


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
            await toast.promise(
                axios.post(`${API}/api/admin/logout`, {}, { withCredentials: true }),
                {
                    pending: 'Signing out...',
                    success: 'Signed out successfully! 👋',
                    error: 'Logout request failed, signing out anyway.',
                }
            );
        } catch (_) {
            // fail silently — still navigate home
        } finally {
            logout();
            navigate('/');
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'members', label: 'Team Members', icon: Users },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'profile', label: 'Profile', icon: Users },
    ];

    const getVisibleTabs = () => {
        if (role === 'Applicant') {
            return tabs.filter(t => t.id === 'messages');
        }
        return tabs.filter(t => t.id !== 'profile');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <SharedOverview />;
            case 'members': return <SharedMembers />;
            case 'tasks': return <SharedTasks />;
            case 'messages': return <SharedMessages />;
            case 'profile': return <SharedProfile />;
            case 'forms': return <AvailableForms />;
            default: return <SharedOverview />;
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
                backgroundPosition: 'center'
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
                "fixed inset-y-0 left-0 z-50 w-66 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-lg">{user?.year[0]}</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-gray-900">{user?.year} Panel</h1>

                            {/* <span className="font-bold text-gray-900 text-lg">{user.year}</span> */}
                        </div>
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
                                        setIsSidebarOpen(false);
                                        navigate('/my-forms');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    <FileText className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    Manage Forms
                                </button>
                                <button
                                    onClick={() => {
                                        setIsSidebarOpen(false);
                                        navigate('/response');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    <Users className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    Responses
                                </button>
                            </>
                        )}

                        {/* Applicant / Member can see & fill public forms */}
                        {role !== 'Admin' && (
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
                            className="flex items-center gap-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
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

            <main className="flex-1 flex flex-col min-w-0 bg-transparent md:ml-64 relative">
                <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <span className="font-bold text-white text-xs">{role}</span>
                        </div>
                        <span className="font-semibold text-gray-900">Dashboard</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-gray-900">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                        {children ?? (role === 'Applicant' && !['messages', 'forms', 'profile'].includes(activeTab) ? <SharedMessages /> : renderContent())}
                    </div>
                </div>
            </main>
        </div>
    );
}
