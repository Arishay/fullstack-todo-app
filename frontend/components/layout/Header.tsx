/**
 * Header Component
 *
 * Server Component for page header with app branding and logout functionality.
 */

import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/tasks" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-all">
            Todo App
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              href="/tasks"
              className="text-rose-700 hover:text-rose-900 font-medium transition-colors"
            >
              Tasks
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
