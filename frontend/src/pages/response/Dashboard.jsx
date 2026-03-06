import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const GDGHeader = () => (
  <div className="bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/clublogos/google-developers.svg" alt="GDG Logo" className="w-8 h-8 object-contain" />
        <span className="text-lg font-medium text-gray-800">Google Developers Group</span>
      </div>
      <button className="bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
        + Add Student
      </button>
    </div>
    <div className="flex h-[3px] w-7xl mx-auto px-4">
      <div className="flex-1 bg-[#4285F4]" />
      <div className="flex-1 bg-[#EA4335]" />
      <div className="flex-1 bg-[#FABB05]" />
      <div className="flex-1 bg-[#34A853]" />
    </div>
  </div>
);

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [responses, setResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingForms, setLoadingForms] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const { user, authLoading } = useAuth();

  useEffect(() => {
    document.body.classList.add('no-custom-cursor');
    return () => document.body.classList.remove('no-custom-cursor');
  }, []);

  const selectedForm = useMemo(
    () => forms.find(f => f._id === selectedFormId) || null,
    [forms, selectedFormId]
  );

  useEffect(() => {
    if (authLoading) return;
    if (user && user.year?.toLowerCase() === 'te') {
      fetchForms();
    } else {
      setLoadingForms(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (selectedFormId) fetchResponses(selectedFormId);
  }, [selectedFormId]);

  const fetchForms = async () => {
    setLoadingForms(true);
    try {
      const res = await fetch(`${API}/api/forms/get-user-forms`, { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.forms) && json.forms.length > 0) {
        setForms(json.forms);
        setSelectedFormId(json.forms[0]._id);
      } else {
        setForms([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForms(false);
    }
  };

  const fetchResponses = async (formId) => {
    setLoadingResponses(true);
    setResponses([]);
    try {
      const res = await fetch(`${API}/api/response/get-form-responses/${formId}`, { credentials: 'include' });
      const json = await res.json();
      if (json.success && Array.isArray(json.responses)) {
        setResponses(json.responses);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResponses(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!user || user.year?.toLowerCase() !== 'te') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Not Authorized</h2>
          <p className="text-gray-600">Only TE Panel members can view form responses.</p>
        </div>
      </div>
    );
  }

  const columns = selectedForm?.fields || [];


  const getAnswerValue = (answers, fieldInput) => {
    if (!answers || typeof answers !== 'object') return '-';
    const val = answers[fieldInput];
    return val !== undefined && val !== '' && val !== null ? String(val) : '-';
  };

  const getDisplayName = (answers) => {
    if (!answers) return 'Unknown';
    const nameKey = Object.keys(answers).find(k => k.toLowerCase().includes('name'));
    return nameKey ? answers[nameKey] : 'Unknown';
  };

  const getInitials = (answers) => {
    const name = getDisplayName(answers);
    return name !== 'Unknown'
      ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : '?';
  };

  const filteredResponses = responses.filter(r => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const answers = r.answers || {};
    return Object.values(answers).some(v => String(v).toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <GDGHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Form selector + search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {loadingForms ? (
            <span className="text-sm text-gray-500">Loading forms...</span>
          ) : forms.length === 0 ? (
            <span className="text-sm text-gray-500">No forms found. Create a form first from Manage Forms.</span>
          ) : (
            <select
              value={selectedFormId}
              onChange={e => setSelectedFormId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-w-[260px]"
            >
              {forms.map(f => (
                <option key={f._id} value={f._id}>{f.title}</option>
              ))}
            </select>
          )}

          {forms.length > 0 && (
            <input
              type="text"
              placeholder="Search responses..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
            />
          )}
        </div>

        {/* Heading */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedForm ? `Responses — ${selectedForm.title}` : 'Submitted Responses'}
          </h2>
          {!loadingResponses && <p className="text-sm text-gray-500">{filteredResponses.length} result{filteredResponses.length !== 1 ? 's' : ''}</p>}
        </div>

        {/* Loading responses */}
        {loadingResponses && (
          <div className="py-20 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <div className="text-sm text-gray-500">Loading responses...</div>
            </div>
          </div>
        )}

        {/* Empty states */}
        {!loadingResponses && selectedForm && filteredResponses.length === 0 && (
          <div className="bg-white border rounded-lg p-12 text-center text-gray-500 text-sm">
            {searchTerm ? 'No responses match your search.' : 'No responses submitted for this form yet.'}
          </div>
        )}

        {!loadingResponses && !selectedForm && !loadingForms && forms.length === 0 && (
          <div className="bg-white border rounded-lg p-12 text-center text-gray-500 text-sm">
            No forms created yet. Go to <span className="text-blue-600 font-medium">Manage Forms</span> to create one.
          </div>
        )}

        {/* Desktop table */}
        {!loadingResponses && selectedForm && filteredResponses.length > 0 && (
          <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    {columns.map(col => (
                      <th key={col._id || col.input} className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.input}
                      </th>
                    ))}
                    <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResponses.map((r, idx) => (
                    <tr key={r._id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                        <Link to={`/response/${r._id}`} state={{ submissionData: r, formFields: columns }} className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                            {getInitials(r.answers)}
                          </div>
                          <span className="text-xs text-gray-400">#{idx + 1}</span>
                        </Link>
                      </td>
                      {columns.map(col => (
                        <td key={col._id || col.input} className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {getAnswerValue(r.answers, col.input)}
                        </td>
                      ))}
                      <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile cards */}
        {!loadingResponses && selectedForm && filteredResponses.length > 0 && (
          <div className="lg:hidden space-y-3">
            {filteredResponses.map((r) => (
              <Link
                key={r._id}
                to={`/response/${r._id}`}
                state={{ submissionData: r, formFields: columns }}
                className="block bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0">
                    {getInitials(r.answers)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-2">{getDisplayName(r.answers)}</div>
                    <div className="space-y-1">
                      {columns.slice(0, 3).map(col => (
                        <div key={col._id || col.input} className="text-xs text-gray-600">
                          <span className="font-medium">{col.input}:</span> {getAnswerValue(r.answers, col.input)}
                        </div>
                      ))}
                      {columns.length > 3 && <div className="text-xs text-gray-400">+{columns.length - 3} more</div>}
                    </div>
                    {r.createdAt && <div className="mt-2 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
