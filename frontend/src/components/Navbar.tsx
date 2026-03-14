import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { CheckSquare, LogOut, User, ChevronDown } from 'lucide-react';
import ProfileModal from './ProfileModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                  <CheckSquare size={18} />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                  Task Master
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                      <span className="text-xs font-bold uppercase">{user.name.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-300 hidden sm:block max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown size={14} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="px-4 py-3 border-b border-slate-800 mb-1">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center space-x-2 cursor-pointer transition-colors"
                      >
                        <User size={16} className="text-slate-400" />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center space-x-2 cursor-pointer transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-500/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </>
  );
}
