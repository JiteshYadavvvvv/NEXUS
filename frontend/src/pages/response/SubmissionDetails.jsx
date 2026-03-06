import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';

const SubmissionDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [formFields, setFormFields] = useState([]);

  useEffect(() => {
    if (state?.submissionData) {
      setSubmission(state.submissionData);
      setFormFields(state.formFields || []);
    } else {
      navigate('/response');
    }
  }, [id, state, navigate]);

  useEffect(() => {
    document.body.classList.add('no-custom-cursor');
    return () => document.body.classList.remove('no-custom-cursor');
  }, []);

  if (!submission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  const answers = submission.answers || {};

  const getDisplayName = () => {
    const nameKey = Object.keys(answers).find(k => k.toLowerCase().includes('name'));
    return nameKey ? answers[nameKey] : 'Response';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name !== 'Response'
      ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : '?';
  };

  const displayFields = formFields.length > 0
    ? formFields
    : Object.keys(answers).map(k => ({ input: k, _id: k }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/response" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6">
          ← Back to Responses
        </Link>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {/* Header card */}
          <div className="flex items-center gap-4 p-6 border-b">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 shrink-0">
              {getInitials()}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{getDisplayName()}</div>
              {submission.createdAt && (
                <div className="text-xs text-gray-400 mt-0.5">
                  Submitted on {new Date(submission.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* All answers */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Form Responses</h3>
            <div className="space-y-4">
              {displayFields.map(field => {
                const val = answers[field.input];
                return (
                  <div key={field._id || field.input} className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0">
                    <div className="text-sm font-medium text-gray-600">{field.input}</div>
                    <div className="col-span-2 text-sm text-gray-900 wrap-break-word">
                      {val !== undefined && val !== '' ? val : <span className="text-gray-400 italic">Not answered</span>}
                    </div>
                  </div>
                );
              })}
              {displayFields.length === 0 && (
                <p className="text-sm text-gray-500">No answers recorded for this submission.</p>
              )}
            </div>
          </div>

          {/* Footer meta */}
          <div className="px-6 py-4 bg-gray-50 border-t text-xs text-gray-400 flex justify-between">
            <span>Response ID: {submission._id}</span>
            {submission.createdAt && <span>{new Date(submission.createdAt).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetails;
