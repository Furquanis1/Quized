import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import { toast } from 'react-toastify';
import { FiUserPlus, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (username.trim().length < 3) {
      toast.error('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerApi({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Registration failed. Please try again.';
      toast.error(typeof message === 'string' ? message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 animate-fade-in">
      <div className="glass-card glass-card-hover p-8 md:p-10 rounded-2xl max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/35 animate-float">
            <FiUserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm">Join us and start challenging yourself today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiUser className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiShield className="w-5 h-5" />
              </span>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-98 disabled:opacity-50 cursor-pointer mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              <>
                <FiUserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
