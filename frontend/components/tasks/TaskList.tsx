'use client';

/**
 * TaskList Component
 *
 * Displays a list of tasks with filtering options.
 */

import { useState } from 'react';
import TaskItem, { Task } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
        <div className="flex space-x-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-rose-100 text-rose-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'active'
                ? 'bg-rose-100 text-rose-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active ({activeTasks})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-rose-100 text-rose-800'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed ({completedTasks})
          </button>
        </div>
      </div>

      {/* Task Items */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all'
              ? 'Get started by creating a new task.'
              : filter === 'active'
              ? 'No active tasks. Great job!'
              : 'No completed tasks yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
