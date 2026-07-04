import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import SuperOverview from './SuperOverview';
import ManageClubs from './ManageClubs';
import IqacReports from './IqacReports';
import SuperAdminSidebar, { SuperAdminMobileHeader, SuperAdminExpandButton } from './SuperAdminSidebar';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function SuperAdminDashboard({ admin }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

    // Consume the requested tab from navigation state (e.g. coming back from ClubDetailPage)
    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            navigate(location.pathname, { replace: true, state: {} });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.activeTab]);

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
        } catch {
            /* ignore */
        } finally {
            await logout();
            toast.success('Signed out successfully! 👋');
            navigate('/', { replace: true });
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <SuperOverview admin={admin} onNavigate={setActiveTab} />;
            case 'clubs': return <ManageClubs />;
            case 'reports': return <IqacReports />;
            default: return <SuperOverview admin={admin} onNavigate={setActiveTab} />;
        }
    };

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
            <SuperAdminSidebar
                admin={admin}
                activeTab={activeTab}
                onTabSelect={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isDesktopCollapsed={isDesktopCollapsed}
                setIsDesktopCollapsed={setIsDesktopCollapsed}
                onLogout={handleLogout}
            />

            <main className={`flex-1 flex flex-col min-w-0 bg-transparent relative transition-all duration-300 ${!isDesktopCollapsed ? 'md:ml-68' : 'md:ml-0'}`}>
                <SuperAdminExpandButton isDesktopCollapsed={isDesktopCollapsed} setIsDesktopCollapsed={setIsDesktopCollapsed} />

                <SuperAdminMobileHeader setIsSidebarOpen={setIsSidebarOpen} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
