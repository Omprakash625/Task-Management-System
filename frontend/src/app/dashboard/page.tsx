'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTask';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Task, CreateTaskInput } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const {
    tasks,
    loading: tasksLoading,
    pagination,
    filters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setPage,
    setStatusFilter,
    setSearchFilter,
    refreshTasks,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchInput, setSearchInput] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      refreshTasks(); // fetch tasks after login
    }
  }, [user, authLoading, router]);

  // Handlers
  const handleCreateTask = async (taskData: CreateTaskInput) => {
    await createTask(taskData);
    setIsModalOpen(false);
  };

  const handleUpdateTask = async (taskData: CreateTaskInput) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchFilter('');
  };

  // Loading skeleton for auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // No user (should rarely happen)
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
            {filters.search && (
              <Button type="button" variant="secondary" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </form>

          <div className="flex gap-2 mt-2 md:mt-0">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              value={filters.status}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              + New Task
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        {tasksLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.status
                ? 'Try adjusting your filters'
                : 'Get started by creating your first task'}
            </p>
            {!filters.search && !filters.status && (
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Create Your First Task
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onToggleStatus={toggleTaskStatus}
                />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  );
}
