import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import api from '../services/api';
import type { Task } from '../types';
import { X } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task | null; // null/undefined means mode Create, otherwise Edit
}

export default function TaskModal({ isOpen, onClose, onSuccess, task }: TaskModalProps) {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEditMode = !!task;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || ''
        });
      } else {
        setFormData({ title: '', description: '' });
      }
      setError('');
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        ...(isEditMode ? {} : { completed: false })
      };
      
      if (isEditMode) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} task`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={!loading ? onClose : undefined}
      ></div>
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-xl font-semibold text-white">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {error && (
            <div className="mb-5 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modal-title" className="block text-sm font-medium text-slate-300 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="modal-title"
                type="text"
                autoFocus
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="What needs to be done?"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="modal-description" className="block text-sm font-medium text-slate-300 mb-1.5">
                Description <span className="text-slate-500 text-xs">(optional)</span>
              </label>
              <textarea
                id="modal-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors min-h-[120px] resize-y"
                placeholder="Add any extra details..."
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim()}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20 cursor-pointer flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
