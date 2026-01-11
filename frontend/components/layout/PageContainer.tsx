/**
 * PageContainer Component
 *
 * Server Component providing consistent page layout with responsive padding and max-width.
 */

import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-white">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}
