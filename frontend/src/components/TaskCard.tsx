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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays <= 1) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 2) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={`group relative bg-slate-900 border border-slate-800 rounded-xl p-4 sm:flex items-start transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-indigo-500/5 hover:border-slate-700
      ${task.completed ? 'opacity-70 bg-slate-900/50' : ''}
    `}>
      <div className="flex items-center absolute sm:relative top-4 right-4 sm:top-auto sm:right-auto sm:mr-3 text-slate-600 sm:text-slate-700 group-hover:text-slate-500 transition-colors pt-1">
        <GripVertical size={20} className="cursor-grab hidden sm:block" />
        
        <button 
          onClick={toggleComplete}
          disabled={loading}
          className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer ml-3 sm:ml-0
            ${task.completed 
              ? 'bg-indigo-500 border-indigo-500 text-white' 
              : 'border-slate-600 hover:border-indigo-400 bg-transparent text-transparent hover:text-indigo-400'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Check size={14} className={task.completed ? 'opacity-100' : 'opacity-0'} />
        </button>
      </div>

      <div className="flex-1 mt-1 sm:mt-0">
        <h4 className={`text-base font-medium mb-1 line-clamp-2 pr-12 sm:pr-0
          ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}
        `}>
          {task.title}
        </h4>
        
        {task.description && (
          <p className={`text-sm mb-3 line-clamp-3
            ${task.completed ? 'text-slate-600' : 'text-slate-400'}
          `}>
            {task.description}
          </p>
        )}

        <div className="flex items-center text-xs font-medium text-slate-500 space-x-3 mt-auto pt-2">
          <div className="flex items-center space-x-1.5">
            <Clock size={14} className="opacity-70" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-12 sm:right-4 sm:top-1/2 sm:-translate-y-1/2 flex items-center space-x-1 sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
        <button
          onClick={() => onEdit(task)}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
