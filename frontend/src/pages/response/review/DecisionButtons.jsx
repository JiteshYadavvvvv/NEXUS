import React, { useState } from 'react';
import { toast } from 'react-toastify';

const DecisionButtons = ({ responseId, currentDecision, applicantName, applicantEmail, onDecisionUpdated }) => {
  const [loadingDecision, setLoadingDecision] = useState(null);
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  const handleDecision = async (decision) => {
    setLoadingDecision(decision);
    try {
      const res = await fetch(`${API}/api/responses/update-decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ responseId, decision })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Decision updated to ${decision}`);
        
        // If the decision is "accepted", also add them to the team members list
        if (decision === 'accepted' && applicantName && applicantEmail) {
          try {
            const addRes = await fetch(`${API}/api/admin/add-member`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ name: applicantName, memberEmail: applicantEmail })
            });
            const addData = await addRes.json();
            if (!addData.success) {
              toast.warning(`Warning: ${addData.message || 'Could not auto-add to Team Members'}`);
            }
          } catch(err) {
            console.error("Auto-add error:", err);
            toast.warning(`Warning: Network error auto-adding to members`);
          }
        }
        
        onDecisionUpdated(decision);
      } else {
        toast.error(data.message || 'Error updating decision');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error updating decision');
    } finally {
      setLoadingDecision(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleDecision('accepted')}
        disabled={loadingDecision || currentDecision === 'accepted'}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentDecision === 'accepted' ? 'bg-green-600 text-white cursor-default' : 'bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50'
        }`}
      >
        {loadingDecision === 'accepted' ? '...' : currentDecision === 'accepted' ? 'Accepted' : 'Accept'}
      </button>
      <button
        onClick={() => handleDecision('rejected')}
        disabled={loadingDecision || currentDecision === 'rejected'}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentDecision === 'rejected' ? 'bg-red-600 text-white cursor-default' : 'bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50'
        }`}
      >
        {loadingDecision === 'rejected' ? '...' : currentDecision === 'rejected' ? 'Rejected' : 'Reject'}
      </button>
      <button
        onClick={() => handleDecision('reviewLater')}
        disabled={loadingDecision || currentDecision === 'reviewLater'}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          currentDecision === 'reviewLater' ? 'bg-orange-500 text-white cursor-default' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 disabled:opacity-50'
        }`}
      >
        {loadingDecision === 'reviewLater' ? '...' : currentDecision === 'reviewLater' ? 'Reviewing Later' : 'Review Later'}
      </button>
    </div>
  );
};

export default DecisionButtons;
