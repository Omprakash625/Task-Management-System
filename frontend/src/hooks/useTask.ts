import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { Task, TasksResponse, CreateTaskInput, UpdateTaskInput } from '@/types';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';


const API_BASE_URL = apiClient.defaults.baseURL || '';

export const useTasks = () => {
  const { token, user } = useAuth(); // Get token from auth context
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination defaults
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  // Create axios instance with auth token
  const getAxiosConfig = useCallback(() => {
    const config: any = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  }, [token]);

  // Fetch tasks from backend
  const fetchTasks = useCallback(async (page = 1, status = '', search = '') => {
    // Wait for token to be available
    if (!token || !user) {
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pagination.limit),
        ...(status && { status }),
        ...(search && { search }),
      });

      const response = await axios.get<any>(
        `${API_BASE_URL}/tasks?${params}`,
        getAxiosConfig()
      );

      const { tasks: fetchedTasks = [], pagination: fetchedPagination = { page: 1, limit: 10, total: 0, totalPages: 1 } } =
        response.data?.data || response.data || {};

      setTasks(fetchedTasks);
      setPagination(fetchedPagination);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [token, user, pagination.limit, getAxiosConfig]);

  useEffect(() => {
    if (user && token) {
      fetchTasks(pagination.page, filters.status, filters.search);
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, token, pagination.page, filters.status, filters.search]);

  // Create task
  const createTask = async (taskData: CreateTaskInput) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tasks`,
        taskData,
        getAxiosConfig()
      );
      toast.success('Task created successfully!');

      setPagination((prev) => ({ ...prev, page: 1 }));
      await fetchTasks(1, filters.status, filters.search);

      return response.data.data;
    } catch (error: any) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  // Update task
  const updateTask = async (id: string, taskData: UpdateTaskInput) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/tasks/${id}`,
        taskData,
        getAxiosConfig()
      );
      toast.success('Task updated successfully!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.data;
    } catch (error: any) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/tasks/${id}`,
        getAxiosConfig()
      );
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
      const response = await axios.post(
        `${API_BASE_URL}/tasks/${id}/toggle`,
        {},
        getAxiosConfig()
      );
      toast.success('Task status updated!');
      await fetchTasks(pagination.page, filters.status, filters.search);
      return response.data.data;
    } catch (error: any) {
      toast.error('Failed to toggle task status');
      throw error;
    }
  };

  // Pagination and filter setters
  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchTasks(page, filters.status, filters.search);
  };

  const setStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTasks(1, status, filters.search);
  };

  const setSearchFilter = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchTasks(1, filters.status, search);
  };

  const refreshTasks = useCallback(() => {
    fetchTasks(pagination.page, filters.status, filters.search);
  }, [fetchTasks, pagination.page, filters.status, filters.search]);

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
    refreshTasks,
  };
};
