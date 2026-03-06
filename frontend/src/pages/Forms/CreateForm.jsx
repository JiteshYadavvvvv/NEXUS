import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const FIELD_TYPES = ['text', 'email', 'textarea', 'select'];
const YEAR_OPTIONS = ['2024-25', '2025-26', '2026-27', '2027-28'];

const emptyField = () => ({
    id: crypto.randomUUID(),
    input: '',
    type: 'text',
    required: false,
    options: [],
    newOption: '',
});

export default function CreateForm({ onSuccess, onCancel, initialData }) {
    const isEdit = Boolean(initialData?._id);

    const [title, setTitle] = useState(initialData?.title || '');
    const [desc, setDesc] = useState(initialData?.desc || '');
    const [year, setYear] = useState(initialData?.year || '');
    const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);
    const [fields, setFields] = useState(
        initialData?.fields?.length
            ? initialData.fields.map(f => ({ id: crypto.randomUUID(), newOption: '', ...f }))
            : [emptyField()]
    );
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [deleteStatus, setDeleteStatus] = useState(null); // null | 'deleting' | 'done'
    const [viewers, setViewers] = useState(initialData?.viewers || []);
    const [newViewer, setNewViewer] = useState('');

    /* ── delete ── */
    const handleDelete = async () => {
        if (!window.confirm('Delete this form? This cannot be undone.')) return;
        setDeleteStatus('deleting');
        try {
            const res = await fetch(`${API}/api/forms/delete-form`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formId: initialData._id }),
            });
            const json = await res.json();
            if (json.success) {
                setDeleteStatus('done');
                setTimeout(() => onSuccess?.(), 800);
            } else {
                setDeleteStatus(null);
                setErrorMsg(json.message || 'Failed to delete form.');
            }
        } catch (err) {
            setDeleteStatus(null);
            setErrorMsg(err.message || 'Network error.');
        }
    };

    /* ── field helpers ── */
    const updateField = (id, patch) =>
        setFields(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));

    const removeField = (id) =>
        setFields(prev => prev.filter(f => f.id !== id));

    const addOption = (id) => {
        setFields(prev => prev.map(f => {
            if (f.id !== id || !f.newOption.trim()) return f;
            return { ...f, options: [...f.options, f.newOption.trim()], newOption: '' };
        }));
    };

    const removeOption = (fieldId, optIdx) =>
        setFields(prev => prev.map(f =>
            f.id === fieldId ? { ...f, options: f.options.filter((_, i) => i !== optIdx) } : f
        ));

    /* ── submit ── */
    const handleSubmit = async () => {
        if (!title.trim()) { setErrorMsg('Form title is required.'); return; }
        setStatus('saving');
        setErrorMsg('');
        try {
            const body = {
                title: title.trim(),
                desc: desc.trim(),
                isPublic,
                public: isPublic,
                year,
                viewers,
                fields: fields.map(({ input, type, required, options }) => {
                    const f = { input, type, required };
                    if (type === 'select') f.options = options;
                    return f;
                }),
            };

            const url = isEdit
                ? `${API}/api/forms/edit-form`
                : `${API}/api/forms/create-form`;
            const method = isEdit ? 'PUT' : 'POST';
            if (isEdit) body.formId = initialData._id;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body),
            });
            const json = await res.json();
            if (json.success) {
                setStatus('success');
                setTimeout(() => onSuccess?.(), 1200);
            } else {
                setStatus('error');
                setErrorMsg(json.message || (isEdit ? 'Failed to update form.' : 'Failed to create form.'));
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message || 'Network error.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Create Form</h2>
                <div className="flex items-center gap-4">
                    {/* Public toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <span className="text-sm font-medium text-gray-600">Public:</span>
                        <button
                            type="button"
                            onClick={() => setIsPublic(p => !p)}
                            className={cn(
                                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none',
                                isPublic ? 'bg-blue-600' : 'bg-gray-200'
                            )}
                        >
                            <span className={cn(
                                'inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200',
                                isPublic ? 'translate-x-6' : 'translate-x-1'
                            )} />
                        </button>
                    </label>

                    {isEdit && (
                        <button
                            onClick={handleDelete}
                            disabled={deleteStatus === 'deleting' || deleteStatus === 'done'}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                            {deleteStatus === 'deleting' ? 'Deleting…' : deleteStatus === 'done' ? 'Deleted!' : 'Delete'}
                        </button>
                    )}
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={status === 'saving' || status === 'success'}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {status === 'saving'
                            ? (isEdit ? 'Saving…' : 'Creating…')
                            : status === 'success'
                            ? '✓ Done!'
                            : (isEdit ? 'Save Changes' : 'Create Form')}
                    </button>
                </div>
            </div>

            {/* Error */}
            {status === 'error' && (
                <p className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-lg px-4 py-3">{errorMsg}</p>
            )}

            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Form Details</h3>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Form Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. AIT Student Feedback Form"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Form Description</label>
                    <textarea
                        rows={3}
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        placeholder="Brief description of what this form is for…"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors resize-y text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Academic Year</label>
                    <div className="relative">
                        <select
                            value={year}
                            onChange={e => setYear(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm appearance-none"
                        >
                            <option value="">Select academic year</option>
                            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Dynamic Fields */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Form Fields</h3>
                </div>

                <div className="space-y-4">
                    {fields.map((field, idx) => (
                        <div key={field.id} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/60">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Field {idx + 1}</span>
                                {fields.length > 1 && (
                                    <button onClick={() => removeField(field.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            {/* Label */}
                            <input
                                type="text"
                                placeholder="Field label / question"
                                value={field.input}
                                onChange={e => updateField(field.id, { input: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                            />

                            {/* Type + Required row */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <select
                                        value={field.type}
                                        onChange={e => updateField(field.id, { type: e.target.value, options: [] })}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm appearance-none"
                                    >
                                        {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                                    <span className="text-sm text-gray-600 font-medium">Required</span>
                                    <button
                                        type="button"
                                        onClick={() => updateField(field.id, { required: !field.required })}
                                        className={cn(
                                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
                                            field.required ? 'bg-blue-600' : 'bg-gray-200'
                                        )}
                                    >
                                        <span className={cn(
                                            'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform duration-200',
                                            field.required ? 'translate-x-4' : 'translate-x-0.5'
                                        )} />
                                    </button>
                                </label>
                            </div>

                            {/* Select options */}
                            {field.type === 'select' && (
                                <div className="space-y-2 pl-2 border-l-2 border-blue-100">
                                    {field.options.map((opt, oi) => (
                                        <div key={oi} className="flex items-center gap-2">
                                            <span className="flex-1 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5">{opt}</span>
                                            <button onClick={() => removeOption(field.id, oi)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Add option…"
                                            value={field.newOption}
                                            onChange={e => updateField(field.id, { newOption: e.target.value })}
                                            onKeyDown={e => e.key === 'Enter' && addOption(field.id)}
                                            className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                                        />
                                        <button
                                            onClick={() => addOption(field.id)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Field — bottom right */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setFields(prev => [...prev, emptyField()])}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Add Field
                    </button>
                </div>
            </div>

            {/* Viewers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Viewers</h3>
                <p className="text-xs text-gray-500">Add callSigns of users who can view this form.</p>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Enter callSign…"
                        value={newViewer}
                        onChange={e => setNewViewer(e.target.value.replace(/\s/g, ''))}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && newViewer.trim()) {
                                setViewers(prev => prev.includes(newViewer.trim()) ? prev : [...prev, newViewer.trim()]);
                                setNewViewer('');
                            }
                        }}
                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm"
                    />
                    <button
                        onClick={() => {
                            if (!newViewer.trim()) return;
                            setViewers(prev => prev.includes(newViewer.trim()) ? prev : [...prev, newViewer.trim()]);
                            setNewViewer('');
                        }}
                        className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add
                    </button>
                </div>

                {viewers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {viewers.map(v => (
                            <span key={v} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                                {v}
                                <button onClick={() => setViewers(prev => prev.filter(x => x !== v))} className="text-blue-400 hover:text-red-500 transition-colors">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
