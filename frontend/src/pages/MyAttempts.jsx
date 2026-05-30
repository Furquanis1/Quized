import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAttempts } from '../services/api';
import { FiAward, FiCalendar, FiArrowRight, FiCheckCircle, FiClock } from 'react-icons/fi';

function MyAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const response = await getMyAttempts();
        setAttempts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch attempts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  const getPercentageColor = (pct) => {
    if (pct >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (pct >= 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Fetching your history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">My Attempts</h1>
        <p className="text-slate-400 text-base">Review your quiz attempts, scores, and completion history.</p>
      </div>

      {/* Attempts List */}
      {attempts.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-900 max-w-md mx-auto mt-10">
          <FiAward className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">No Attempts Yet</h4>
          <p className="text-slate-500 text-sm mb-6">
            You haven&apos;t taken any quizzes yet. Challenge yourself with a quiz now!
          </p>
          <Link
            to="/quizzes"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Browse Quizzes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block glass-card rounded-2xl border border-slate-900 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Quiz Title</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Percentage</th>
                  <th className="px-6 py-4">Completed On</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-300">
                {attempts.map((attempt) => {
                  const pct = Math.round(attempt.percentage || 0);
                  return (
                    <tr key={attempt.attemptId} className="hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{attempt.quizTitle}</td>
                      <td className="px-6 py-4 text-center font-semibold">
                        {attempt.score} / {attempt.totalPoints}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getPercentageColor(pct)}`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-slate-500" />
                          <span>{formatDate(attempt.completedAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/result/${attempt.attemptId}`}
                          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors"
                        >
                          <span>Review</span>
                          <FiArrowRight />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {attempts.map((attempt) => {
              const pct = Math.round(attempt.percentage || 0);
              return (
                <div
                  key={attempt.attemptId}
                  className="glass-card p-5 rounded-2xl border border-slate-900 space-y-4 hover:border-slate-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-bold text-white leading-snug">{attempt.quizTitle}</h3>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getPercentageColor(pct)}`}>
                      {pct}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-3">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
                      <span className="text-sm font-bold text-white">{attempt.score} / {attempt.totalPoints}</span>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</span>
                      <span className="text-xs text-slate-400">{formatDate(attempt.completedAt)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/result/${attempt.attemptId}`}
                    className="block w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold rounded-xl text-center text-xs transition-colors"
                  >
                    Review Answers
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAttempts;
