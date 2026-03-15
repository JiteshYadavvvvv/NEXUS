import React, { useState, useEffect } from 'react';
import { FileText, Plus, ArrowLeft, Trash2, Pencil, Globe, Lock, Loader2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import CreateForm from './CreateForm';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const ONBOARDING_TEMPLATE = {
    title: 'Onboarding Form',
    desc: 'Template form for new members to fill out.',
    isPublic: true,
    fields: [
        { input: 'Regn No', type: 'text', required: true, options: [] },
        { input: 'Priority', type: 'priority', required: true, options: [] },
        { input: 'Branch', type: 'text', required: true, options: [] },
        { input: 'Hobbies', type: 'text', required: true, options: [] },
        { input: 'Phone Number', type: 'number', required: true, options: [] },
        { input: 'Why would you like to join us?', type: 'textarea', required: true, options: [] },
        { input: 'What are your expectainons from us?', type: 'textarea', required: true, options: [] }
    ]
};

export default function MyForms() {
    const navigate = useNavigate();


    const [forms, setForms] = useState([]);
    const [formsLoading, setFormsLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [editingForm, setEditingForm] = useState(null); // null = new form, object = editing
    const [deletingId, setDeletingId] = useState(null);

    // Fetch user forms
    const fetchForms = async () => {
        setFormsLoading(true);
        setFetchError('');
        try {
            const res = await fetch(`${API}/api/forms/get-club-forms`, {
                method: 'GET',
                credentials: 'include',
            });
            console.log('[MyForms] GET /api/forms/get-user-forms → status:', res.status);
            const text = await res.text();
            console.log('[MyForms] Raw response:', text);
            let json;
            try { json = JSON.parse(text); } catch {
                setFetchError(`Server returned non-JSON (HTTP ${res.status}). See console for details.`);
                return;
            }
            console.log('[MyForms] Parsed JSON:', json);
            if (json.success) {
                const fetched = json.data || json.forms || [];
                console.log('[MyForms] Setting forms →', fetched);
                setForms(fetched);
            } else {
                console.warn('[MyForms] success=false:', json.message);
                setFetchError(json.message || 'Failed to load forms.');
            }
        } catch (err) {
            console.error('[MyForms] Fetch error:', err);
            setFetchError(err.message || 'Network error.');
        } finally {
            setFormsLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    // Delete form
    const handleDelete = async (e, formId) => {
        e.stopPropagation(); // don't open edit
        setDeletingId(formId);
        try {
            const res = await fetch(`${API}/api/forms/delete-form`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formId }),
            });
            const json = await res.json();
            if (json.success) {
                setForms(prev => prev.filter(f => f._id !== formId));
                toast.success('Form deleted successfully!');
            } else {
                toast.error(json.message || 'Failed to delete form.');
            }
        } catch (err) {
            console.error('Delete failed:', err);
            toast.error(err.message || 'Network error while deleting.');
        } finally {
            setDeletingId(null);
        }
    };

    // After create / edit success — refetch and close
    const handleSuccess = () => {
        setShowCreate(false);
        setEditingForm(null);
        fetchForms();
    };


    const isFormOpen = showCreate || editingForm !== null;

    return (
        <div className="font-mono">
            <div className="max-w-6xl mx-auto px-4 py-10 md:px-8 space-y-8">

                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => isFormOpen ? (setShowCreate(false), setEditingForm(null)) : navigate(-1)}
                            className="flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-colors"
                            title={isFormOpen ? 'Back to forms' : 'Go back'}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {editingForm ? 'Edit Form' : showCreate ? 'Create Form' : 'My Forms'}
                            </h1>
                            <p className="text-sm text-gray-500">Manage your created forms</p>
                        </div>
                    </div>
                    {!isFormOpen && (
                        <button
                            onClick={() => { setEditingForm(null); setShowCreate(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Create Form
                        </button>
                    )}
                </div>

                {/* Content area */}
                {isFormOpen ? (
                    <CreateForm
                        initialData={editingForm}
                        onSuccess={handleSuccess}
                        onCancel={() => { setShowCreate(false); setEditingForm(null); }}
                    />
                ) : formsLoading ? (
                    <div className="flex justify-center py-24">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="text-sm text-gray-500">Loading your forms…</p>
                        </div>
                    </div>
                ) : fetchError ? (
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 px-6 py-8 text-center space-y-2">
                        <p className="text-sm text-red-600 font-medium">{fetchError}</p>
                        <button onClick={fetchForms} className="text-sm text-blue-600 hover:underline">Retry</button>
                    </div>
                ) : (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* Templates Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Plus className="h-5 w-5 text-blue-600" />
                                Start from a Template
                            </h2>
                            <div className="flex flex-wrap gap-5">
                                {/* Template Card */}
                                <div
                                    onClick={() => {
                                        setEditingForm(ONBOARDING_TEMPLATE);
                                        setShowCreate(true);
                                    }}
                                    className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Onboarding Form</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mt-2">
                                        Pre-configured template with standard onboarding questions.
                                    </p>
                                    <div className="mt-auto pt-4 flex items-center gap-2">
                                         <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Use Template</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Forms Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                Your Forms
                            </h2>
                            
                            {forms.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center gap-4">
                                     <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                                         <FileText className="h-6 w-6 text-gray-400" />
                                     </div>
                                     <div className="text-center space-y-1">
                                         <p className="text-base font-semibold text-gray-800">No Forms Created</p>
                                         <p className="text-sm text-gray-500">Create a new form or start from a template.</p>
                                     </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-5">
                                    {forms.map(form => (
                                        <div
                                            key={form._id}
                                            onClick={() => setEditingForm(form)}
                                            className="group relative bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-blue-100 transition-all duration-200 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
                                        >
                                            {/* Edit hint */}
                                            <div className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Pencil className="h-3.5 w-3.5 text-blue-400" />
                                            </div>

                                            {/* Delete button */}
                                            <button
                                                onClick={(e) => handleDelete(e, form._id)}
                                                disabled={deletingId === form._id}
                                                className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                                                title="Delete form"
                                            >
                                                {deletingId === form._id
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : <Trash2 className="h-4 w-4" />}
                                            </button>

                                            {/* Form info */}
                                            <h3 className="font-semibold text-gray-900 truncate pr-8">{form.title}</h3>
                                            {form.desc && (
                                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{form.desc}</p>
                                            )}

                                            <div className="mt-auto flex items-center gap-2 flex-wrap pt-2">
                                                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${form.isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {form.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                                    {form.isPublic ? 'Public' : 'Private'}
                                                </span>
                                                <span className="text-xs text-gray-400 ml-auto">
                                                    {form.fields?.length || 0} field{form.fields?.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
