"use client";

/**
 * LogoutButton Component
 *
 * Client Component for handling user logout with localStorage cleanup.
 */

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="text-rose-600 hover:text-rose-800 font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-rose-50"
    >
      Logout
    </button>
  );
}
