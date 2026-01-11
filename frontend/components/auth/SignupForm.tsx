'use client';

/**
 * SignupForm Component
 *
 * Client Component for user registration with email and password.
 * Handles form validation, submission, and error display.
 */

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api-client';

interface SignupFormProps {
  onSuccess?: () => void;
}

interface SignupResponse {
  user_id: string;
  email: string;
  message: string;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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

    setIsLoading(true);

    try {
      const response = await post<SignupResponse>(
        '/api/auth/register',
        { email, password },
        false // No authentication required for registration
      );

      // Registration successful - redirect to login
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/login?registered=true');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
          placeholder="Minimum 8 characters"
          required
          minLength={8}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-rose-800 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white text-gray-800 placeholder:text-rose-300"
          placeholder="Re-enter password"
          required
          disabled={isLoading}
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
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>

      <div className="text-center text-sm text-rose-600">
        Already have an account?{' '}
        <a href="/login" className="text-rose-500 hover:text-rose-700 font-medium hover:underline transition-colors">
          Log in
        </a>
      </div>
    </form>
  );
}
