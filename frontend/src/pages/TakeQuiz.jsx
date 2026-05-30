import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/api';
import { toast } from 'react-toastify';
import { FiClock, FiAlertTriangle, FiFlag, FiArrowRight, FiCheckCircle, FiXCircle } from 'react-icons/fi';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Track user selections: questionId -> optionId
  const [selections, setSelections] = useState({});
  // Track flagged questions: questionId -> boolean
  const [flagged, setFlagged] = useState({});
  // Track instant feedback: questionId -> { selectedOptionId, isCorrect, correctOptionId }
  const [feedback, setFeedback] = useState({});
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        setLoading(true);
        const response = await getQuiz(id);
        const quizData = response.data;
        setQuiz(quizData);
        setTimeLeft((quizData.timeLimit || 10) * 60);
      } catch (error) {
        console.error('Failed to load quiz details:', error);
        toast.error('Could not load quiz. Returning to dashboard.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizDetails();
  }, [id, navigate]);

  // Start timer once quiz details are loaded
  useEffect(() => {
    if (!loading && quiz) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, quiz]);

  const handleAutoSubmit = () => {
    toast.warning('Time limit reached! Submitting your answers automatically.');
    submitAnswers(true);
  };

  const handleSelectOption = (optionId) => {
    const question = quiz.questions[currentIdx];
    // If already answered, don't allow changing
    if (feedback[question.id]) return;

    // Record selection
    setSelections((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));

    // Find the correct option for this question
    const correctOption = question.options.find(o => o.correct);
    const correctOptionId = correctOption ? correctOption.id : null;
    const isCorrect = optionId === correctOptionId;

    // Record instant feedback
    setFeedback((prev) => ({
      ...prev,
      [question.id]: {
        selectedOptionId: optionId,
        isCorrect,
        correctOptionId,
      },
    }));
  };

  const handleToggleFlag = () => {
    const question = quiz.questions[currentIdx];
    setFlagged((prev) => ({
      ...prev,
      [question.id]: !prev[question.id],
    }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const submitAnswers = async (isAuto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Format answers: { questionId, selectedOptionId }
    const answers = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: selections[q.id] || null,
    }));

    try {
      const response = await submitQuiz(id, { answers });
      // The backend returns QuizResultDTO containing attemptId or the result itself.
      // Wait, let's verify if the backend returns the result containing an id.
      // Let's check what QuizResultDTO properties are.
      const resultData = response.data;
      toast.success(isAuto ? 'Quiz submitted!' : 'Congratulations! Quiz submitted successfully.');
      navigate(`/result/${resultData.id || resultData.attemptId || response.data}`);
    } catch (error) {
      console.error('Quiz submission failed:', error);
      toast.error('Failed to submit quiz. Please try again.');
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Preparing your quiz round...</span>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <FiAlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Quiz Empty</h3>
        <p className="text-slate-400 text-sm mb-6">This quiz has no questions available yet. Please try another one.</p>
        <button
          onClick={() => navigate('/quizzes')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Browse Quizzes
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentIdx];
  const questionFeedback = feedback[currentQuestion.id];
  const isQuestionAnswered = !!questionFeedback;
  const progressPercent = Math.round(((Object.keys(feedback).length) / quiz.questions.length) * 100);

  // Time-low warning styling
  const isTimeLow = timeLeft < 60;
  const timerColor = isTimeLow
    ? 'text-rose-500 border-rose-500 bg-rose-500/10 animate-pulse'
    : 'text-indigo-400 border-indigo-500/20 bg-slate-900/60';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Bar: Title, Progress, and Timer */}
      <div className="glass-card rounded-2xl p-5 mb-6 border border-slate-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1.5">{quiz.title}</h2>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <span>Question {currentIdx + 1} of {quiz.questions.length}</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span>{Object.keys(feedback).length} Answered</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Flag Toggle */}
          <button
            onClick={handleToggleFlag}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
              flagged[currentQuestion.id]
                ? 'bg-amber-500/15 border-amber-500/45 text-amber-400'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
            }`}
          >
            <FiFlag className={`w-4 h-4 ${flagged[currentQuestion.id] ? 'fill-current' : ''}`} />
            <span>{flagged[currentQuestion.id] ? 'Flagged' : 'Flag Question'}</span>
          </button>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm tabular-nums transition-all ${timerColor}`}>
            <FiClock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900/60 h-2.5 rounded-full overflow-hidden mb-8 border border-slate-900">
        <div
          style={{ width: `${progressPercent}%` }}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
        />
      </div>

      {/* Gameplay Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Question Text */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-900 min-h-[140px] flex flex-col justify-between">
            <p className="text-xl font-bold text-white leading-relaxed">
              {currentQuestion.questionText}
            </p>
            <span className="mt-4 text-xs font-bold text-indigo-400/80 bg-indigo-500/5 border border-indigo-500/10 self-start px-2.5 py-1 rounded-md uppercase tracking-wider">
              {currentQuestion.points} Points
            </span>
          </div>

          {/* Options List */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selections[currentQuestion.id] === option.id;
              
              // Styling logic depending on whether question is answered & correctness
              let optionStyles = 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 text-slate-300';
              let letterStyles = 'bg-slate-950 text-slate-500 border-slate-800';
              let statusIcon = null;

              if (isQuestionAnswered) {
                if (option.correct) {
                  // Correct option gets highlighted green
                  optionStyles = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5';
                  letterStyles = 'bg-emerald-500 text-white border-emerald-500';
                  statusIcon = <FiCheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />;
                } else if (isSelected && !option.correct) {
                  // Incorrect selection gets highlighted red
                  optionStyles = 'bg-rose-500/10 border-rose-500/40 text-rose-300 animate-shake';
                  letterStyles = 'bg-rose-500 text-white border-rose-500';
                  statusIcon = <FiXCircle className="w-5 h-5 text-rose-400 ml-auto" />;
                } else {
                  // Other options are dimmed
                  optionStyles = 'bg-slate-900/20 border-slate-900/60 text-slate-500 opacity-60 pointer-events-none';
                  letterStyles = 'bg-slate-950/40 text-slate-600 border-slate-900/40';
                }
              } else {
                if (isSelected) {
                  optionStyles = 'bg-indigo-600/10 border-indigo-500 text-white';
                  letterStyles = 'bg-indigo-600 text-white border-indigo-500';
                }
              }

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 cursor-pointer ${optionStyles} ${isQuestionAnswered ? 'pointer-events-none' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${letterStyles}`}>
                    {letter}
                  </div>
                  <span className="font-semibold text-sm leading-relaxed">{option.optionText}</span>
                  {statusIcon}
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-900 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none font-bold rounded-xl text-sm transition-all cursor-pointer"
            >
              Previous
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Next Question</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => submitAnswers(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/10 cursor-pointer"
              >
                Finish Quiz
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Question Navigator */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-900">
            <h3 className="text-sm font-bold text-white mb-4">Question Status</h3>
            <div className="grid grid-cols-5 gap-2.5">
              {quiz.questions.map((q, idx) => {
                const isSelected = currentIdx === idx;
                const isAnswered = !!selections[q.id];
                const isFlagged = !!flagged[q.id];

                let pillColor = 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300';
                if (isAnswered) {
                  pillColor = 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400';
                }
                if (isFlagged) {
                  pillColor = 'bg-amber-500/15 border-amber-500/40 text-amber-400';
                }
                if (isSelected) {
                  pillColor = 'bg-gradient-to-r from-indigo-500 to-purple-500 border-transparent text-white ring-2 ring-indigo-500/20';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${pillColor}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Status Legend */}
            <div className="mt-6 pt-4 border-t border-slate-900/60 space-y-2 text-slate-400 text-xs font-semibold">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded bg-indigo-500/10 border border-indigo-500/40" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded bg-amber-500/15 border border-amber-500/40" />
                <span>Flagged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;
