import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function FillForm() {
  const { formId } = useParams();
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [priority, setPriority] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const [usedPriorities, setUsedPriorities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchForm();
      fetchResponses();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [formId, authLoading, user]);

  useEffect(() => {
    document.body.classList.add('no-custom-cursor');
    return () => document.body.classList.remove('no-custom-cursor');
  }, []);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/forms/get-form/${formId}`, { credentials: 'include' });
      const json = await res.json();
      if (json.success && json.form) {
        setForm(json.form);
        const initial = {};
        json.form.fields.forEach(f => { 
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
      if (!user) setLoading(false);
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const res = await fetch(`${API}/api/response/get-user-responses`, { credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        setHasSubmitted(json.responses.some(r => r.formId === formId));
        setUsedPriorities(json.responses.map(r => r.priority).filter(Boolean));
      }
    } catch (error) {
      console.error('Failed to fetch user responses:', error);
    }
  };

  const handleChange = (fieldInput, value) => {
    setAnswers(prev => ({ ...prev, [fieldInput]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    const missing = form.fields.filter(f => {
      const isPriorityField = f.type === 'priority' || f.input.toLowerCase().includes('priority');
      if (isPriorityField) return f.required && !priority;
      return f.required && (!answers[f.input] || !String(answers[f.input]).trim());
    });

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.map(f => f.input).join(', ')}`);
      return;
    }

    if (priority && usedPriorities.includes(priority)) {
      setError('You have already given this priority to another club.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { formId, answers };
      if (priority) {
        payload.priority = priority;
      }

      const res = await fetch(`${API}/api/response/submit-response`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        if (json.message === 'Priority already used' || json.message === 'Priority already used or form already submitted') {
          setError('You have already used this priority in another form.');
        } else {
          setError(json.message || 'Failed to submit. Please try again.');
        }
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
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">You must be logged in to fill this form.</p>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center max-w-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border text-center max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-6">
            <CheckCircle2 className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Already Submitted</h2>
          <p className="text-sm text-gray-500 mb-8">You have already submitted a response for this form.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="w-full rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 transition-all"
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
        <div className="bg-white p-10 rounded-2xl shadow-sm border text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submitted!</h2>
          <p className="text-gray-500 mb-6">Your response for <span className="font-medium text-gray-700">{form?.title}</span> has been recorded.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* Form header */}
          <div className="px-8 py-7 border-b bg-blue-50">
            <h1 className="text-2xl font-bold text-gray-900">{form?.title}</h1>
            {form?.desc && <p className="text-gray-600 mt-1.5 text-sm">{form.desc}</p>}
            <p className="text-xs text-gray-400 mt-2">{form?.fields?.length} question{form?.fields?.length !== 1 ? 's' : ''}</p>
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-6">
            {form?.fields?.map((field, idx) => (
              <div key={field._id || idx} className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  {field.input}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    placeholder={`Enter ${field.input.toLowerCase()}...`}
                    value={answers[field.input] || ''}
                    onChange={e => handleChange(field.input, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={answers[field.input] || ''}
                    onChange={e => handleChange(field.input, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="" disabled>Select an option...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (field.type === 'priority' || field.input.toLowerCase().includes('priority')) ? (
                  <select
                    value={priority || ''}
                    onChange={e => setPriority(Number(e.target.value))}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>Select Priority</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num} disabled={usedPriorities.includes(num)}>
                        Priority {num} {usedPriorities.includes(num) ? '(Already Filled)' : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={`Enter ${field.input.toLowerCase()}...`}
                    value={answers[field.input] || ''}
                    onChange={e => handleChange(field.input, e.target.value)}
                    required={field.required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-60"
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
