import React, { useState, useEffect, useMemo } from "react";

import DashboardHeader from './DashboardHeader';
import ApplicantCard from './review/ApplicantCard';
import ReviewTable from './review/ReviewTable';
import ReviewModal from './review/ReviewModal';
import { toast } from 'react-toastify';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
import { Search, Star, MessageSquare, Trophy, Plus } from 'lucide-react';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [responses, setResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loadingForms, setLoadingForms] = useState(true);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [updatingDecision, setUpdatingDecision] = useState(false);

  useEffect(() => {
    document.body.classList.add('no-custom-cursor');
    return () => document.body.classList.remove('no-custom-cursor');
  }, []);

  const selectedForm = useMemo(
    () => forms.find(f => f._id === selectedFormId) || null,
    [forms, selectedFormId]
  );

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (selectedFormId) fetchResponses(selectedFormId);
  }, [selectedFormId]);

  const fetchForms = async () => {
    setLoadingForms(true);
    try {
      const res = await fetch(`${API}/api/forms/get-club-forms`, { credentials: 'include' });
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
        if (json.responses.length > 0) {
           // Optionally auto-select first
           setSelectedResponseId(json.responses[0]._id);
        } else {
           setSelectedResponseId(null);
        }
      } else {
        setResponses([]);
        setSelectedResponseId(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load responses');
    } finally {
      setLoadingResponses(false);
    }
  };

  const handleUpdateDecision = async (responseId, newDecision) => {
      setUpdatingDecision(true);
      try {
        const res = await fetch(`${API}/api/response/update-decision`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           credentials: 'include',
           body: JSON.stringify({ responseId, decision: newDecision })
        });
        const data = await res.json();
        if (data.success) {
           toast.success(data.message || `Decision updated to ${newDecision}`);
           
           // If accepted, add them straight to the Team Members
           if (newDecision === 'accepted') {
             const applicant = responses.find(r => r._id === responseId);
             const name = getDisplayName(applicant);
             const email = applicant?.userId?.email;
             
             if (name && email) {
                try {
                  const addRes = await fetch(`${API}/api/admin/add-member`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name, memberEmail: email })
                  });
                  const addData = await addRes.json();
                  if (!addData.success) {
                    toast.warning(`Notice: ${addData.message || 'Could not auto-add to Team'}`);
                  }
                } catch(err) {
                  console.error("Auto-add error:", err);
                }
             }
           }

           if (newDecision === 'rejected') {
              setResponses(prev => prev.filter(r => r._id !== responseId));
              setSelectedResponseId(prevId => prevId === responseId ? null : prevId);
           } else {
              setResponses(prev => prev.map(r => r._id === responseId ? { ...r, decision: newDecision } : r));
           }
        } else {
           toast.error(data.message || 'Failed to update decision');
        }
      } catch (err) {
         console.error(err);
         toast.error('Network error updating decision');
      } finally {
         setUpdatingDecision(false);
      }
  };

  const handleReviewAdded = () => {
      if (selectedFormId) {
          fetchResponses(selectedFormId);
      }
  };



  const getAnswerValue = (answers, fieldInput) => {
    if (!answers || typeof answers !== 'object') return '-';
    const val = answers[fieldInput];
    return val !== undefined && val !== '' && val !== null ? String(val) : '-';
  };

  const getDisplayName = (response) => {
    // Prefer the registered user's name (populated from userId by backend)
    if (response?.userId?.name) return response.userId.name;
    // Fallback: look for a form answer key containing 'name'
    const answers = response?.answers || response || {};
    if (typeof answers === 'object') {
      const nameKey = Object.keys(answers).find(k => k.toLowerCase().includes('name'));
      if (nameKey) return answers[nameKey];
    }
    return 'Unknown';
  };

  const getInitials = (response) => {
    const name = getDisplayName(response);
    return name !== 'Unknown'
      ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
      : '?';
  };

  const filteredResponses = responses.filter(r => {
    // Status Filter
    if (filterStatus !== 'all') {
      const currentDecision = r.decision || 'pending';
      if (filterStatus !== currentDecision) return false;
    }

    // Search Filter
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    
    // Check if the applicant's real name matches the search query
    const applicantName = getDisplayName(r).toLowerCase();
    if (applicantName.includes(q)) return true;
    
    // Check if the applicant's email (if populated) matches the search query
    if (r.userId?.email && r.userId.email.toLowerCase().includes(q)) return true;

    // Finally check if any form answers match the search query
    const answers = r.answers || {};
    return Object.values(answers).some(v => String(v).toLowerCase().includes(q));
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-slate-950 font-sans">
      <DashboardHeader />

      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE - Applicant List - Shows only if forms exist and are loaded */}
        {!loadingResponses && forms.length > 0 && selectedForm && (
          <div className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-slate-50/30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">Applicants</h3>
              {filteredResponses.length > 0 && (
                  <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 bg-slate-100 text-slate-900">
                    {filteredResponses.length}
                  </span>
              )}
            </div>
            <div className="flex-1 p-3 space-y-2">
              {filteredResponses.map((r, idx) => (
                <ApplicantCard
                  key={r._id}
                  applicant={r}
                  index={idx}
                  isSelected={selectedResponseId === r._id}
                  onClick={() => setSelectedResponseId(r._id)}
                />
              ))}
              {filteredResponses.length === 0 && (
                 <div className="text-center text-sm text-slate-500 py-6">No applicants found.</div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT PANE - Main Details Workspace */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          
          {/* Top Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 border-b border-slate-200 bg-white shrink-0 gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                  <h2 className="text-base font-semibold tracking-tight text-slate-900 hidden md:block">
                    {selectedForm ? selectedForm.title : 'Responses'}
                  </h2>
                  {loadingForms ? (
                     <span className="text-sm text-slate-500">Loading forms...</span>
                  ) : forms.length === 0 ? (
                     <span className="text-sm text-slate-500">No forms...</span>
                  ) : (
                     <select
                       value={selectedFormId}
                       onChange={e => setSelectedFormId(e.target.value)}
                       className="h-8 w-full sm:w-56 rounded border border-slate-200 bg-white px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                     >
                       {forms.map(f => (
                         <option key={f._id} value={f._id}>{f.title}</option>
                       ))}
                     </select>
                  )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 {forms.length > 0 && (
                    <>
                      <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="h-8 w-full sm:w-36 rounded border border-slate-200 bg-white px-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="reviewLater">Hold</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      
                      <div className="relative w-full sm:w-56">
                        <Search className="absolute left-2.5 top-2 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search applicants..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="flex h-8 w-full rounded border border-slate-200 bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                        />
                      </div>
                    </>
                 )}
              </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white text-slate-950">
             {loadingResponses ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
                    <div className="text-sm text-slate-500">Loading responses...</div>
                  </div>
                </div>
             ) : !selectedForm || forms.length === 0 ? (
                <div className="flex h-full items-center justify-center p-12 text-slate-500 text-sm">
                   No forms created yet. Go to <span className="text-slate-900 font-medium ml-1">Manage Forms</span>.
                </div>
             ) : filteredResponses.length === 0 ? (
                <div className="flex h-full items-center justify-center p-12 text-slate-500 text-sm">
                   {searchTerm ? 'No responses match your search.' : 'No responses submitted for this form yet.'}
                </div>
             ) : !selectedResponseId ? (
                <div className="flex h-full items-center justify-center p-12 text-slate-500 text-sm">
                   Select an applicant from the list to view details.
                </div>
             ) : (
                (() => {
                   const selectedApplicant = filteredResponses.find(r => r._id === selectedResponseId);
                   if (!selectedApplicant) return null;

                   const answers = selectedApplicant.answers || {};
                   const currentDecision = selectedApplicant.decision || 'pending';

                   return (
                      <div className="w-full h-full p-6 space-y-6 pb-8">
                         {/* Header Profile Area */}
                         <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex gap-4 items-center">
                               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-lg font-semibold text-slate-900 shadow-sm">
                                  {getInitials(selectedApplicant)}
                               </div>
                               <div>
                                  <h2 className="text-xl font-bold tracking-tight">{getDisplayName(selectedApplicant)}</h2>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground text-slate-500 mt-1">
                                     <span>{getAnswerValue(answers, 'Email')}</span>
                                     <span className="text-slate-300">•</span>
                                     <span>{getAnswerValue(answers, 'Phone')}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 w-full sm:w-auto items-start sm:items-end">
                               <div className="flex items-center gap-2">
                                 <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</span>
                                 <div className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2
                                     ${currentDecision === 'accepted' ? 'border-transparent bg-emerald-600 text-slate-50 hover:bg-emerald-600/80' :
                                       currentDecision === 'reviewLater' ? 'border-transparent bg-amber-500 text-slate-50 hover:bg-amber-500/80' :
                                       currentDecision === 'rejected' ? 'border-transparent bg-red-600 text-slate-50 hover:bg-red-600/80' :
                                       'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80'}`}>
                                   {currentDecision === 'reviewLater' ? 'Review Later' : currentDecision}
                                 </div>
                               </div>
                               <div className="flex gap-2 mt-1">
                                  <button 
                                     onClick={() => handleUpdateDecision(selectedApplicant._id, 'accepted')}
                                     disabled={updatingDecision || currentDecision === 'accepted'}
                                     className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2
                                        ${currentDecision === 'accepted' ? 'bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90' : 'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 text-slate-900'}`}
                                  >
                                     Accept
                                  </button>
                                  <button 
                                     onClick={() => handleUpdateDecision(selectedApplicant._id, 'reviewLater')}
                                     disabled={updatingDecision || currentDecision === 'reviewLater'}
                                     className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2
                                        ${currentDecision === 'reviewLater' ? 'bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90' : 'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 text-slate-900'}`}
                                  >
                                     Hold
                                  </button>
                                  <button 
                                     onClick={() => handleUpdateDecision(selectedApplicant._id, 'rejected')}
                                     disabled={updatingDecision || currentDecision === 'rejected'}
                                     className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2
                                        ${currentDecision === 'rejected' ? 'bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90' : 'border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 text-slate-900'}`}
                                  >
                                     Reject
                                  </button>
                               </div>
                            </div>
                         </div>

                         {/* Middle Info Stats using generic shadcn styling */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded border border-slate-200 bg-white text-slate-950 shadow-sm p-4 flex flex-row items-center justify-between space-y-0">
                               <div className="flex flex-col space-y-1">
                                   <div className="text-xs font-semibold tracking-tight text-slate-900 uppercase">Avg Score</div>
                                   <div className="text-xl font-bold">
                                      {(Math.round(selectedApplicant.averageScore * 10) / 10).toFixed(1) || '0.0'}
                                      <span className="text-sm text-slate-500 font-medium ml-1">/ 10</span>
                                   </div>
                               </div>
                               <Star className="text-slate-400 w-5 h-5 fill-slate-100" />
                            </div>
                            <div className="rounded border border-slate-200 bg-white text-slate-950 shadow-sm p-4 flex flex-row items-center justify-between space-y-0">
                               <div className="flex flex-col space-y-1">
                                   <div className="text-xs font-semibold tracking-tight text-slate-900 uppercase">Reviews</div>
                                   <div className="text-xl font-bold">{selectedApplicant.review?.length || 0}</div>
                               </div>
                               <MessageSquare className="text-slate-400 w-5 h-5" />
                            </div>
                            <div className="rounded border border-slate-200 bg-white text-slate-950 shadow-sm p-4 flex flex-row items-center justify-between space-y-0">
                               <div className="flex flex-col space-y-1">
                                   <div className="text-xs font-semibold tracking-tight text-slate-900 uppercase">Rank</div>
                                   <div className="text-xl font-bold">
                                      #{filteredResponses.findIndex(r => r._id === selectedApplicant._id) + 1}
                                      <span className="text-xs text-slate-500 font-medium ml-1">of {filteredResponses.length}</span>
                                   </div>
                               </div>
                               <Trophy className="text-slate-400 w-5 h-5" />
                            </div>
                         </div>

                         {/* Form Answers Section */}
                         <div>
                            <h3 className="text-base font-semibold tracking-tight mb-3">Application Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 rounded border border-slate-200 bg-white shadow-sm p-5">
                               {Object.entries(answers).map(([key, val]) => {
                                  if (key.toLowerCase().includes('name') || 
                                      key.toLowerCase().includes('email') || 
                                      key.toLowerCase().includes('phone')) return null;

                                  const answerStr = String(val);
                                  const isLongText = answerStr.length > 60;

                                  return (
                                     <div key={key} className={`space-y-2.5 ${isLongText ? 'col-span-1 md:col-span-2' : ''}`}>
                                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</div>
                                        <div className="text-sm font-medium text-slate-900 wrap-break-word leading-relaxed">{answerStr}</div>
                                     </div>
                                  );
                               })}
                            </div>
                         </div>

                         {/* Review Table Section */}
                         <div>
                            <div className="flex justify-between items-center mb-3">
                               <h3 className="text-base font-semibold tracking-tight">Reviews</h3>
                               <button 
                                  onClick={() => setIsReviewModalOpen(true)}
                                  className="inline-flex items-center justify-center whitespace-nowrap rounded w-auto text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 shadow hover:bg-slate-900/90 h-8 px-3 gap-1.5"
                               >
                                  <Plus className="w-3.5 h-3.5" />
                                  Add Review
                               </button>
                            </div>
                            <div className="rounded border border-slate-200 bg-white shadow-sm overflow-hidden text-sm">
                               <ReviewTable reviews={selectedApplicant.review || []} />
                            </div>
                         </div>

                         <ReviewModal 
                            isOpen={isReviewModalOpen} 
                            onClose={() => setIsReviewModalOpen(false)} 
                            response={selectedApplicant}
                            onReviewAdded={handleReviewAdded}
                         />
                      </div>
                   );
                })()
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
