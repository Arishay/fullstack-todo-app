'use client';

/**
 * TaskItem Component
 *
 * Displays individual task with actions (complete, edit, delete).
 */

import { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setIsLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-pink-100 p-4 hover:shadow-md transition-shadow ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={isLoading}
          className="mt-1 h-5 w-5 text-rose-600 rounded focus:ring-rose-500 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            disabled={isLoading || task.completed}
            className="text-rose-600 hover:text-rose-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-2"
            title="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>

          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors p-2"
            title="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
