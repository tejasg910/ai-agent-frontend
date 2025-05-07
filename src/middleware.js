// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define public and private routes
const publicRoutes = ['/', '/login', '/signup', '/assets/*', '/form/*'];
const dashboardRoute = '/dashboard/candidates';

// JWT secret
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Check if route is public
  const isFormRoute = pathname.startsWith('/form/');
  const isAssetRoute = pathname.startsWith('/assets/');
  const isPublicRoute = publicRoutes.includes(pathname) || isFormRoute || isAssetRoute;
  
  // Get tokens from multiple possible sources
  const refreshToken = req.cookies.get('refreshToken')?.value;
  
  // For client-side verification - a client script would handle this in practice
  // but we need server-side logic for middleware
  const tokenFromHeader = req.headers.get('x-refresh-token');
  const token = refreshToken || tokenFromHeader;
  
  let isAuthenticated = false;
  
  if (token) {
    try {
      // Verify token
      const { payload } = await jwtVerify(token, refreshSecret);
      if (payload.sub) {
        isAuthenticated = true;
      }
    } catch (err) {
      // Token verification failed - proceed as unauthenticated
      isAuthenticated = false;
    }
  }

  // Simple routing logic
  if (isAuthenticated && isPublicRoute) {
    // Redirect authenticated users from public pages to dashboard
    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  } else if (isPublicRoute) {
    // Allow access to public routes
    return NextResponse.next();
  } else if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Allow authenticated users to access protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files, images, favicon
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};