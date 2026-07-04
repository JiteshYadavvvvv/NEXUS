import React from 'react';
import { Navigate } from 'react-router-dom';
import useSuperAdminAccess from '@/hooks/useSuperAdminAccess';
import SuperAdminDashboard from './SuperAdminDashboard';

export default function SuperAdminPanel() {
    const { status, admin } = useSuperAdminAccess();

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
