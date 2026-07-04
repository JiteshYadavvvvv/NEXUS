import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useProfile } from './ProfileContext';
import { Plus, Trash2, Search, Pencil, ShieldCheck, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function SharedMembers() {
    const { members, addMember, removeMember, editMember, role, debugMsg } = useProfile();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Applicant', domain: '', status: 'Active' });

    const canManageMembers = role === 'Admin' || role === 'Member';

    // ── Secretaries: org admins with role "secretary". Only a faculty of the
    // club may add/remove them; the backend reports `isFaculty` authoritatively.
    const [secretaries, setSecretaries] = useState([]);
    const [isFaculty, setIsFaculty] = useState(false);
    const [secLoading, setSecLoading] = useState(false);
    const [showAddSec, setShowAddSec] = useState(false);
    const [newSec, setNewSec] = useState({ name: '', email: '' });
    const [addingSec, setAddingSec] = useState(false);
    const [removingSecEmail, setRemovingSecEmail] = useState(null);

    const fetchSecretaries = async () => {
        setSecLoading(true);
        try {
            const res = await axios.get(`${API}/api/admin/get-secretaries`, { withCredentials: true });
            if (res.data.success) {
                setSecretaries(res.data.secretaries || []);
                setIsFaculty(Boolean(res.data.isFaculty));
            }
        } catch (err) {
            console.error('Failed to load secretaries:', err);
        } finally {
            setSecLoading(false);
        }
    };

    useEffect(() => {
        if (role === 'Admin') fetchSecretaries();
    }, [role]);

    const handleAddSecretary = async (e) => {
        e.preventDefault();
        const name = newSec.name.trim();
        const email = newSec.email.trim();
        if (!name || !email) {
            toast.error('Name and email are required');
            return;
        }
        setAddingSec(true);
        try {
            const res = await axios.post(
                `${API}/api/admin/add-secretary`,
                { secretaryName: name, secretaryEmail: email },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success('Secretary added');
                setNewSec({ name: '', email: '' });
                setShowAddSec(false);
                fetchSecretaries();
            } else {
                toast.error(res.data.message || 'Failed to add secretary');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error adding secretary');
        } finally {
            setAddingSec(false);
        }
    };

    const handleRemoveSecretary = async (email) => {
        setRemovingSecEmail(email);
        try {
            const res = await axios.post(
                `${API}/api/admin/remove-secretary`,
                { secretaryEmail: email },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success('Secretary removed');
                setSecretaries((prev) => prev.filter((s) => s.email !== email));
            } else {
                toast.error(res.data.message || 'Failed to remove secretary');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error removing secretary');
        } finally {
            setRemovingSecEmail(null);
        }
    };

    const filteredMembers = members.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMember.name && newMember.email) {
            if (isEditing) {
                editMember({ ...newMember, id: currentMemberId });
                setIsEditing(false);
                setCurrentMemberId(null);
            } else {
                addMember(newMember);
            }
            setShowAddForm(false);
            setNewMember({ name: '', email: '', role: 'Applicant', domain: '', status: 'Active' });
        }
    };

    const openEditModal = (member) => {
        setNewMember({
            name: member.name,
            email: member.email,
            role: member.role,
            domain: member.domain,
            status: member.status
        });
        setCurrentMemberId(member.id);
        setIsEditing(true);
        setShowAddForm(true);
    };

    return (
        <div className="space-y-6">
            {role === 'Admin' && (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Secretaries</h3>
                        </div>
                        {isFaculty && (
                            <button
                                onClick={() => setShowAddSec((v) => !v)}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm self-start sm:self-auto"
                            >
                                <Plus className="h-4 w-4" /> {showAddSec ? 'Close' : 'Add Secretary'}
                            </button>
                        )}
                    </div>

                    {isFaculty && showAddSec && (
                        <form onSubmit={handleAddSecretary} className="p-4 border-b border-gray-200 space-y-4 bg-gray-50/50 animate-in fade-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Secretary name"
                                    value={newSec.name}
                                    onChange={(e) => setNewSec({ ...newSec, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Secretary email"
                                    value={newSec.email}
                                    onChange={(e) => setNewSec({ ...newSec, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowAddSec(false); setNewSec({ name: '', email: '' }); }}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingSec}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm inline-flex items-center gap-2 disabled:opacity-60"
                                >
                                    {addingSec && <Loader2 className="h-4 w-4 animate-spin" />} Save Secretary
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Email</th>
                                    {isFaculty && <th scope="col" className="px-6 py-3 text-right font-semibold">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {secretaries.map((s) => (
                                    <tr key={s.email} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium border border-blue-100 shrink-0">
                                                    {s.name?.charAt(0) || '?'}
                                                </div>
                                                {s.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{s.email}</td>
                                        {isFaculty && (
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleRemoveSecretary(s.email)}
                                                    disabled={removingSecEmail === s.email}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors inline-flex items-center gap-1.5 border border-red-100 disabled:opacity-50"
                                                >
                                                    {removingSecEmail === s.email
                                                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        : <Trash2 className="h-3.5 w-3.5" />}
                                                    Remove
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {secLoading && (
                                    <tr>
                                        <td colSpan={isFaculty ? 3 : 2} className="px-6 py-12 text-center text-gray-400 bg-gray-50/50">
                                            Loading secretaries…
                                        </td>
                                    </tr>
                                )}
                                {!secLoading && secretaries.length === 0 && (
                                    <tr>
                                        <td colSpan={isFaculty ? 3 : 2} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                                            No secretaries yet.{isFaculty ? ' Add one above.' : ''}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Team Members</h2>
                <p className="text-gray-500">
                    {canManageMembers ? 'Manage your team members.' : 'View team members.'}
                </p>
            </div>
            {canManageMembers && (
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        setIsEditing(false);
                        setNewMember({ name: '', email: '', role: 'Applicant', domain: '', status: 'Active' });
                    }}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors self-start sm:self-auto"
                >
                    <Plus className="h-4 w-4" /> {showAddForm && !isEditing ? 'Close' : 'Add Member'}
                </button>
            )}
        </div>

            {showAddForm && canManageMembers && (
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-semibold text-lg text-gray-900">{isEditing ? 'Edit Member' : 'Add New Member'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name"
                            value={newMember.name}
                            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                            required
                        />
                        <input
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddForm(false);
                                setIsEditing(false);
                                setNewMember({ name: '', email: '', role: 'Applicant', domain: '', status: 'Active' });
                            }}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            {isEditing ? 'Update Member' : 'Save Member'}
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="font-semibold text-gray-900">All Members</h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            className="pl-8 flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Role</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Email</th>
                                {canManageMembers && <th scope="col" className="px-6 py-3 text-right font-semibold">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium border border-blue-100 shrink-0">
                                                {member.name?.charAt(0) || '?'}
                                            </div>
                                            {member.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                            {member.role || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {member.email}
                                    </td>
                                    {canManageMembers && (
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => removeMember(member)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors inline-flex items-center gap-1.5 border border-red-100"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Remove
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={canManageMembers ? 4 : 3} className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
