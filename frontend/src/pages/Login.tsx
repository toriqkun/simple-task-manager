import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import api from '../services/api';
import { LayoutDashboard, CheckSquare, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 border-r border-slate-800">
        {/* Background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-600/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-purple-600/20 blur-3xl mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-24 h-full w-full">
          <div className="mb-8 flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400">
              <CheckSquare size={28} />
            </div>
            <span className="text-3xl font-extrabold text-white tracking-tight">Task Master</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Manage your daily <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              workflow elegantly.
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 mb-12 max-w-xl">
            Join thousands of professionals who organize their tasks, boost productivity, and get things done faster.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 text-slate-300">
                <LayoutDashboard size={20} />
              </div>
              <p className="text-slate-300 font-medium">Intuitive dashboard tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/50 text-slate-300">
                <Sparkles size={20} />
              </div>
              <p className="text-slate-300 font-medium">Seamless real-time synchronization</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden mb-10 flex items-center justify-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400">
              <CheckSquare size={24} />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">Task Master</span>
          </div>

          <div className="mb-10 lg:text-left text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Enter your credentials to access your account</p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-500 border border-red-500/20 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder-slate-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm placeholder-slate-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white font-medium hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 mt-8"
            >
              {loading ? (
                 <div className="flex items-center justify-center">
                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   Signing in...
                 </div>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
