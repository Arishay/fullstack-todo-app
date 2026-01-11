'use client';

/**
 * LoginForm Component
 *
 * Client Component for user authentication with email and password.
 * Handles form validation, submission, JWT storage, and error display.
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api-client';
import { setSession } from '@/lib/auth';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
  };
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await post<LoginResponse>(
        '/api/auth/login',
        { email, password },
        false // No authentication required for login
      );

      // Store JWT token and user data
      setSession(
        {
          access_token: response.access_token,
          token_type: response.token_type,
          expires_in: response.expires_in,
        },
        response.user
      );

      // Redirect to tasks page
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/tasks');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-pink-100">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-rose-800 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white text-gray-800 placeholder:text-rose-300"
          placeholder="you@example.com"
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-rose-800 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white text-gray-800 placeholder:text-rose-300"
          placeholder="Enter your password"
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2.5 px-4 rounded-lg hover:from-rose-500 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>

      <div className="text-center text-sm text-rose-600">
        Don't have an account?{' '}
        <a href="/signup" className="text-rose-500 hover:text-rose-700 font-medium hover:underline transition-colors">
          Sign up
        </a>
      </div>
    </form>
  );
}
