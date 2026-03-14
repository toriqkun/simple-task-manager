import { useState } from 'react';
import api from '../services/api';
import type { Task } from '../types';
import { Check, Clock, GripVertical, Trash2, Edit2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onEdit }: TaskCardProps) {
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);
    try {
      await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      onUpdate();
    } catch (error) {
      console.error('Failed to toggle completion', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete task', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(
      typeof dateString === "string" && !dateString.endsWith("Z")
        ? dateString + "Z"
        : dateString
    );
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const optionsTime: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
      hour12: true
    };
    
    const optionsDate: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'Asia/Jakarta' 
    };

    const now = new Date();
    
    const getJakartaZeroHour = (d: Date) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric', month: 'numeric', day: 'numeric'
      }).formatToParts(d);
      
      const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
      const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1;
      const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
      
      return new Date(year, month, day).getTime();
    };

    const targetMidnight = getJakartaZeroHour(date);
    const todayMidnight = getJakartaZeroHour(now);
    
    const diffTime = todayMidnight - targetMidnight;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    const timeString = date.toLocaleTimeString('en-US', optionsTime);

    if (diffDays === 0) {
      return `Today ${timeString}`;
    } else if (diffDays === 1) {
      return `Yesterday ${timeString}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      const dateString = date.toLocaleDateString('en-US', optionsDate);
      return `${dateString} ${timeString}`;
    }
  };

  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`group relative bg-slate-900 border border-slate-800 rounded-xl p-4 sm:flex items-center transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/5 hover:border-slate-700
      ${task.completed ? 'opacity-70 bg-slate-900/50' : ''}
    `}>
      <div className="flex items-center mb-3 sm:mb-0 sm:mr-4 text-slate-600 sm:text-slate-700 group-hover:text-slate-500 transition-colors">
        <GripVertical size={20} className="cursor-grab hidden sm:block mr-2" />
        
        <button 
          onClick={toggleComplete}
          disabled={loading}
          className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer mr-3 sm:mr-0
            ${task.completed 
              ? 'bg-indigo-500 border-indigo-500 text-white' 
              : 'border-slate-600 hover:border-indigo-400 bg-transparent text-transparent hover:text-indigo-400'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Check size={14} className={task.completed ? 'opacity-100' : 'opacity-0'} />
        </button>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className={`text-base font-medium mb-1 truncate pr-8
          ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}
        `}>
          {task.title}
        </h4>
        
        {task.description && (
          <p className={`text-sm mb-2 line-clamp-2 pr-8
            ${task.completed ? 'text-slate-600' : 'text-slate-400'}
          `}>
            {task.description}
          </p>
        )}

        <div className="flex items-center text-xs font-medium text-slate-500 space-x-3 mt-1">
          <div className="flex items-center space-x-1.5">
            <Clock size={14} className="opacity-70" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-1 right-3 sm:top-1/2 sm:-translate-y-1/2 sm:right-4">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            onBlur={() => setTimeout(() => setShowMenu(false), 200)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex flex-col space-y-[3px]">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-10 animate-in fade-in duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                  setShowMenu(false);
                }}
                disabled={loading}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                  setShowMenu(false);
                }}
                disabled={loading}
                className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
