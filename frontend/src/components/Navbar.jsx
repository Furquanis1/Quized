import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiBook, FiAward, FiHome, FiList, FiTrendingUp } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';

function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinkClass = (path) => {
    const active = isActive(path);
    return `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? 'text-white bg-indigo-500/10 border-b-2 border-indigo-500 rounded-b-none'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAdmin() ? '/admin' : '/'} className="flex items-center gap-2.5 group">
              <FaBrain className="w-7 h-7 text-indigo-500 group-hover:text-purple-400 transition-colors duration-300" />
              <span className="text-xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                QuizMaster
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1 lg:ml-10">
            <div className="flex items-center gap-3">
              {isAuthenticated() && (
                <>
                  {isAdmin() ? (
                    <>
                      <Link to="/admin" className={navLinkClass('/admin')}>
                        <FiHome className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/admin/quizzes" className={navLinkClass('/admin/quizzes')}>
                        <FiList className="w-4 h-4" />
                        Manage Quizzes
                      </Link>
                      <Link to="/admin/attempts" className={navLinkClass('/admin/attempts')}>
                        <FiBook className="w-4 h-4" />
                        Attempts
                      </Link>
                      <Link to="/admin/leaderboard" className={navLinkClass('/admin/leaderboard')}>
                        <FiTrendingUp className="w-4 h-4" />
                        Leaderboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/" className={navLinkClass('/')}>
                        <FiHome className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/quizzes" className={navLinkClass('/quizzes')}>
                        <FiBook className="w-4 h-4" />
                        Quizzes
                      </Link>
                      <Link to="/my-attempts" className={navLinkClass('/my-attempts')}>
                        <FiAward className="w-4 h-4" />
                        My Attempts
                      </Link>
                      <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                        <FiTrendingUp className="w-4 h-4" />
                        Leaderboard
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!isAuthenticated() ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white px-3 py-2 text-sm font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span>{user?.username}</span>
                    {isAdmin() && (
                      <span className="ml-1.5 px-2 py-0.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-md uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none transition-colors cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-slate-950/95 border-b border-slate-900`}>
        <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
          {isAuthenticated() && (
            <>
              {isAdmin() ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiHome className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/quizzes"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiList className="w-5 h-5" />
                    Manage Quizzes
                  </Link>
                  <Link
                    to="/admin/attempts"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiBook className="w-5 h-5" />
                    Attempts
                  </Link>
                  <Link
                    to="/admin/leaderboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiTrendingUp className="w-5 h-5" />
                    Leaderboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiHome className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/quizzes"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiBook className="w-5 h-5" />
                    Quizzes
                  </Link>
                  <Link
                    to="/my-attempts"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiAward className="w-5 h-5" />
                    My Attempts
                  </Link>
                  <Link
                    to="/leaderboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-900 px-3 py-2 rounded-lg text-base font-semibold"
                  >
                    <FiTrendingUp className="w-5 h-5" />
                    Leaderboard
                  </Link>
                </>
              )}
              
              <div className="pt-4 pb-2 border-t border-slate-900">
                <div className="flex items-center px-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center mr-3">
                    <FiUser className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white flex items-center">
                      {user?.username}
                      {isAdmin() && (
                        <span className="ml-2 px-2 py-0.5 text-[9px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-md uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white py-2.5 rounded-xl text-base font-bold transition-all duration-200 cursor-pointer"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </>
          )}

          {!isAuthenticated() && (
            <div className="pt-2 flex flex-col gap-2.5 px-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center border border-slate-800 text-slate-300 hover:text-white py-2.5 rounded-xl text-base font-semibold transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-base font-semibold transition-all duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
