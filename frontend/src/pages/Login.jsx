import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { toast } from 'react-toastify';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi({ username: username.trim(), password });
      const token = response.data.token || response.data;

      login(token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || null;

      toast.success('Welcome back! Login successful.');

      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'Login failed. Please check your credentials.';
      toast.error(typeof message === 'string' ? message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="glass-card glass-card-hover p-8 md:p-10 rounded-2xl max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/35 animate-float">
            <FiLogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm">Sign in to your account to start playing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 disabled:opacity-50 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing In...
              </span>
            ) : (
              <>
                <FiLogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
