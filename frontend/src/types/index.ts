export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
}