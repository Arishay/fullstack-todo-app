'use client';

/**
 * TasksClient Component
 *
 * Main client component for managing tasks with full CRUD operations.
 */

import { useState, useEffect } from 'react';
import { get, post, put, patch, del } from '@/lib/api-client';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Task } from './TaskItem';

export default function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await get<{ tasks: Task[]; total: number; limit: number; offset: number }>('/api/tasks');
      setTasks(response.tasks);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (data: { title: string; description?: string }) => {
    try {
      const newTask = await post<Task>('/api/tasks', data);
      setTasks([newTask, ...tasks]);
      setShowModal(false);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (data: { title: string; description?: string }) => {
    if (!editingTask) return;

    try {
      const updatedTask = await put<Task>(`/api/tasks/${editingTask.id}`, data);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setShowModal(false);
      setEditingTask(null);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update task');
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedTask = await patch<Task>(`/api/tasks/${taskId}/complete?completed=${!task.completed}`);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await del(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleNewTaskClick = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-rose-900">My Tasks</h1>
        <button
          onClick={handleNewTaskClick}
          className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-5 py-2.5 rounded-lg hover:from-rose-500 hover:to-pink-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          + New Task
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => setError('')}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
      />

      {/* Modal for Create/Edit Task */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h2 className="text-2xl font-bold text-rose-900 mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm
              initialData={editingTask ? {
                title: editingTask.title,
                description: editingTask.description
              } : undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCloseModal}
              submitLabel={editingTask ? 'Update Task' : 'Create Task'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
