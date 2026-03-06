import React from 'react';

const SubmissionCard = ({ user }) => {
  const priorityColor = {
    1: 'bg-red-100 text-red-700',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-green-100 text-green-700'
  };

  const avgRating = user.remarks && user.remarks.length
    ? (user.remarks.reduce((s, r) => s + (r.rating || 0), 0) / user.remarks.length).toFixed(1)
    : null;

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'NA';

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 border hover:shadow-lg transition duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center text-lg font-semibold text-gray-800">
              {initials}
            </div>
            <div
              className="absolute -inset-0.5 rounded-full pointer-events-none"
              style={{ boxShadow: '0 0 0 3px rgba(66,133,244,0.12), 0 0 0 6px rgba(219,68,55,0.06)' }}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="text-sm text-gray-600">{user.domain || '-'}</div>
            <div className="text-xs text-gray-500 mt-1">{user.branch || '-'}</div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${priorityColor[user.priority] || 'bg-gray-100 text-gray-700'}`}>
            {user.priority ? `Priority ${user.priority}` : 'Priority -'}
          </span>

          {avgRating ? (
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.431L23 9.75l-5.5 5.364L19.335 24 12 19.897 4.665 24 6.5 15.114 1 9.75l7.332-1.732z" />
              </svg>
              <span>{avgRating}/10</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No ratings yet</div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <p><strong>Reg:</strong> {user.reg || '-'}</p>
        <p><strong>Phone:</strong> {user.phone || '-'}</p>
        <p><strong>Email:</strong> {user.email || '-'}</p>
      </div>

      {user.reason && (
        <div>
          <p className="text-sm text-gray-800 italic">"{user.reason}"</p>
        </div>
      )}

      <div>
        {user.bestProject ? (
          <a
            href={user.bestProject}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View Best Project
          </a>
        ) : (
          <div className="text-sm text-gray-500">No project link</div>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
