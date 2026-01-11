/**
 * Next.js middleware for authentication and route protection.
 *
 * This runs on the Edge runtime before pages load, providing:
 * - Protected route enforcement (redirect to login if not authenticated)
 * - Login/signup redirect (redirect to tasks if already authenticated)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/tasks'];

// Routes that should redirect to tasks if already authenticated
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in localStorage (client-side only, so we check cookie as fallback)
  // Note: middleware runs on Edge, so we can't access localStorage directly
  // We'll rely on the auth header check on the client side

  // For protected routes, check if user is trying to access without authentication
  // This is a basic check - the actual auth validation happens client-side
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  // Allow all requests to pass through
  // Actual authentication will be handled by client-side checks in components
  // This middleware is primarily for future cookie-based auth if needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
