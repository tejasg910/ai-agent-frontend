// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// public and protected route lists
const publicRoutes = ['/', '/login', '/signup']
const dashboardRoute = '/dashboard/candidates'

// build your refresh‐secret
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
)

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const refreshToken = req.cookies.get('refreshToken')?.value

  let isAuthenticated = false
  if (refreshToken) {
    try {
      // verify signature & expiration in-process
      const { payload } = await jwtVerify(refreshToken, refreshSecret)
      // we put userId in `sub` when signing
      if (payload.sub) {
        isAuthenticated = true
      }
    } catch (err) {
      // token missing/expired/invalid → not authenticated
      isAuthenticated = false
    }
  }

  // 1. Authenticated users should not see public pages
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(dashboardRoute, req.url))
  }

  // 2. Public pages always allowed
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // 3. Protected pages: unauthenticated → login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // 4. Authenticated + protected → allow
  return NextResponse.next()
}

export const config = {
  matcher: [
    // skip static files, images, favicon
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
}
