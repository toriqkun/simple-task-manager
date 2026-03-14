import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import type { Task } from '../types';
import { useAuth } from '../context/authContext';
import { Plus, ListTodo, Search } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/tasks/my-tasks');
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSuccess = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (task.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
                          
    if (!matchesSearch) return false;
    
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}</h1>
            <p className="text-slate-400">You have {tasks.filter(t => !t.completed).length} pending tasks to tackle.</p>
          </div>
          
          <div className="w-full md:w-64 bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-slate-400">Daily Progress</span>
              <span className="text-lg font-bold text-white">{progress}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="w-full sm:w-auto flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
            <div className="pl-4 text-slate-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-white px-3 py-2.5 w-full sm:w-64 placeholder:text-slate-600"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                    filter === f 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-md shadow-indigo-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <TaskModal 
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingTask(null);
            }}
            onSuccess={handleTaskSuccess}
            task={editingTask}
          />

          {loading && !isModalOpen && tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
              <p>Loading your tasks...</p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
                .map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdate={fetchTasks}
                    onEdit={openEditModal}
                  />
              ))}
            </div>
          ) : (
            !loading && (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-900/30 border border-slate-800/50 rounded-2xl border-dashed">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-500 mb-4">
                  <ListTodo size={32} />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">No tasks found</h3>
                <p className="text-slate-500text-center max-w-sm mb-6">
                  {searchQuery 
                    ? "We couldn't find any tasks matching your search." 
                    : filter !== 'all' 
                      ? `You don't have any ${filter} tasks right now.`
                      : "You're all caught up! Create a new task to get started."}
                </p>
                {!searchQuery && filter === 'all' && (
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
                  >
                    Create your first task
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
