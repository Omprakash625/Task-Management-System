import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { Task, TasksResponse, CreateTaskInput, UpdateTaskInput } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';


export const useTasks = () => {
  // Tasks data
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination defaults
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  // Fetch tasks from backend
const fetchTasks = async (page = 1, status = '', search = '') => {
  try {
    setLoading(true);

    // Wait for user before fetching (optional if called from useEffect)
    if (!user) return;

    // Build query params
    const params: any = { page, limit: 10 };
    if (status) params.status = status;
    if (search) params.search = search;

    // Make API request
    const response = await apiClient.get('/tasks', { params });

    // Extract tasks and pagination safely
    const { tasks: fetchedTasks = [], pagination: fetchedPagination = { page: 1, limit: 10, total: 0, totalPages: 1 } } =
      response.data?.data || {};

    // Update state
    setTasks(fetchedTasks);
    setPagination(fetchedPagination);
  } catch (error: any) {
    toast.error('Failed to fetch tasks');
    console.error('Fetch tasks error:', error);
  } finally {
    setLoading(false);
  }
};


  // Create task
  const createTask = async (taskData: CreateTaskInput) => {
  try {
    const response = await apiClient.post('/tasks', taskData);
    toast.success('Task created successfully!');

    // After creating, fetch first page
    setPagination((prev) => ({ ...prev, page: 1 }));
    await fetchTasks(1, filters.status, filters.search);

    return response.data.data; // contains the created task
  } catch (error: any) {
    toast.error('Failed to create task');
    throw error;
  }
};


  // Update task
  const updateTask = async (id: string, taskData: UpdateTaskInput) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, taskData);
      toast.success('Task updated successfully!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.data.task;
    } catch (error: any) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      toast.success('Task deleted successfully!');
      await fetchTasks(pagination.page, filters.status, filters.search);
    } catch (error: any) {
      toast.error('Failed to delete task');
      throw error;
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (id: string) => {
    try {
      const response = await apiClient.post(`/tasks/${id}/toggle`);
      toast.success('Task status updated!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.data.task;
    } catch (error: any) {
      toast.error('Failed to toggle task status');
      throw error;
    }
  };

  // Pagination and filter setters
  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const setStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const setSearchFilter = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    tasks,
    loading,
    pagination,
    filters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setPage,
    setStatusFilter,
    setSearchFilter,
    refreshTasks: () => fetchTasks(pagination.page, filters.status, filters.search),
  };
};
