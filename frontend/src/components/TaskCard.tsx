'use client';

import React from 'react';
import { Task } from '@/types';
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const statusLabels = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };

  const statusOptions = ['pending', 'in-progress', 'completed'];

  const handleStatusToggle = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentIndex = statusOptions.indexOf(task.status);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    onToggleStatus(task.id, nextStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="text-xs text-gray-500 mb-4">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">Status</span>
        <button
          onClick={handleStatusToggle}
          onTouchEnd={handleStatusToggle}
          className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
          type="button"
        >
          <span className={`text-xs font-semibold ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant="primary"
          onClick={() => onToggleStatus(task.id)}
          className="text-sm"
        >
          {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => onEdit(task)}
          className="text-sm"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(task.id)}
          className="text-sm"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;