/**
 * Signup Page
 *
 * Server Component that wraps the SignupForm Client Component.
 * Provides page layout and metadata.
 */

import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Sign Up - Todo App',
  description: 'Create a new account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50/40 to-pink-100/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-rose-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-rose-600">
            Sign up to start managing your tasks
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
