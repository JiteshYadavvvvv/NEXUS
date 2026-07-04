import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Building2, Users, GraduationCap, UserCog, CalendarDays, Search, Loader2 } from 'lucide-react';
import useDebouncedValue from '@/hooks/useDebouncedValue';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export default function ManageClubs() {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebouncedValue(search, 1000);

    useEffect(() => {
        const fetchClubs = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API}/api/superadmin/clubs-overview`, { withCredentials: true });
                if (res.data?.success) {
                    setClubs(res.data.clubs || []);
                } else {
                    setError(res.data?.message || 'Failed to load clubs');
                }
            } catch (err) {
                const message = err.response?.data?.message || err.message || 'Failed to load clubs';
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const visibleClubs = useMemo(() => {
        const q = debouncedSearch.trim().toLowerCase();
        return clubs
            .filter((c) => !q || c.name.toLowerCase().includes(q))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [clubs, debouncedSearch]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p className="text-sm">Loading clubs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
                {error}
            </div>
        );
    }

    return (
        <div className="w-full" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">Manage Clubs</h2>
                <div className="relative">
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search clubs by name"
                        style={{ colorScheme: "light" }}
                        className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 caret-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                </div>
            </div>

            {!visibleClubs.length ? (
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center text-gray-400 text-sm">
                    {clubs.length ? 'No clubs match your search.' : 'No clubs found — check back soon.'}
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {visibleClubs.map((club) => (
                        <div
                            key={club._id}
                            onClick={() => navigate(`/profile/superadmin/detail/${club.slug}`)}
                            className="w-full rounded-2xl border border-gray-200 bg-white p-6 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start gap-4 mb-5">
                                <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                    {club.clubLogo ? (
                                        <img src={club.clubLogo} alt={club.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-7 w-7 text-gray-400" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xl font-extrabold text-gray-900 truncate">{club.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Click card to view full member list</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-5 sm:max-w-md">
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-3 text-center">
                                    <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                                    <div className="text-lg font-extrabold text-gray-900">{club.strength}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Strength</div>
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-3 text-center">
                                    <GraduationCap className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                                    <div className="text-lg font-extrabold text-gray-900">{club.faculty?.length || 0}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Faculty</div>
                                </div>
                                <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-3 text-center">
                                    <UserCog className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                                    <div className="text-lg font-extrabold text-gray-900">{club.secretaries?.length || 0}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Secretaries</div>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Faculty</p>
                                    {club.faculty?.length ? (
                                        <ul className="space-y-1">
                                            {club.faculty.map((f) => (
                                                <li key={f.email} className="text-sm text-gray-700 truncate">{f.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400">None assigned</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Secretaries</p>
                                    {club.secretaries?.length ? (
                                        <ul className="space-y-1">
                                            {club.secretaries.map((s) => (
                                                <li key={s.email} className="text-sm text-gray-700 truncate">{s.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400">None assigned</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <CalendarDays className="h-3.5 w-3.5" /> Recent Events
                                    </p>
                                    {club.recentEvents?.length ? (
                                        <div className="space-y-2">
                                            {club.recentEvents.map((ev) => (
                                                <div key={ev._id} className="flex items-center justify-between rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
                                                    <span className="text-sm font-medium text-gray-800 truncate">{ev.eventName || 'Untitled Event'}</span>
                                                    <span className="text-xs text-gray-500 shrink-0 ml-3">{formatDate(ev.date)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">No recent events</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
