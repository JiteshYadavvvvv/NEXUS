import React from 'react';
import { LayoutDashboard, Building2, FileBarChart, LogOut, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_LABEL = { director: 'Director', principal: 'Principal', jd: 'Joint Director' };

const SUPERADMIN_TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'clubs', label: 'Manage Clubs', icon: Building2 },
    { id: 'reports', label: 'IQAC Reports', icon: FileBarChart },
];

export default function SuperAdminSidebar({
    admin,
    activeTab,
    onTabSelect,
    isSidebarOpen,
    setIsSidebarOpen,
    isDesktopCollapsed,
    setIsDesktopCollapsed,
    onLogout,
}) {
    const roleLabel = ROLE_LABEL[admin?.role] || 'SuperAdmin';

    return (
        <>
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
                        {SUPERADMIN_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { onTabSelect(tab.id); setIsSidebarOpen(false); }}
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
                            onClick={onLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export function SuperAdminMobileHeader({ setIsSidebarOpen }) {
    return (
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
    );
}

export function SuperAdminExpandButton({ isDesktopCollapsed, setIsDesktopCollapsed }) {
    if (!isDesktopCollapsed) return null;
    return (
        <button
            onClick={() => setIsDesktopCollapsed(false)}
            className="hidden md:flex fixed top-3 left-4 z-[60] items-center justify-center w-8 h-8 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-100 hover:text-slate-900 text-slate-600 transition-colors"
            title="Expand Sidebar"
        >
            <ChevronRight className="w-4 h-4" />
        </button>
    );
}
