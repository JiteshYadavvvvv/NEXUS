import React, { useEffect } from 'react';
import { X, Mail, Hash, GraduationCap, Layers, ShieldCheck, Phone, FileText, Calendar } from 'lucide-react';

export default function UserDetailsModal({ user, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!user) return null;

    const clubNames = user.clubNames || [];

    const fields = [
        { icon: Hash, label: 'Regn. No.', value: user.regnNo ?? '—' },
        { icon: GraduationCap, label: 'Year', value: user.year || '—' },
        { icon: Layers, label: 'Branch', value: user.branch || '—' },
        { icon: ShieldCheck, label: 'Role', value: user.role || '—' },
        { icon: Phone, label: 'Number', value: user.number ?? '—' },
        { icon: FileText, label: 'Auth Provider', value: user.authProvider || '—' },
        { icon: Calendar, label: 'Joined', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-md max-h-[85vh] overflow-y-auto sleek-scrollbar rounded-3xl bg-white ring-1 ring-black/5 shadow-2xl shadow-black/20 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 pt-6 pb-5">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shrink-0 overflow-hidden ring-4 ring-gray-50">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-white text-xl font-bold">{(user.name || '?')[0]}</span>
                            )}
                        </div>

                        <h2 className="mt-3 text-lg font-bold text-gray-900 truncate max-w-full">{user.name}</h2>

                        <p className="mt-1 text-xs text-gray-500 truncate max-w-full">
                            Clubs: {clubNames.length ? `[${clubNames.join(', ')}]` : 'Nil'}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400 truncate max-w-full">
                            <Mail className="h-3 w-3 shrink-0" /> {user.email}
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-6 space-y-5">
                    <div className="rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                        {fields.map((field) => (
                            <div key={field.label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <field.icon className="h-3.5 w-3.5" />
                                    <span className="text-[11px] font-semibold uppercase tracking-widest">{field.label}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 text-right break-words">{field.value}</span>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Bio</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words rounded-2xl bg-gray-50 px-4 py-3">
                            {user.bio || '—'}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Hobbies</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words rounded-2xl bg-gray-50 px-4 py-3">
                            {user.hobbies || '—'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
