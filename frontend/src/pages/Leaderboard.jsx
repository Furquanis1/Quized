import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import { FiAward, FiStar, FiUser } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

const Leaderboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard();
        setEntries(response.data || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy className="w-5 h-5 text-amber-400" />;
      case 1:
        return <FaTrophy className="w-5 h-5 text-slate-300" />;
      case 2:
        return <FaTrophy className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="font-bold text-slate-500">{index + 1}</span>;
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return 'border-amber-500/25 bg-amber-500/5 text-amber-300';
      case 1:
        return 'border-slate-500/25 bg-slate-500/5 text-slate-300';
      case 2:
        return 'border-amber-700/25 bg-amber-700/5 text-amber-500';
      default:
        return 'border-slate-900 bg-slate-950/20 text-slate-300';
    }
  };

  const getPercentageColor = (pct) => {
    if (pct >= 80) return 'text-emerald-400';
    if (pct >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Fetching global standings...</span>
        </div>
      </div>
    );
  }

  // Separate top 3 for podium
  const topThree = entries.slice(0, 3);
  const remainder = entries.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-float">
          <FaTrophy className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Global Leaderboard</h1>
        <p className="text-slate-400 text-base max-w-md mx-auto">
          The wall of champions! Compete, improve, and secure your place at the top.
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-900 max-w-md mx-auto mt-10">
          <FiAward className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">No High Scores Yet</h4>
          <p className="text-slate-500 text-sm">
            Be the first to claim your spot on the leaderboard by completing a quiz!
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Podium Display (Top 3 Players) */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-end pt-4">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="order-2 md:order-1 glass-card p-6 rounded-2xl border border-slate-900/60 hover:border-slate-800 transition-all duration-300 md:h-[220px] flex flex-col justify-between text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-400" />
                  <div>
                    <div className="w-12 h-12 rounded-full bg-slate-500/10 border border-slate-500/30 flex items-center justify-center text-slate-300 font-bold mx-auto mb-3">
                      2
                    </div>
                    <h3 className="font-bold text-white text-base line-clamp-1">{topThree[1].username || 'Player'}</h3>
                    <p className="text-slate-400 text-xs mt-1 truncate">{topThree[1].quizTitle}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900/60">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
                    <span className="text-lg font-black text-slate-300">
                      {topThree[1].score} / {topThree[1].totalPoints} ({Math.round(topThree[1].percentage)}%)
                    </span>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="order-1 md:order-2 glass-card p-8 rounded-3xl border border-amber-500/20 hover:border-amber-500/35 transition-all duration-300 md:h-[260px] flex flex-col justify-between text-center shadow-lg shadow-amber-500/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500" />
                  <div className="absolute -top-1 right-2 animate-pulse text-amber-500">
                    <FiStar className="w-8 h-8 fill-current opacity-20" />
                  </div>
                  <div>
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black mx-auto mb-3 shadow-md shadow-amber-500/10">
                      <FaTrophy className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-white text-lg line-clamp-1">{topThree[0].username || 'Player'}</h3>
                    <p className="text-slate-400 text-xs mt-1 truncate font-medium">{topThree[0].quizTitle}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900/60">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
                    <span className="text-xl font-black text-amber-400">
                      {topThree[0].score} / {topThree[0].totalPoints} ({Math.round(topThree[0].percentage)}%)
                    </span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="order-3 glass-card p-6 rounded-2xl border border-slate-900/60 hover:border-slate-800 transition-all duration-300 md:h-[200px] flex flex-col justify-between text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-700" />
                  <div>
                    <div className="w-12 h-12 rounded-full bg-amber-700/10 border border-amber-700/30 flex items-center justify-center text-amber-600 font-bold mx-auto mb-3">
                      3
                    </div>
                    <h3 className="font-bold text-white text-base line-clamp-1">{topThree[2].username || 'Player'}</h3>
                    <p className="text-slate-400 text-xs mt-1 truncate">{topThree[2].quizTitle}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-900/60">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Score</span>
                    <span className="text-lg font-black text-amber-600">
                      {topThree[2].score} / {topThree[2].totalPoints} ({Math.round(topThree[2].percentage)}%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Rest-of-List Table */}
          {remainder.length > 0 && (
            <div className="glass-card rounded-2xl border border-slate-900 overflow-hidden max-w-4xl mx-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4 text-center" style={{ width: 80 }}>Rank</th>
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Quiz</th>
                    <th className="px-6 py-4 text-center">Score</th>
                    <th className="px-6 py-4 text-center">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {remainder.map((entry, idx) => {
                    const rank = idx + 4;
                    const pct = Math.round(entry.percentage || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-slate-500">{rank}</td>
                        <td className="px-6 py-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-slate-500 w-4 h-4" />
                            <span>{entry.username || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{entry.quizTitle}</td>
                        <td className="px-6 py-4 text-center font-bold">{entry.score} / {entry.totalPoints}</td>
                        <td className="px-6 py-4 text-center font-bold">
                          <span className={getPercentageColor(pct)}>{pct}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
