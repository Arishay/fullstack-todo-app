/**
 * Login Page
 *
 * Server Component that wraps the LoginForm Client Component.
 * Provides page layout and metadata.
 */

import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Log In - Todo App',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50/40 to-pink-100/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-rose-900">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-rose-600">
            Log in to access your tasks
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
