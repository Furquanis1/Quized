import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAttemptDetail } from '../services/api';
import { FiAward, FiCheck, FiX, FiClock, FiBookOpen, FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const response = await getAttemptDetail(attemptId);
        setResult(response.data);
      } catch (error) {
        console.error('Failed to fetch attempt details:', error);
        toast.error('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Calculating your score...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Result Not Found</h3>
        <p className="text-slate-400 text-sm mb-6">We couldn&apos;t load the results for this attempt.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const pct = Math.round(result.percentage || 0);
  const totalQuestions = result.details?.length || 0;
  const correctCount = result.details?.filter((d) => d.correct).length || 0;
  const incorrectCount = totalQuestions - correctCount;

  // Feedback details
  let feedbackTitle = 'Keep Practicing!';
  let feedbackText = 'Don\'t give up! Review your answers below to learn and try again.';
  let feedbackColor = 'text-rose-400';
  let badgeColor = 'bg-rose-500/10 border-rose-500/20 text-rose-400';

  if (pct >= 80) {
    feedbackTitle = 'Outstanding!';
    feedbackText = 'Exceptional job! You have demonstrated a strong mastery of this topic.';
    feedbackColor = 'text-emerald-400';
    badgeColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
  } else if (pct >= 50) {
    feedbackTitle = 'Good Job!';
    feedbackText = 'Nice attempt! You are on the right track. Try again to get a perfect score.';
    feedbackColor = 'text-amber-400';
    badgeColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  }

  // Calculate time spent if startedAt and completedAt are present
  const formatDuration = () => {
    if (!result.startedAt || !result.completedAt) return 'N/A';
    const start = new Date(result.startedAt);
    const end = new Date(result.completedAt);
    const diffSecs = Math.max(0, Math.floor((end - start) / 1000));
    
    const mins = Math.floor(diffSecs / 60);
    const secs = diffSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Result Card */}
      <div className="glass-card rounded-3xl border border-slate-900 p-8 md:p-12 text-center mb-8 relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full filter blur-[80px] opacity-10 bg-indigo-500`} />

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-slate-900 border border-slate-800 shadow-xl shadow-indigo-500/5">
            <FiAward className="w-10 h-10 text-indigo-400" />
          </div>
          
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{result.quizTitle}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-6">Quiz Finished!</h1>

          {/* Large percentage circle */}
          <div className="inline-block relative mb-6">
            <div className="w-36 h-36 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center bg-slate-950/60 shadow-inner">
              <span className={`text-4xl font-black ${feedbackColor}`}>{pct}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Scored</span>
            </div>
          </div>

          <h2 className={`text-2xl font-black tracking-tight ${feedbackColor} mb-2`}>{feedbackTitle}</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            {feedbackText}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto border-t border-slate-900 pt-8 mb-8 text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900/60">
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Score</span>
              <span className="text-lg font-black text-white">{result.score} / {result.totalPoints}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900/60">
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Time Spent</span>
              <span className="text-lg font-black text-white">{formatDuration()}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900/60">
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Correct</span>
              <span className="text-lg font-black text-emerald-400">{correctCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900/60">
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Incorrect</span>
              <span className="text-lg font-black text-rose-400">{incorrectCount}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/quizzes"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all duration-200"
            >
              Play Another Quiz
            </Link>
            
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full sm:w-auto px-6 py-3 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-900/80 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiBookOpen className="w-4 h-4" />
              <span>Review Answers</span>
              {showReview ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Answer Review Section */}
      {showReview && (
        <div className="space-y-5 animate-slide-up mt-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
            Question-by-Question Review
          </h3>

          {result.details && result.details.map((detail, idx) => {
            const isCorrect = detail.correct;
            const hasAnswered = detail.selectedOptionId !== null;
            
            return (
              <div
                key={detail.questionId || idx}
                className="glass-card rounded-2xl border border-slate-900 p-6 flex flex-col md:flex-row gap-5 items-start justify-between hover:border-slate-800 transition-colors"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      {idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white leading-relaxed">{detail.questionText}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-10 text-sm">
                    {/* Selected Answer */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                      <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Your Answer</span>
                      <div className="flex items-center gap-2">
                        {hasAnswered ? (
                          <>
                            {isCorrect ? (
                              <FiCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <FiX className="w-4 h-4 text-rose-400 flex-shrink-0" />
                            )}
                            <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300 font-semibold'}>
                              {detail.selectedOptionText}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-500 italic">Not answered</span>
                        )}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-900">
                      <span className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Correct Answer</span>
                      <div className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-emerald-300 font-semibold">{detail.correctOptionText}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="self-end md:self-start flex-shrink-0 pl-10 md:pl-0">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                    isCorrect 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    {isCorrect ? `+${detail.points} Pts` : '0 Pts'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QuizResult;
