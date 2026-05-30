import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, getMyAttempts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiTarget, FiAward, FiArrowRight, FiGlobe, FiTv, FiCode, FiCpu } from 'react-icons/fi';

function Dashboard() {
  const [quizCount, setQuizCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, attemptsRes] = await Promise.all([
          getQuizzes(),
          getMyAttempts(),
        ]);

        const quizzes = quizzesRes.data || [];
        const attempts = attemptsRes.data || [];

        setQuizCount(Array.isArray(quizzes) ? quizzes.length : 0);
        setAttemptCount(Array.isArray(attempts) ? attempts.length : 0);

        if (Array.isArray(attempts) && attempts.length > 0) {
          const maxPercentage = Math.max(
            ...attempts.map((a) => {
              const total = a.totalMarks || a.totalScore || a.totalQuestions || 1;
              const scored = a.score != null ? a.score : a.obtainedMarks || 0;
              return Math.round((scored / total) * 100);
            })
          );
          setBestScore(maxPercentage);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: <FiBook className="w-6 h-6" />,
      label: 'Quizzes Available',
      value: quizCount,
      gradient: 'from-blue-500 to-indigo-500',
      shadow: 'shadow-blue-500/10',
      delay: 'delay-1',
    },
    {
      icon: <FiTarget className="w-6 h-6" />,
      label: 'Attempts Made',
      value: attemptCount,
      gradient: 'from-purple-500 to-pink-500',
      shadow: 'shadow-purple-500/10',
      delay: 'delay-2',
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      label: 'Best Score',
      value: `${bestScore}%`,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/10',
      delay: 'delay-3',
    },
  ];

  const categories = [
    {
      title: 'Programming',
      desc: 'Java, Python, Javascript, and more coding topics.',
      icon: <FiCode className="w-8 h-8" />,
      gradient: 'from-amber-500/10 to-orange-500/10 border-orange-500/20 text-orange-400',
      count: 'Programming Quizzes',
    },
    {
      title: 'Science & Technology',
      desc: 'Explore physics, chemistry, biology, and cutting-edge tech.',
      icon: <FiCpu className="w-8 h-8" />,
      gradient: 'from-cyan-500/10 to-blue-500/10 border-blue-500/20 text-cyan-400',
      count: 'Science Quizzes',
    },
    {
      title: 'General Knowledge',
      desc: 'History, geography, world capitals, and general trivia.',
      icon: <FiGlobe className="w-8 h-8" />,
      gradient: 'from-emerald-500/10 to-teal-500/10 border-teal-500/20 text-emerald-400',
      count: 'GK Quizzes',
    },
    {
      title: 'Pop Culture & Media',
      desc: 'Movies, music, celebrities, and pop-culture trends.',
      icon: <FiTv className="w-8 h-8" />,
      gradient: 'from-purple-500/10 to-pink-500/10 border-pink-500/20 text-purple-400',
      count: 'Entertainment Quizzes',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Welcome Banner */}
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {user?.username || 'Challenger'}
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Ready to challenge yourself? Explore categories, test your skills, and beat the global leaderboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`glass-card glass-card-hover p-6 rounded-2xl flex items-center gap-5 border border-slate-900 transition-all duration-300 animate-slide-up ${stat.delay}`}
          >
            <div className={`p-4 rounded-xl bg-gradient-to-tr ${stat.gradient} text-white shadow-lg ${stat.shadow}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Browser */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-white mb-4 flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            Browse Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={`/quizzes?category=${encodeURIComponent(cat.title)}`}
                className="group block glass-card p-6 rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${cat.gradient} border mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  {cat.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {cat.desc}
                </p>
                <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                  <span>Explore Quizzes</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links / Navigation panel */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold tracking-tight text-white mb-4 flex items-center gap-2.5">
            <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
            Quick Navigation
          </h3>
          <div className="space-y-4">
            <Link
              to="/quizzes"
              className="group flex items-center justify-between p-5 glass-card rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <FiBook className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">All Quizzes</h5>
                  <p className="text-slate-400 text-xs">View and play all active quizzes</p>
                </div>
              </div>
              <FiArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all" />
            </Link>

            <Link
              to="/my-attempts"
              className="group flex items-center justify-between p-5 glass-card rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <FiAward className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">My Attempts</h5>
                  <p className="text-slate-400 text-xs">Review your past scores and answers</p>
                </div>
              </div>
              <FiArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 group-hover:text-purple-400 transition-all" />
            </Link>

            <Link
              to="/leaderboard"
              className="group flex items-center justify-between p-5 glass-card rounded-2xl border border-slate-900 hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <FiTarget className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">Global Leaderboard</h5>
                  <p className="text-slate-400 text-xs">Compare scores with players globally</p>
                </div>
              </div>
              <FiArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 group-hover:text-pink-400 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
