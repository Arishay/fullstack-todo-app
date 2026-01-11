'use client';

/**
 * TaskForm Component
 *
 * Client Component for creating and editing tasks.
 * Handles form validation, character counting, and submission.
 */

import { useState, FormEvent } from 'react';

interface TaskFormProps {
  initialData?: {
    title?: string;
    description?: string;
  };
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Create Task',
  isLoading: externalLoading = false
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;
  const titleLength = title.length;
  const descriptionLength = description.length;

  const validateForm = (): boolean => {
    if (title.trim().length === 0) {
      setError('Title is required');
      return false;
    }

    if (titleLength > 200) {
      setError('Title must be 200 characters or less');
      return false;
    }

    if (descriptionLength > 1000) {
      setError('Description must be 1000 characters or less');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setInternalLoading(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined
      });

      // Reset form on successful creation (only if not in edit mode)
      if (!initialData) {
        setTitle('');
        setDescription('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task title"
          required
          maxLength={200}
          disabled={isLoading}
        />
        <p className={`text-sm mt-1 ${titleLength > 180 ? 'text-red-600' : 'text-gray-500'}`}>
          {titleLength} / 200 characters
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          placeholder="Enter task description"
          rows={4}
          maxLength={1000}
          disabled={isLoading}
        />
        <p className={`text-sm mt-1 ${descriptionLength > 900 ? 'text-red-600' : 'text-gray-500'}`}>
          {descriptionLength} / 1000 characters
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
