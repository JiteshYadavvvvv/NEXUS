import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Building2, Users, GraduationCap, UserCog, Search, Loader2 } from 'lucide-react';
import useSuperAdminAccess from '@/hooks/useSuperAdminAccess';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { useAuth } from '@/context/AuthContext';
import SuperAdminSidebar, { SuperAdminMobileHeader, SuperAdminExpandButton } from './SuperAdminSidebar';
import UserDetailsModal from './UserDetailsModal';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const MEMBERS_PAGE_SIZE = 20;

export default function ClubDetailPage() {
    const { status, admin } = useSuperAdminAccess();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [club, setClub] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [visibleCount, setVisibleCount] = useState(MEMBERS_PAGE_SIZE);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const scrollSentinelRef = useRef(null);

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

    const handleTabSelect = (tabId) => {
        navigate('/profile/SuperAdmin', { state: { activeTab: tabId } });
    };

    useEffect(() => {
        if (status !== 'ok') return;

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API}/api/superadmin/club-detail`, {
                    params: { slug },
                    withCredentials: true,
                });
                if (res.data?.success) {
                    setClub(res.data.club);
                    setMembers(res.data.members || []);
                } else {
                    setError(res.data?.message || 'Failed to load club');
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || 'Failed to load club';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [slug, status]);

    const debouncedSearch = useDebouncedValue(search, 1000);

    const years = useMemo(() => {
        const set = new Set(members.map((m) => m.year).filter(Boolean));
        return Array.from(set).sort();
    }, [members]);

    const filteredMembers = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        return members.filter((m) => {
            const matchesYear = yearFilter === 'all' || m.year === yearFilter;
            if (!matchesYear) return false;
            if (!q) return true;
            const name = (m.name || '').toLowerCase();
            const regnNo = String(m.regnNo ?? '').toLowerCase();
            return name.includes(q) || regnNo.includes(q);
        });
    }, [members, debouncedSearch, yearFilter]);

    // Reset the infinite-scroll window whenever the search/filter narrows the result set,
    // otherwise the page could be stuck showing a stale slice or scrolled past the new (shorter) list.
    useEffect(() => {
        setVisibleCount(MEMBERS_PAGE_SIZE);
    }, [debouncedSearch, yearFilter]);

    const visibleMembers = useMemo(
        () => filteredMembers.slice(0, visibleCount),
        [filteredMembers, visibleCount]
    );
    const hasMore = visibleCount < filteredMembers.length;

    useEffect(() => {
        const sentinel = scrollSentinelRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setVisibleCount((c) => Math.min(c + MEMBERS_PAGE_SIZE, filteredMembers.length));
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, filteredMembers.length]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
        );
    }

    if (status === 'denied') {
        return <Navigate to="/get-started" replace />;
    }

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
                activeTab="clubs"
                onTabSelect={handleTabSelect}
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
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => navigate('/profile/SuperAdmin', { state: { activeTab: 'clubs' } })}
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Manage Clubs
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-3" />
                        <p className="text-sm">Loading club...</p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
                ) : (
                    <>
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-6">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    {club.clubLogo ? (
                                        <img src={club.clubLogo} alt={club.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-2xl font-extrabold text-gray-900 truncate">{club.name}</h1>
                                    <p className="text-xs text-gray-500 mt-1">{club.strength} member{club.strength === 1 ? '' : 's'}</p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                                        <Users className="h-4 w-4" />
                                        <span className="text-[11px] font-semibold uppercase tracking-widest">Strength</span>
                                    </div>
                                    <p className="text-lg font-extrabold text-gray-900">{club.strength}</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                                        <GraduationCap className="h-4 w-4" />
                                        <span className="text-[11px] font-semibold uppercase tracking-widest">Faculty</span>
                                    </div>
                                    {club.faculty?.length ? (
                                        <ul className="space-y-0.5">
                                            {club.faculty.map((f) => <li key={f.email} className="text-sm text-gray-800 truncate">{f.name}</li>)}
                                        </ul>
                                    ) : <p className="text-sm text-gray-400">None assigned</p>}
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                                        <UserCog className="h-4 w-4" />
                                        <span className="text-[11px] font-semibold uppercase tracking-widest">Secretaries</span>
                                    </div>
                                    {club.secretaries?.length ? (
                                        <ul className="space-y-0.5">
                                            {club.secretaries.map((s) => <li key={s.email} className="text-sm text-gray-800 truncate">{s.name}</li>)}
                                        </ul>
                                    ) : <p className="text-sm text-gray-400">None assigned</p>}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                                <h2 className="text-lg font-bold text-gray-900">Members</h2>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search name or regn. no."
                                            style={{ colorScheme: "light" }}
                                            className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 caret-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-56"
                                        />
                                    </div>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="all">All years</option>
                                        {years.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>

                            {filteredMembers.length ? (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                                    <th className="py-2 pr-4">Name</th>
                                                    <th className="py-2 pr-4">Regn. No.</th>
                                                    <th className="py-2 pr-4">Year</th>
                                                    <th className="py-2 pr-4">Branch</th>
                                                    <th className="py-2 pr-4">Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleMembers.map((m) => (
                                                    <tr
                                                        key={m._id}
                                                        onClick={() => setSelectedMember(m)}
                                                        className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                                                    >
                                                        <td className="py-2.5 pr-4 font-medium text-gray-900">{m.name}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.regnNo ?? '—'}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.year || '—'}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.branch || '—'}</td>
                                                        <td className="py-2.5 pr-4 text-gray-600">{m.role || '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {hasMore && (
                                        <div ref={scrollSentinelRef} className="flex items-center justify-center py-4 text-gray-400 text-xs gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Loading more members...
                                        </div>
                                    )}
                                    <p className="text-center text-[11px] text-gray-400 mt-2">
                                        Showing {visibleMembers.length} of {filteredMembers.length} member{filteredMembers.length === 1 ? '' : 's'}
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-400 text-sm">No members match your search.</div>
                            )}
                        </div>
                    </>
                )}
                </div>
                </div>
            </main>

            {selectedMember && (
                <UserDetailsModal user={selectedMember} onClose={() => setSelectedMember(null)} />
            )}
        </div>
    );
}
