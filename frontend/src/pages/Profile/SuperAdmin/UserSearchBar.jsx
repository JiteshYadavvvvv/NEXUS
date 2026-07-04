import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader2, ChevronRight } from 'lucide-react';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import UserDetailsModal from './UserDetailsModal';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const MAX_VISIBLE_RESULTS = 5;

export default function UserSearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const debouncedQuery = useDebouncedValue(query, 500);

    useEffect(() => {
        const q = debouncedQuery.trim();
        if (!q) {
            setResults([]);
            setError(null);
            setLoading(false);
            return;
        }

        let cancelled = false;
        const search = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API}/api/superadmin/search-users`, {
                    params: { q },
                    withCredentials: true,
                });
                if (cancelled) return;
                if (res.data?.success) {
                    setResults(res.data.users || []);
                } else {
                    setError(res.data?.message || 'Failed to search users');
                    setResults([]);
                }
            } catch (err) {
                if (cancelled) return;
                setError(err.response?.data?.message || err.message || 'Failed to search users');
                setResults([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        search();
        return () => { cancelled = true; };
    }, [debouncedQuery]);

    const showDropdown = query.trim().length > 0;
    const visibleResults = results.slice(0, MAX_VISIBLE_RESULTS);
    const hiddenCount = results.length - visibleResults.length;

    return (
        <div className="relative mt-8" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users by name or registration number..."
                    style={{ colorScheme: 'light' }}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-base text-gray-900 caret-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
                {loading && (
                    <Loader2 className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 animate-spin" />
                )}
            </div>

            {showDropdown && (
                <div className="absolute z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                    {error ? (
                        <div className="px-5 py-4 text-sm text-red-700">{error}</div>
                    ) : !loading && visibleResults.length === 0 ? (
                        <div className="px-5 py-4 text-sm text-gray-400">No users found.</div>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-100">
                                {visibleResults.map((u) => (
                                    <li key={u._id}>
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className="w-full flex items-center justify-between gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {u.regnNo ?? '—'} · {u.year || '—'} · {u.branch || '—'}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {hiddenCount > 0 && (
                                <div className="px-5 py-2 text-[11px] text-gray-400 border-t border-gray-100 bg-gray-50">
                                    +{hiddenCount} more — refine your search to narrow results
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {selectedUser && (
                <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
}
