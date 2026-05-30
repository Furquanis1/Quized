import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getQuizzes } from '../services/api';
import { FiBookOpen, FiClock, FiLayers, FiPlay, FiSearch, FiChevronRight } from 'react-icons/fi';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  
  const categoryFilter = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getQuizzes();
        setQuizzes(response.data || []);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const getDifficultyColor = (questions) => {
    // Determine difficulty based on number of questions or arbitrary logic
    const count = questions?.length || 0;
    if (count <= 5) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (count <= 10) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getDifficultyLabel = (questions) => {
    const count = questions?.length || 0;
    if (count <= 5) return 'Easy';
    if (count <= 10) return 'Medium';
    return 'Hard';
  };

  const categories = ['All', 'Programming', 'Science & Technology', 'General Knowledge', 'Pop Culture & Media'];

  // Map quiz titles/descriptions to categories for demo filtering since the backend schema is basic
  const getQuizCategory = (quiz) => {
    const title = quiz.title.toLowerCase();
    const desc = quiz.description.toLowerCase();
    
    if (title.includes('java') || title.includes('python') || title.includes('programming') || title.includes('code') || desc.includes('oop')) {
      return 'Programming';
    }
    if (title.includes('science') || title.includes('tech') || title.includes('physics') || title.includes('chemistry') || title.includes('planet')) {
      return 'Science & Technology';
    }
    if (title.includes('general') || title.includes('gk') || title.includes('knowledge') || title.includes('history') || title.includes('geography')) {
      return 'General Knowledge';
    }
    return 'Pop Culture & Media';
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const quizCategory = getQuizCategory(quiz);
    const matchesCategory = categoryFilter === 'All' || quizCategory === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm font-medium">Loading quizzes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Available Quizzes</h1>
          <p className="text-slate-400 text-base">Select a quiz category and put your mind to the test!</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <FiSearch className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/25 transition-all text-sm"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2.5 mb-8 border-b border-slate-900 pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
              categoryFilter === cat
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-105'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl border border-slate-900 max-w-md mx-auto mt-10">
          <FiBookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">No Quizzes Found</h4>
          <p className="text-slate-500 text-sm mb-6">
            We couldn&apos;t find any quizzes matching your filter or search query. Try another one!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              handleCategoryChange('All');
            }}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group glass-card rounded-2xl border border-slate-900 hover:border-slate-800 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getDifficultyColor(quiz.questions)}`}>
                    {getDifficultyLabel(quiz.questions)}
                  </span>
                  <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-md">
                    {getQuizCategory(quiz)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {quiz.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {quiz.description}
                </p>
              </div>

              <div>
                <div className="grid grid-cols-2 border-t border-slate-900 pt-4 mb-6 text-slate-400 text-xs">
                  <div className="flex items-center gap-2">
                    <FiLayers className="w-4 h-4 text-slate-500" />
                    <span>{quiz.questions?.length || 0} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-slate-500" />
                    <span>{quiz.timeLimit} Minutes</span>
                  </div>
                </div>

                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full py-3 bg-indigo-600/10 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:border-indigo-600 text-indigo-400 group-hover:text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
                >
                  <FiPlay className="w-4 h-4" />
                  <span>Start Quiz</span>
                  <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizList;
