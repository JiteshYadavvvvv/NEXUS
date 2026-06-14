import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LayoutDashboard, Building2, FileBarChart, LogOut, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import SuperOverview from './SuperOverview';
import ManageClubs from './ManageClubs';
import IqacReports from './IqacReports';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const ROLE_LABEL = { director: 'Director', principal: 'Principal', jd: 'Joint Director' };

export default function SuperAdminDashboard({ admin }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    // Match the light theme + no custom cursor of the shared dashboard
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.body.classList.add('no-custom-cursor');
        return () => {
            document.documentElement.classList.add('dark');
            document.body.classList.remove('no-custom-cursor');
        };
    }, []);

    const handleLogout = async () => {
        setIsSidebarOpen(false);
        try {
            await axios.post(`${API}/api/admin/logout`, {}, { withCredentials: true });
        } catch (_) {
            /* ignore */
        } finally {
            await logout();
            toast.success('Signed out successfully! 👋');
            navigate('/', { replace: true });
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'clubs', label: 'Manage Clubs', icon: Building2 },
        { id: 'reports', label: 'IQAC Reports', icon: FileBarChart },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <SuperOverview admin={admin} onNavigate={setActiveTab} />;
            case 'clubs': return <ManageClubs />;
            case 'reports': return <IqacReports />;
            default: return <SuperOverview admin={admin} onNavigate={setActiveTab} />;
        }
    };

    const roleLabel = ROLE_LABEL[admin?.role] || 'SuperAdmin';

    return (
        <div
            className="flex min-h-screen bg-gray-50 text-gray-900 font-mono selection:bg-blue-500/30"
            style={{
                backgroundImage: "url('/back.svg')",
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            }}
        >
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 w-68 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
                (isSidebarOpen || !isDesktopCollapsed) ? 'translate-x-0' : '-translate-x-full'
            )}>
                <div className="flex flex-col h-full p-3">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                                <ShieldCheck className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg tracking-tight text-gray-900">SuperAdmin</h1>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wider">{roleLabel}</p>
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
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                                className={cn(
                                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden',
                                    activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                )}
                            >
                                {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />}
                                <tab.icon className={cn('h-5 w-5 transition-colors', activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600')} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-gray-200 mt-auto space-y-4">
                        <div className="flex items-center gap-2 px-1 p-2">
                            <div className="h-9 w-9 rounded-full border border-gray-200 bg-gray-900 flex items-center justify-center shrink-0">
                                <span className="text-white text-sm font-bold">{roleLabel[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-gray-900">{roleLabel}</p>
                                <p className="text-xs text-gray-500 break-all">{admin?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            <main className={cn(
                'flex-1 flex flex-col min-w-0 bg-transparent relative transition-all duration-300',
                !isDesktopCollapsed ? 'md:ml-68' : 'md:ml-0'
            )}>
                {isDesktopCollapsed && (
                    <button
                        onClick={() => setIsDesktopCollapsed(false)}
                        className="hidden md:flex absolute top-3 left-4 z-40 items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-100 hover:text-slate-900 text-slate-600 transition-colors"
                        title="Expand Sidebar"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}

                <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-white" />
                        </div>
                        <h1 className="font-bold text-lg tracking-tight text-gray-900">SuperAdmin</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 hover:text-gray-900">
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
