import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from '@/pages/Profile/Shared/ProfileContext';

import DashboardHeader from './DashboardHeader';
import ApplicantCard from './review/ApplicantCard';
import ReviewTable from './review/ReviewTable';
import ReviewModal from './review/ReviewModal';
import { toast } from 'react-toastify';
import { ExternalLink, FileText, ImageIcon } from 'lucide-react';
import { isImageUrl, isPdfUrl, isUploadUrl } from '@/lib/fileUpload';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
import { Search, Star, MessageSquare, Trophy, Plus } from 'lucide-react';

const Dashboard = ({ viewerRole = 'admin', isEmbedded = false }) => {
   const location = useLocation();
   const navigate = useNavigate();
   const { formId: routeFormId } = useParams();
   const { user } = useAuth();
   const { activeClub } = useProfile();
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
   const [expandedFile, setExpandedFile] = useState(null);
   const isAdminView = viewerRole === 'admin';
   const responseBasePath = isAdminView ? '/admin/responses' : '/member/responses';

  const selectedForm = useMemo(
    () => forms.find(f => f._id === selectedFormId) || null,
    [forms, selectedFormId]
  );

   const currentClubName = useMemo(() => {
      if (location.state?.club?.name) {
         return location.state.club.name;
      }

      if (activeClub?.name) {
         return activeClub.name;
      }

      if (user?.club?.name) {
         return user.club.name;
      }

      if (Array.isArray(user?.clubs) && user.clubs.length > 0) {
         return user.clubs[0]?.name || '';
      }

      try {
         const saved = localStorage.getItem('enteredClub');
         return saved ? JSON.parse(saved).name : '';
      } catch {
         return '';
      }
   }, [activeClub?.name, location.state, user?.club?.name, user?.clubs]);

   const getAnswerValue = useCallback((answers, fieldInput) => {
      if (!answers || typeof answers !== 'object') return '-';
      const directValue = answers[fieldInput];
      const fallbackKey = Object.keys(answers).find((key) => key.toLowerCase() === fieldInput.toLowerCase());
      const val = directValue ?? (fallbackKey ? answers[fallbackKey] : undefined);
      return val !== undefined && val !== '' && val !== null ? String(val) : '-';
   }, []);

   const getDisplayName = useCallback((response) => {
      if (response?.userId?.name) return response.userId.name;
      const answers = response?.answers || response || {};
      if (typeof answers === 'object') {
         const nameKey = Object.keys(answers).find((k) => k.toLowerCase().includes('name'));
         if (nameKey) return answers[nameKey];
      }
      return 'Unknown';
   }, []);

   const getInitials = useCallback((response) => {
      const name = getDisplayName(response);
      return name !== 'Unknown'
         ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
         : '?';
   }, [getDisplayName]);

   const normalizeUploadedValue = useCallback((value) => {
      const normalizeCloudinaryPdfUrl = (url, isPdfCandidate) => {
         if (!url || !isPdfCandidate) {
            return url;
         }

         if (/res\.cloudinary\.com/i.test(url) && /\/image\/upload\//i.test(url)) {
            return url.replace('/image/upload/', '/raw/upload/');
         }

         return url;
      };

      let parsedValue = value;

      if (typeof parsedValue === 'string') {
         const trimmed = parsedValue.trim();
         const directPdf = isPdfUrl(trimmed);
         const directUrl = normalizeCloudinaryPdfUrl(trimmed, directPdf);

         if (isUploadUrl(trimmed) || isUploadUrl(directUrl)) {
            return {
               url: directUrl,
               type: directPdf ? 'pdf' : 'image',
               name: directUrl.split('/').pop() || 'Uploaded file',
               available: true,
            };
         }

         if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
               parsedValue = JSON.parse(trimmed);
            } catch {
               return null;
            }
         } else {
            return null;
         }
      }

      if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
         return null;
      }

      const normalizedUrl = [
         parsedValue.url,
         parsedValue.path,
         parsedValue.secure_url,
         parsedValue.src,
      ].find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0) || '';

      const normalizedName = [
         parsedValue.name,
         parsedValue.originalname,
         parsedValue.original_filename,
         parsedValue.filename,
      ].find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0) || '';

      const normalizedTypeHint = [
         parsedValue.type,
         parsedValue.mimeType,
         parsedValue.mimetype,
         parsedValue.format,
         parsedValue.resource_type,
      ].find((candidate) => typeof candidate === 'string' && candidate.trim().length > 0) || '';

      const typeHint = normalizedTypeHint.toLowerCase();
      const isPdfByHint = typeHint.includes('pdf');
      const isImageByHint = typeHint.includes('image');

      if (normalizedUrl) {
         const resolvedPdf = isPdfByHint || isPdfUrl(normalizedUrl);
         const normalizedFinalUrl = normalizeCloudinaryPdfUrl(normalizedUrl, resolvedPdf);
         const inferredType = isPdfByHint || isPdfUrl(normalizedUrl)
            ? 'pdf'
            : (isImageByHint || isImageUrl(normalizedUrl) ? 'image' : 'file');

         return {
            url: normalizedFinalUrl,
            type: inferredType,
            name: normalizedName || normalizedFinalUrl.split('/').pop() || 'Uploaded file',
            available: true,
         };
      }

      if (normalizedName || isPdfByHint || isImageByHint) {
         return {
            url: '',
            type: isPdfByHint ? 'pdf' : (isImageByHint ? 'image' : 'file'),
            name: normalizedName || 'Uploaded file',
            available: false,
         };
      }

      return null;
   }, []);

   const getResponseAnswerGroups = useCallback((answers, displayPriority) => {
      const entries = Object.entries(answers || {});

      const uploadedAnswers = entries
         .map(([key, value]) => [key, normalizeUploadedValue(value)])
         .filter(([, value]) => Boolean(value));

      const textAnswers = entries.filter(([, value]) => !normalizeUploadedValue(value));

      if (displayPriority && !textAnswers.some(([key]) => key.toLowerCase().includes('priority'))) {
         textAnswers.unshift(['Priority', displayPriority]);
      }

      return { textAnswers, uploadedAnswers };
   }, [normalizeUploadedValue]);

   const fetchForms = useCallback(async (clubName) => {
      setLoadingForms(true);
      try {
         const params = isAdminView && clubName ? `?club=${encodeURIComponent(clubName)}` : '';
         console.log('[fetchForms] viewerRole:', viewerRole, '| clubName:', clubName, '| params:', params);
         const res = await fetch(`${API}/api/forms/get-club-forms${params}`, { credentials: 'include' });
         const json = await res.json();
         console.log('[fetchForms] response:', json);
         if (json.success && Array.isArray(json.forms)) {
            setForms(json.forms);
            if (json.forms.length > 0) {
               const nextFormId = json.forms.some((form) => form._id === routeFormId)
                  ? routeFormId
                  : json.forms[0]._id;
               setSelectedFormId(nextFormId);
            } else {
               setSelectedFormId("");
            }
         } else {
            setForms([]);
            setSelectedFormId("");
            if (!json.success) {
               toast.error(json.message || 'Failed to load forms');
            }
         }
      } catch (err) {
         console.error('[fetchForms] network error:', err);
         toast.error('Network error loading forms');
      } finally {
         setLoadingForms(false);
      }
   }, [isAdminView, routeFormId, viewerRole]);

   const fetchResponses = useCallback(async (formId) => {
      setLoadingResponses(true);
      setResponses([]);
      try {
         const res = await fetch(`${API}/api/response/get-form-responses/${formId}`, { credentials: 'include' });
         const json = await res.json();
         if (json.success && Array.isArray(json.responses)) {
            setResponses(json.responses);
            if (json.responses.length > 0) {
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
   }, []);

   useEffect(() => {
         fetchForms(currentClubName);
    }, [currentClubName, fetchForms]);

  useEffect(() => {
      if (!selectedFormId) {
         setResponses([]);
         setSelectedResponseId(null);
         return;
      }

      if (!isEmbedded && routeFormId !== selectedFormId) {
         navigate(`${responseBasePath}/${selectedFormId}`, {
            replace: true,
            state: { club: activeClub || location.state?.club }
         });
      }

        fetchResponses(selectedFormId);
     }, [selectedFormId, activeClub, location.state, isEmbedded, navigate, responseBasePath, routeFormId, fetchResponses]);

   useEffect(() => {
      if (!routeFormId || routeFormId === selectedFormId) {
         return;
      }

      setSelectedFormId(routeFormId);
    }, [routeFormId, selectedFormId]);

  const handleUpdateDecision = async (responseId, newDecision) => {
         if (!isAdminView) {
            return;
         }

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
      <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-950 font-mono">
      <div className="sticky top-0 z-30 shrink-0 bg-white">
         <DashboardHeader />
      </div>

         <main className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* LEFT PANE - Applicant List - Shows only if forms exist and are loaded */}
        {!loadingResponses && forms.length > 0 && selectedForm && (
               <div className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-slate-50/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
      <div className="relative flex min-w-0 flex-1 flex-col bg-white">
          
          {/* Top Action Bar */}
          <div className="sticky top-0 z-20 flex shrink-0 flex-col items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur sm:flex-row">
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

          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white text-slate-950 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                   const averageScore = Number(selectedApplicant.averageScore || 0);
                   const currentDecision = selectedApplicant.decision || 'pending';

                   let displayPriority = selectedApplicant.priority;
                   if (!displayPriority && answers) {
                       const pKey = Object.keys(answers).find(k => k.toLowerCase().includes('priority'));
                       if (pKey) displayPriority = answers[pKey];
                   }

                   const { textAnswers, uploadedAnswers } = getResponseAnswerGroups(answers, displayPriority);

                   return (
                      <div className="w-full p-6 pb-8 space-y-6">
                         {/* Header Profile Area */}
                         <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex gap-4 items-center">
                               <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-lg font-semibold text-slate-900 shadow-sm">
                                  {getInitials(selectedApplicant)}
                               </div>
                               <div>
                                  <h2 className="text-xl font-bold tracking-tight">{getDisplayName(selectedApplicant)}</h2>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground text-slate-500 mt-1">
                                     <span>{selectedApplicant.userId?.email || getAnswerValue(answers, 'Email')}</span>
                                     <span className="text-slate-300">•</span>
                                     <span>{getAnswerValue(answers, 'Phone')}</span>
                                  </div>
                                  {displayPriority && (
                                   <div className="flex items-center gap-2 mt-2">
                                     <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Priority</span>
                                     <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 shadow-sm uppercase">
                                       Preference #{displayPriority}
                                     </span>
                                   </div>
                               )}
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
                               {isAdminView && (
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
                               )}
                            </div>
                         </div>

                         {/* Middle Info Stats using generic shadcn styling */}
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded border border-slate-200 bg-white text-slate-950 shadow-sm p-4 flex flex-row items-center justify-between space-y-0">
                               <div className="flex flex-col space-y-1">
                                   <div className="text-xs font-semibold tracking-tight text-slate-900 uppercase">Avg Score</div>
                                   <div className="text-xl font-bold">
                                      {(Math.round(averageScore * 10) / 10).toFixed(1)}
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
                             <div className="flex flex-wrap gap-6 rounded-lg border border-slate-200 bg-white shadow-sm p-6">
                            {textAnswers.map(([key, val]) => {
                                  const isPriorityField = key.toLowerCase().includes('priority');
                                  let actualVal = val;
                                  if (isPriorityField && !val && displayPriority) {
                                      actualVal = displayPriority;
                                  }

                                  const answerStr = String(actualVal || '-');
                                  const isLongText = answerStr.length > 50;

                                  return (
                                     <div key={key} className={`space-y-1.5 ${isLongText ? 'w-full' : 'flex-1 min-w-[150px]'}`}>
                                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{key}</div>
                                        <div className="text-[13px] font-medium text-slate-900 wrap-break-word leading-relaxed whitespace-pre-wrap">{answerStr}</div>
                                     </div>
                                  );
                               })}
                            </div>
                         </div>

                                     {uploadedAnswers.length > 0 && (
                                        <div>
                                           <h3 className="mb-3 text-base font-semibold tracking-tight">Uploaded Files</h3>
                                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                              {uploadedAnswers.map(([key, fileInfo]) => {
                                                 const imageFile = fileInfo?.type === 'image';
                                                 const pdfFile = fileInfo?.type === 'pdf';
                                                 const hasUrl = Boolean(fileInfo?.url);
                                                 const resolvedOpenUrl = hasUrl
                                                    ? `${API}/api/response/open-upload?url=${encodeURIComponent(fileInfo.url)}`
                                                    : '';

                                                 return (
                                                    <div key={key} className="w-full max-w-[200px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                                                       {imageFile ? (
                                                          <img src={fileInfo.url} alt={fileInfo.name} className="h-16 w-full object-cover" />
                                                       ) : (
                                                          <div className="flex h-16 items-center justify-center bg-slate-50 text-slate-500">
                                                             <FileText className="h-10 w-10" />
                                                          </div>
                                                       )}
                                                       <div className="space-y-2 p-4">
                                                          <div className="flex items-center gap-2">
                                                             {imageFile ? <ImageIcon className="h-4 w-4 text-slate-500" /> : <FileText className="h-4 w-4 text-slate-500" />}
                                                             <p className="truncate text-sm font-medium text-slate-900">{fileInfo.name}</p>
                                                          </div>
                                                          {hasUrl ? (
                                                             imageFile ? (
                                                                <button
                                                                   type="button"
                                                                   onClick={() => setExpandedFile(fileInfo)}
                                                                   className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                                                >
                                                                   Open file
                                                                   <ExternalLink className="h-3.5 w-3.5" />
                                                                </button>
                                                             ) : (
                                                                <a
                                                                   href={resolvedOpenUrl}
                                                                   target="_blank"
                                                                   rel="noreferrer"
                                                                   className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                                                                >
                                                                   {pdfFile ? 'View PDF' : 'Open file'}
                                                                   <ExternalLink className="h-3.5 w-3.5" />
                                                                </a>
                                                             )
                                                          ) : (
                                                             <p className="text-xs font-medium text-slate-500">File uploaded (preview unavailable for older record)</p>
                                                          )}
                                                       </div>
                                                    </div>
                                                 );
                                              })}
                                           </div>
                                        </div>
                                     )}

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

         {expandedFile && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
               onClick={() => setExpandedFile(null)}
               role="presentation"
            >
               <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()} role="presentation">
                  <button
                     type="button"
                     onClick={() => setExpandedFile(null)}
                     className="absolute right-2 top-2 z-10 rounded-md bg-black/60 px-3 py-1.5 text-sm font-medium text-white hover:bg-black/80"
                  >
                     Close
                  </button>
                  <img
                     src={expandedFile.url}
                     alt={expandedFile.name}
                     className="max-h-[90vh] w-full rounded-lg bg-black object-contain"
                  />
               </div>
            </div>
         )}
    </div>
  );
};

export default Dashboard;
