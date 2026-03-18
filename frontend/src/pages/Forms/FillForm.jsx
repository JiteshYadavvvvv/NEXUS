import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import FileUploadField from '@/components/ui/FileUploadField';
import { useAuth } from '@/context/AuthContext';
import { createSelectedFiles, FILE_UPLOAD_ACCEPT, isAllowedUploadFile, revokeSelectedFiles } from '@/lib/fileUpload';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function FillForm() {
  const { formId } = useParams();
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [files, setFiles] = useState({});
  const [priority, setPriority] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [usedPriorities, setUsedPriorities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    document.body.classList.add('no-custom-cursor');
    return () => document.body.classList.remove('no-custom-cursor');
  }, []);

  useEffect(() => () => {
    Object.values(filesRef.current).forEach((fileGroup) => revokeSelectedFiles(fileGroup));
  }, []);

  const fetchForm = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/forms/get-form/${formId}`, { credentials: 'include' });
      const json = await res.json();
      if (json.success && json.form) {
        setForm(json.form);
        Object.values(filesRef.current).forEach((fileGroup) => revokeSelectedFiles(fileGroup));
        setFiles({});

        const initial = {};
        json.form.fields.forEach((f) => {
          let autofillValue = '';
          const label = f.input.toLowerCase();

          if (label.includes('regn no') || label.includes('registration')) {
            autofillValue = user?.regnNo || '';
          } else if (label === 'branch') {
            autofillValue = user?.branch || '';
          } else if (label === 'hobbies') {
            autofillValue = user?.hobbies || '';
          } else if (label.includes('phone') || label.includes('number') || label.includes('mobile')) {
            autofillValue = user?.number || '';
          }

          initial[f.input] = autofillValue;
        });

        setAnswers(initial);
      } else {
        setError('Form not found or unavailable.');
      }
    } catch {
      setError('Failed to load the form.');
    } finally {
      setLoading(false);
    }
  }, [formId, user]);

  const fetchResponses = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/response/get-user-responses`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setHasSubmitted(json.responses.some((r) => r.formId === formId));
        setUsedPriorities(json.responses.map((r) => r.priority).filter(Boolean));
      }
    } catch (fetchError) {
      console.error('Failed to fetch user responses:', fetchError);
    }
  }, [formId]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchForm();
      fetchResponses();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [authLoading, user, fetchForm, fetchResponses]);

  const handleChange = (fieldInput, value) => {
    setError('');
    setAnswers((prev) => ({ ...prev, [fieldInput]: value }));
  };

  const handleFilesSelected = (fieldInput, selectedFiles) => {
    const validFiles = selectedFiles.filter((file) => isAllowedUploadFile(file));
    const invalidCount = selectedFiles.length - validFiles.length;

    if (invalidCount > 0) {
      setError('Only JPG, JPEG, PNG and WEBP image files are allowed.');
    }

    const nextItems = createSelectedFiles(validFiles, fieldInput);

    if (nextItems.length === 0) {
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [fieldInput]: [...(prev[fieldInput] || []), ...nextItems],
    }));

    if (invalidCount === 0) {
      setError('');
    }
  };

  const handleRemoveFile = (fieldInput, fileId) => {
    setFiles((prev) => {
      const currentFiles = prev[fieldInput] || [];
      const removedFile = currentFiles.find((item) => item.id === fileId);
      const nextFiles = currentFiles.filter((item) => item.id !== fileId);

      if (removedFile) {
        revokeSelectedFiles([removedFile]);
      }

      if (nextFiles.length === 0) {
        const { [fieldInput]: _removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [fieldInput]: nextFiles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const missing = form.fields.filter((f) => {
      const isPriorityField = f.type === 'priority' || f.input.toLowerCase().includes('priority');
      if (f.type === 'file') {
        return f.required && !(files[f.input]?.length > 0);
      }
      if (isPriorityField) {
        return f.required && !priority;
      }
      return f.required && (!answers[f.input] || !String(answers[f.input]).trim());
    });

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.map((f) => f.input).join(', ')}`);
      return;
    }

    if (priority && usedPriorities.includes(priority)) {
      setError('You have already given this priority to another club.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('formId', formId);

      const cleanAnswers = {};
      Object.entries(answers).forEach(([key, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          cleanAnswers[key] = String(value);
        }
      });

      formData.append('answers', JSON.stringify(cleanAnswers));

      if (priority) {
        formData.append('priority', String(priority));
      }

      Object.entries(files).forEach(([fieldInput, fieldFiles]) => {
        fieldFiles.forEach((item) => {
          formData.append('files', item.file);
          formData.append('fileFieldKeys', fieldInput);
        });
      });

      const res = await fetch(`${API}/api/response/submit-response`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      let json = null;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        json = await res.json();
      }

      if (!res.ok) {
        const fallbackMessage = json?.message || `Request failed with status ${res.status}`;
        setError(fallbackMessage);
        return;
      }

      if (!json) {
        setError('Unexpected server response. Please try again.');
        return;
      }

      if (json.success) {
        Object.values(filesRef.current).forEach((fileGroup) => revokeSelectedFiles(fileGroup));
        setFiles({});
        setSubmitted(true);
      } else if (json.message === 'Priority already used' || json.message === 'Priority already used or form already submitted') {
        setError('You have already used this priority in another form.');
      } else {
        setError(json.message || 'Failed to submit. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-red-600">Login Required</h2>
          <p className="mb-4 text-gray-600">You must be logged in to fill this form.</p>
          <button onClick={() => navigate('/login')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-sm rounded-xl border bg-white p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-red-600">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button onClick={() => navigate(-1)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm transition hover:bg-gray-200">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 fade-in rounded-2xl border bg-white p-10 text-center shadow-sm duration-500">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">Already Submitted</h2>
          <p className="mb-8 text-sm text-gray-500">You have already submitted a response for this form.</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Submitted!</h2>
          <p className="mb-6 text-gray-500">
            Your response for <span className="font-medium text-gray-700">{form?.title}</span> has been recorded.
          </p>
          <button onClick={() => navigate(-1)} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          ← Back
        </button>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b bg-blue-50 px-8 py-7">
            <h1 className="text-2xl font-bold text-gray-900">{form?.title}</h1>
            {form?.desc && <p className="mt-1.5 text-sm text-gray-600">{form.desc}</p>}
            <p className="mt-2 text-xs text-gray-400">
              {form?.fields?.length} question{form?.fields?.length !== 1 ? 's' : ''}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-8 py-7">
            {form?.fields?.map((field, idx) => (
              <div key={field._id || idx} className="space-y-1.5">
                {field.type !== 'file' && (
                  <label className="block text-sm font-medium text-gray-700">
                    {field.input}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                )}

                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    placeholder={`Enter ${field.input.toLowerCase()}...`}
                    value={answers[field.input] || ''}
                    onChange={(e) => handleChange(field.input, e.target.value)}
                    required={field.required}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={answers[field.input] || ''}
                    onChange={(e) => handleChange(field.input, e.target.value)}
                    required={field.required}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select an option...
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'priority' || field.input.toLowerCase().includes('priority') ? (
                  <select
                    value={priority || ''}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    required={field.required}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select Priority
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} disabled={usedPriorities.includes(num)}>
                        Priority {num} {usedPriorities.includes(num) ? '(Already Filled)' : ''}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'file' ? (
                  <FileUploadField
                    inputId={`file-field-${field._id || idx}`}
                    label={field.input}
                    required={field.required}
                    files={files[field.input] || []}
                    accept={FILE_UPLOAD_ACCEPT}
                    onFilesSelected={(selectedFiles) => handleFilesSelected(field.input, selectedFiles)}
                    onRemoveFile={(fileId) => handleRemoveFile(field.input, fileId)}
                    helperText="Upload your file"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={`Enter ${field.input.toLowerCase()}...`}
                    value={answers[field.input] || ''}
                    onChange={(e) => handleChange(field.input, e.target.value)}
                    required={field.required}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            ))}

            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
