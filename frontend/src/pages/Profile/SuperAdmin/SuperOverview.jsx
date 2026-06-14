import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building2, Users, FileText, ClipboardList, CalendarDays, RefreshCw, Loader2, Code2, Terminal, GitBranch } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
}

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function SuperOverview({ admin, onNavigate }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API}/api/superadmin/dashboard`, { withCredentials: true });
            if (res.data?.success) {
                setData(res.data.data);
            } else {
                setError(res.data?.message || 'Failed to load dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const firstName = admin?.role ? admin.role.toUpperCase() : 'Admin';

    const stats = [
        { icon: Building2, label: 'Total Clubs', value: data?.totalClubs ?? 0 },
        { icon: Users, label: 'Total Members', value: data?.totalMembers ?? 0 },
        { icon: FileText, label: 'Total Forms', value: data?.totalForms ?? 0 },
        { icon: ClipboardList, label: 'Total Responses', value: data?.totalResponses ?? 0 },
        { icon: CalendarDays, label: 'Total Events', value: data?.totalEvents ?? 0 },
    ];

    const floatingIcons = [
        { icon: Code2, top: '10%', left: '-22px' },
        { icon: Terminal, bottom: '18%', left: '-18px' },
        { icon: GitBranch, top: '8%', right: '-22px' },
    ];

    return (
        <div className="max-w-5xl mx-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-20 py-12">
                <div className="flex-1 min-w-0">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                        style={{ background: '#f0f0f0', border: '1px solid #e0e0e0' }}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-semibold tracking-wide" style={{ color: '#4b5563' }}>
                            {getGreeting()}, {firstName}
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(2.6rem, 6vw, 4.8rem)',
                            fontWeight: 800,
                            lineHeight: 1.02,
                            letterSpacing: '-0.02em',
                            color: '#111827',
                            marginBottom: '1.15rem',
                        }}
                    >
                        Institute<br />
                        <span style={{ color: '#1d4ed8' }}>Control Center.</span>
                    </h1>

                    <p style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.7, maxWidth: '440px', marginBottom: '1.5rem' }}>
                        Oversee every club, monitor institute-wide activity, and generate IQAC reports — all from a single console.
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                        <button
                            onClick={() => onNavigate?.('clubs')}
                            style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#1f2937')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#111827')}
                        >
                            Manage Clubs
                        </button>
                        <button
                            onClick={fetchDashboard}
                            disabled={loading}
                            className="inline-flex items-center gap-2"
                            style={{ padding: '12px 28px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: '#fff', color: '#374151', border: '1.5px solid #d1d5db', cursor: 'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>
                </div>

                <div className="relative shrink-0" style={{ width: '320px', height: '360px', marginTop: '20px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', transform: 'rotate(4deg)', zIndex: 0 }} />
                    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', width: '100%', height: '100%', border: '2px solid #fff', boxShadow: '0 40px 70px rgba(0,0,0,0.12)', zIndex: 1, background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="text-center px-6">
                            <div className="h-20 w-20 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-5 shadow-lg">
                                <Building2 className="h-10 w-10 text-white" />
                            </div>
                            <div className="text-white text-2xl font-extrabold tracking-tight">{data?.totalClubs ?? 0} Clubs</div>
                            <div className="text-blue-300 text-sm mt-1 uppercase tracking-widest">Under Management</div>
                        </div>
                    </div>
                    {floatingIcons.map(({ icon: Icon, ...pos }, i) => (
                        <div key={i} style={{ position: 'absolute', zIndex: 10, width: '40px', height: '40px', borderRadius: '12px', background: '#ffffff', border: '1.5px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pos }}>
                            <Icon style={{ width: '18px', height: '18px', color: '#1d4ed8' }} />
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Stats bar */}
            <div style={{ marginTop: '8px', borderRadius: '16px', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                {stats.map(({ icon: Icon, label, value }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 150px', padding: '8px 20px', borderRight: i < stats.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon style={{ width: '18px', height: '18px', color: '#111827' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{loading ? '…' : value}</div>
                            <div style={{ fontSize: '0.68rem', color: '#4b5563', marginTop: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div className="mt-8 mb-12 rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-blue-600" /> Activity Timeline
                    </h2>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">±5 days</span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12 text-gray-400">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (data?.timelineEvents?.length ? (
                    <div className="space-y-3">
                        {data.timelineEvents.map((ev) => (
                            <div key={ev._id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                                    <CalendarDays className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{ev.eventName || ev.name || ev.title || 'Untitled Event'}</p>
                                    <p className="text-xs text-gray-500 truncate">{ev.club || 'Unknown club'}{ev.venue ? ` • ${ev.venue}` : ''}</p>
                                </div>
                                <span className="text-xs font-medium text-gray-600 shrink-0">{formatDate(ev.date)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400 text-sm">No events in this window.</div>
                ))}
            </div>
        </div>
    );
}
