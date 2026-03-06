import React, { useState } from 'react';

const getDesignationFor = (by, reviewerGroups) => {
  if (!by) return '';
  const lower = by.toLowerCase();
  for (const [role, names] of Object.entries(reviewerGroups)) {
    if (names.some(n => n.toLowerCase() === lower)) return role.replace(/_/g, ' ');
  }
  return '';
};

export const AddRemarkForm = ({ reviewerGroups, onAdd }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(8);
  const [year, setYear] = useState('');
  const [reviewer, setReviewer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (!text.trim()) { setError('Please write a remark first.'); return; }

    setLoading(true);
    try {
      const payload = { text: text.trim(), rating: Number(rating) };
      const reviewerTrim = reviewer.trim();
      if (reviewerTrim) payload.by = reviewerTrim;

      const updated = await onAdd(payload);
      if (updated) {
        setText(''); setRating(8); setReviewer(''); setYear('');
      }
    } catch (err) {
      setError(err?.message || 'Failed to submit remark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Remark & Rating</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write performance notes..."
          rows={4}
          className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Year</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setReviewer(''); }}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select Year</option>
              {Object.keys(reviewerGroups).map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name</label>
            <select
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              disabled={!year}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-800 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
            >
              <option value="">Select Reviewer</option>
              {year && reviewerGroups[year].map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0–10)</label>
            <div className="flex items-center gap-3">
              <input
                type="range" min="0" max="10" value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full" />
              <div className="px-3 py-1 rounded bg-gray-100 font-semibold text-sm">{rating}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Saving...' : 'Save Remark'}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export const RemarkItem = ({ remark, userId, onUserReplace, reviewerGroups, onUpdate, onDelete }) => {
  const designation = getDesignationFor(remark.by, reviewerGroups);

  const handleDelete = async () => {
    if (!window.confirm('Delete this remark?')) return;
    try {
      if(onDelete) await onDelete(userId, remark._id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm text-gray-800 italic">"{remark.text}"</p>
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-semibold">{remark.by || 'Interviewer'}</span>
          {designation && <div className="text-gray-700 font-bold">{designation}</div>}
          <br />
          <span>{new Date(remark.createdAt || Date.now()).toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-semibold">{remark.rating}/10</div>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Delete</button>
        </div>
      </div>
    </div>
  );
};
