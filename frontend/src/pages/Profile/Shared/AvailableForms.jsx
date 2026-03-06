import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export default function AvailableForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/api/forms/get-public-forms`, { credentials: 'include' })
      .then(r => r.json())
      .then(json => {
        if (json.success) setForms(json.forms || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Available Forms</h2>
        <p className="text-gray-500 mt-1">Fill out these forms created by the TE panel.</p>
      </div>

      {forms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No forms are available right now.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {forms.map(form => (
            <div
              key={form._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/forms/${form._id}`)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {form.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{form.desc}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {form.fields?.length || 0} question{form.fields?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors mt-0.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
