"use client";

/**
 * TodoDemo Component
 *
 * Interactive demo of the Todo interface for the home page.
 * Allows users to see the app in action before signing up.
 * Features a soft pink theme with modern, cute aesthetics.
 */

import { useState, FormEvent } from 'react';
import Link from 'next/link';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoDemo() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Welcome to Advanced AI Todo! ✨", completed: false },
    { id: 2, title: "Add your first task below 📝", completed: false },
    { id: 3, title: "Sign up to save your tasks 💖", completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        title: newTask.trim(),
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Advanced AI Todo App 💫
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Intelligent task management powered by AI. Stay organized, stay productive.
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <Link
            href="/signup"
            className="px-6 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-all shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-rose-500 font-medium rounded-xl hover:bg-rose-50 transition-all shadow-md border-2 border-rose-200"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Todo Interface */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-100">
        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done? ✨"
              className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-pink-50/30"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-pink-300">
              <p className="text-lg">No tasks yet. Add one to get started! 🌸</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-4 bg-pink-50/50 rounded-xl hover:bg-pink-100/50 transition-all group border border-pink-100"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-pink-300 text-rose-500 focus:ring-2 focus:ring-rose-400 cursor-pointer"
                />
                <span
                  className={`flex-1 text-gray-700 ${
                    task.completed ? 'line-through text-pink-300' : ''
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Delete task"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t-2 border-pink-100 text-sm text-gray-600 text-center">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total • {' '}
          {tasks.filter(t => t.completed).length} completed
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          👆 This is a demo. <Link href="/signup" className="text-rose-500 hover:text-rose-600 hover:underline font-medium">Sign up</Link> to save your tasks and unlock AI features!
        </p>
      </div>
    </div>
  );
}
