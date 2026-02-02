import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { Task, TasksResponse, CreateTaskInput, UpdateTaskInput } from '@/types';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const fetchTasks = async (page = 1, status = '', search = '') => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await apiClient.get<TasksResponse>('/tasks', { params });
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(pagination.page, filters.status, filters.search);
  }, [pagination.page, filters.status, filters.search]);

  const createTask = async (taskData: CreateTaskInput) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      toast.success('Task created successfully!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.task;
    } catch (error: any) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  const updateTask = async (id: string, taskData: UpdateTaskInput) => {
    try {
      const response = await apiClient.patch(`/tasks/${id}`, taskData);
      toast.success('Task updated successfully!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.task;
    } catch (error: any) {
      toast.error('Failed to update task');
      throw error;
    }
  };

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

  const toggleTaskStatus = async (id: string) => {
    try {
      const response = await apiClient.post(`/tasks/${id}/toggle`);
      toast.success('Task status updated!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.task;
    } catch (error: any) {
      toast.error('Failed to toggle task status');
      throw error;
    }
  };

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