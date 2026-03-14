import { useState, useRef, useEffect } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { useAuth } from '../context/authContext';
import api from '../services/api';
import { X, User, Mail } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, login } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name);
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  const handleBackdropClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node) && !loading) {
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.put(`/users/${user.id}`, { name });
      login(data.user); // Update context
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        <div className="absolute top-0 w-full h-24 bg-linear-to-r from-indigo-600 to-blue-600"></div>
        
        <div className="relative pt-10 px-6 pb-6 mt-4">
          <button 
            onClick={onClose}
            disabled={loading}
            className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 bg-linear-to-tr from-indigo-500/20 to-blue-500/20 flex flex-col items-center justify-center text-indigo-400 shadow-xl overflow-hidden">
              <span className="text-3xl font-bold uppercase">{user.name.charAt(0)}</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Your Profile</h3>
            <p className="text-sm text-slate-400">Manage your personal information</p>
          </div>

          {error && (
            <div className="mb-5 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="profile-name" className="block text-sm font-medium text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  disabled={loading || !!success}
                />
              </div>
            </div>

            <div className="space-y-1.5 opacity-70">
              <label htmlFor="profile-email" className="block text-sm font-medium text-slate-400">
                Email Address <span className="text-xs ml-1">(Read-only)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-300 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 mt-6">
              <button
                type="submit"
                disabled={loading || !!success || !name.trim() || name === user.name}
                className="w-full py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 cursor-pointer flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
