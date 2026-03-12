import React from 'react';
import { Star } from 'lucide-react';

const ApplicantCard = ({ applicant, index, isSelected, onClick }) => {
  const { _id, answers, averageScore, decision, review } = applicant;

  const decisionColor = {
    accepted: 'border-transparent bg-emerald-100 text-emerald-800',
    rejected: 'border-transparent bg-red-100 text-red-800',
    reviewLater: 'border-transparent bg-amber-100 text-amber-800',
    pending: 'border-transparent bg-slate-100 text-slate-800'
  };

  // Prefer the registered user's name, fall back to form answer key containing 'name'
  const name = applicant?.userId?.name
    || (answers && Object.keys(answers).find(k => k.toLowerCase().includes('name')) ? answers[Object.keys(answers).find(k => k.toLowerCase().includes('name'))] : null)
    || 'Applicant';

  const initials = name !== 'Applicant'
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div
      onClick={() => onClick(applicant)}
      className={`cursor-pointer rounded-xl p-3 border transition-colors duration-200 
        ${isSelected
          ? 'bg-slate-100 border-slate-300 ring-1 ring-slate-200 shadow-sm'
          : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
        }`}
    >
      <div className="flex items-center gap-3.5">
        {/* Avatar & Rank */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 border border-slate-200">
            {initials}
          </div>
          <div className="absolute -top-1.5 -left-1.5 bg-slate-900 text-slate-50 text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm">
            #{index + 1}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight truncate pr-2">{name}</h3>
            {averageScore > 0 && (
              <div className="shrink-0 flex items-center gap-1 text-slate-700 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {(Math.round(averageScore * 10) / 10).toFixed(1)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 capitalize tracking-wider ${decisionColor[decision] || decisionColor.pending}`}>
              {decision === 'reviewLater' ? 'Review Later' : (decision || 'Pending')}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {review?.length || 0} {(review?.length || 0) === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
