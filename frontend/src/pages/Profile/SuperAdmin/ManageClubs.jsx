import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Building2, Plus, Trash2, Users, FileText, UserCog, X, Loader2, UserPlus, Mail } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function ManageClubs() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create club
    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', logo: '', faculty: '' });

    // Delete club
    const [deletingId, setDeletingId] = useState(null);
    const [confirmId, setConfirmId] = useState(null);

    // Add-faculty inline form, keyed by clubId
    const [facultyForm, setFacultyForm] = useState({}); // { [clubId]: { name, email } }
    const [addingFacultyId, setAddingFacultyId] = useState(null);

    // Faculties modal
    const [facultyModal, setFacultyModal] = useState(null); // { club }
    const [facultyList, setFacultyList] = useState([]);
    const [facultyLoading, setFacultyLoading] = useState(false);
    const [removingEmail, setRemovingEmail] = useState(null);

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/superadmin/dashboard`, { withCredentials: true });
            if (res.data?.success) {
                setClubs(res.data.data.clubs || []);
            } else {
                toast.error(res.data?.message || 'Failed to load clubs');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load clubs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Club name is required');
            return;
        }
        setCreating(true);
        try {
            const res = await axios.post(
                `${API}/api/superadmin/create-club`,
                { name: form.name.trim(), logo: form.logo.trim(), faculty: form.faculty.trim() },
                { withCredentials: true }
            );
            if (res.data?.success) {
                toast.success('Club created');
                setShowCreate(false);
                setForm({ name: '', logo: '', faculty: '' });
                fetchClubs();
            } else {
                toast.error(res.data?.message || 'Failed to create club');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create club');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (clubId) => {
        setDeletingId(clubId);
        try {
            const res = await axios.delete(`${API}/api/superadmin/delete-club`, {
                data: { clubId },
                withCredentials: true,
            });
            if (res.data?.success) {
                toast.success('Club deleted');
                setClubs((prev) => prev.filter((c) => c._id !== clubId));
            } else {
                toast.error(res.data?.message || 'Failed to delete club');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete club');
        } finally {
            setDeletingId(null);
            setConfirmId(null);
        }
    };

    // ── Faculty helpers ──────────────────────────────────────────
    const setFacultyField = (clubId, field, value) => {
        setFacultyForm((prev) => ({
            ...prev,
            [clubId]: { ...(prev[clubId] || { name: '', email: '' }), [field]: value },
        }));
    };

    const handleAddFaculty = async (clubId) => {
        const entry = facultyForm[clubId] || { name: '', email: '' };
        const name = (entry.name || '').trim();
        const email = (entry.email || '').trim();
        if (!name || !email) {
            toast.error('Both name and email are required');
            return;
        }
        setAddingFacultyId(clubId);
        try {
            const res = await axios.post(
                `${API}/api/superadmin/add-faculty`,
                { clubId, name, facultyEmail: email },
                { withCredentials: true }
            );
            if (res.data?.success) {
                toast.success('Faculty added');
                setFacultyForm((prev) => ({ ...prev, [clubId]: { name: '', email: '' } }));
                // If the modal for this club is open, refresh it.
                if (facultyModal?.club?._id === clubId) {
                    setFacultyList((prev) => [...prev, res.data.faculty]);
                }
            } else {
                toast.error(res.data?.message || 'Failed to add faculty');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add faculty');
        } finally {
            setAddingFacultyId(null);
        }
    };

    const openFaculties = async (club) => {
        setFacultyModal({ club });
        setFacultyList([]);
        setFacultyLoading(true);
        try {
            const res = await axios.get(`${API}/api/superadmin/faculties`, {
                params: { clubId: club._id },
                withCredentials: true,
            });
            if (res.data?.success) {
                setFacultyList(res.data.faculties || []);
            } else {
                toast.error(res.data?.message || 'Failed to load faculties');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load faculties');
        } finally {
            setFacultyLoading(false);
        }
    };

    const handleRemoveFaculty = async (email) => {
        if (!facultyModal?.club?._id) return;
        setRemovingEmail(email);
        try {
            const res = await axios.delete(`${API}/api/superadmin/remove-faculty`, {
                data: { clubId: facultyModal.club._id, facultyEmail: email },
                withCredentials: true,
            });
            if (res.data?.success) {
                toast.success('Faculty removed');
                setFacultyList((prev) => prev.filter((f) => f.email !== email));
            } else {
                toast.error(res.data?.message || 'Failed to remove faculty');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove faculty');
        } finally {
            setRemovingEmail(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gray-900 flex items-center justify-center shadow-sm">
                        <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Manage Clubs</h1>
                        <p className="text-sm text-gray-500">Create clubs, assign faculties, and remove clubs</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors shrink-0"
                >
                    <Plus className="h-4 w-4" /> Create Club
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24 text-gray-400">
                    <Loader2 className="h-7 w-7 animate-spin" />
                </div>
            ) : clubs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                    <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700">No clubs yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Create your first club to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {clubs.map((club) => {
                        const entry = facultyForm[club._id] || { name: '', email: '' };
                        return (
                            <div key={club._id} className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                        {club.clubLogo ? (
                                            <img src={club.clubLogo} alt={club.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-gray-700">{club.name?.[0]?.toUpperCase()}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-base font-bold text-gray-900 truncate">{club.name}</h3>
                                        <span className={`inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded-full ${club.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {club.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    <div className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-2 text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-sm"><Users className="h-3.5 w-3.5 text-gray-400" />{club.membersCount}</div>
                                        <div className="text-[10px] text-gray-400 uppercase mt-0.5">Members</div>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-2 text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-sm"><FileText className="h-3.5 w-3.5 text-gray-400" />{club.formsCount}</div>
                                        <div className="text-[10px] text-gray-400 uppercase mt-0.5">Forms</div>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-2 text-center">
                                        <div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-sm"><UserCog className="h-3.5 w-3.5 text-gray-400" />{club.secretariesCount}</div>
                                        <div className="text-[10px] text-gray-400 uppercase mt-0.5">Secys</div>
                                    </div>
                                </div>

                                {/* Add faculty */}
                                <div className="mb-4">
                                    <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-2">Add Faculty</div>
                                    <div className="space-y-2">
                                        <input
                                            value={entry.name}
                                            onChange={(e) => setFacultyField(club._id, 'name', e.target.value)}
                                            placeholder="Faculty name"
                                            maxLength={100}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            value={entry.email}
                                            onChange={(e) => setFacultyField(club._id, 'email', e.target.value)}
                                            placeholder="faculty@aitpune.edu.in"
                                            type="email"
                                            maxLength={200}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAddFaculty(club._id)}
                                                disabled={addingFacultyId === club._id}
                                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {addingFacultyId === club._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                                                Add
                                            </button>
                                            <button
                                                onClick={() => openFaculties(club)}
                                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                            >
                                                <Users className="h-4 w-4" /> View Faculties
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Delete */}
                                {confirmId === club._id ? (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDelete(club._id)}
                                            disabled={deletingId === club._id}
                                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {deletingId === club._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            Confirm delete
                                        </button>
                                        <button onClick={() => setConfirmId(null)} className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200">Cancel</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmId(club._id)}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete Club
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <h2 className="text-lg font-bold text-gray-900">Create New Club</h2>
                            <button onClick={() => setShowCreate(false)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Club Name *</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. GDG AIT Pune"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                <input
                                    value={form.logo}
                                    onChange={(e) => setForm({ ...form, logo: e.target.value })}
                                    placeholder="https://…/logo.png"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty In-charge</label>
                                <input
                                    value={form.faculty}
                                    onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                                    placeholder="Faculty name / email"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    Create Club
                                </button>
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Faculties Modal */}
            {facultyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setFacultyModal(null)}>
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Faculties</h2>
                                <p className="text-xs text-gray-500">{facultyModal.club.name}</p>
                            </div>
                            <button onClick={() => setFacultyModal(null)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
                            {facultyLoading ? (
                                <div className="flex items-center justify-center py-12 text-gray-400">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : facultyList.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm">
                                    No faculties assigned yet.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {facultyList.map((f) => (
                                        <div key={f.email} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                                            <div className="h-9 w-9 rounded-full bg-blue-600/10 flex items-center justify-center shrink-0">
                                                <span className="text-sm font-bold text-blue-700">{f.name?.[0]?.toUpperCase()}</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{f.name}</p>
                                                <p className="text-xs text-gray-500 truncate flex items-center gap-1"><Mail className="h-3 w-3" />{f.email}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFaculty(f.email)}
                                                disabled={removingEmail === f.email}
                                                className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 shrink-0"
                                                title="Remove faculty"
                                            >
                                                {removingEmail === f.email ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
