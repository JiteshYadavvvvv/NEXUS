import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { getAuthToken } from '@/lib/authSetup';

const ReviewModal = ({ isOpen, onClose, response, onReviewAdded }) => {
  const { user } = useAuth();
  const [scores, setScores] = useState({
    communication: '',
    technical: '',
    interest: '',
    behaviour: '',
    other: ''
  });
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  if (!isOpen || !response) return null;

  const handleScoreChange = (field, value) => {
    if (value === '') {
      setScores(prev => ({ ...prev, [field]: '' }));
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 1 && num <= 10) {
        setScores(prev => ({ ...prev, [field]: num }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const cleanScores = {};
    Object.entries(scores).forEach(([key, val]) => {
      if (val !== '') cleanScores[key] = val;
    });

    const payload = {
      responseId: response._id,
      reviewerName: user?.adminName || user?.name || 'Reviewer',
      scores: cleanScores,
      comment
    };

    try {
      const res = await fetch(`${API}/api/response/add-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review added successfully");
        onReviewAdded(response._id); 
        onClose();
      } else {
        toast.error(data.message || "Failed to add review");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error while adding review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Add Review</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Scoring is optional. Enter a value between 1 and 10. Only filled scores will be counted for the total.
          </p>

          <form id="review-form" onSubmit={handleSubmit} className="space-y-4">
            {['communication', 'technical', 'interest', 'behaviour', 'other'].map(field => (
              <div key={field} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize w-1/3">{field}</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={scores[field]}
                  onChange={(e) => handleScoreChange(field, e.target.value)}
                  placeholder="1-10"
                  className="mt-1 w-24 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="pt-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Details about the applicant..."
                rows="3"
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="review-form"
            disabled={submitting}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
