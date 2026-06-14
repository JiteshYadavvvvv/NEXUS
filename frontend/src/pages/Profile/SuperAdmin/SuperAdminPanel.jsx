import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';

const SUPER_ROLES = ['director', 'principal', 'jd'];

export default function SuperAdminPanel() {
    const { checkAdminAuth, setUser, setIsAdmin } = useAuth();
    const [status, setStatus] = useState('loading'); // loading | ok | denied
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        let active = true;
        (async () => {
            const info = await checkAdminAuth();
            if (!active) return;
            if (info && SUPER_ROLES.includes(info.role)) {
                setAdmin(info);
                setUser(info);
                setIsAdmin(true);
                setStatus('ok');
            } else {
                setStatus('denied');
            }
        })();
        return () => { active = false; };
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Verifying access…</p>
                </div>
            </div>
        );
    }

    if (status === 'denied') {
        return <Navigate to="/get-started" replace />;
    }

    return <SuperAdminDashboard admin={admin} />;
}
