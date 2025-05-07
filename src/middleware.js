// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// static public routes
const publicRoutes = ['/', '/login', '/signup', '/assets/*', '/form/*']
const dashboardRoute = '/dashboard/candidates'

// build your refresh-secret
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
)

export async function middleware(req) {
  const { pathname } = req.nextUrl
  
  // Check for token in cookie first
  const refreshToken = req.cookies.get('refreshToken')?.value
  
  // Alternative: check localStorage via client-side script if cookies fail
  
  let isAuthenticated = false
  
  if (refreshToken) {
    try {
      // Verify token
      const { payload } = await jwtVerify(refreshToken, refreshSecret)
      console.log('Token verified with payload:', JSON.stringify(payload))
      
      if (payload.sub) {
        isAuthenticated = true
      }
    } catch (err) {
      console.error('Token verification failed:', err.message)
      isAuthenticated = false
      
      // If token invalid, try to refresh via API call
      try {
        // Note: This approach has limitations in middleware
        // Consider using a client-side solution instead
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
        })
        
        if (response.ok) {
          isAuthenticated = true
        }
      } catch (refreshErr) {
        console.error('Token refresh failed:', refreshErr.message)
      }
    }
  } else {
    console.log('No refresh token found in cookies')
  }

  // make /form/* public
  const isFormRoute = pathname.startsWith('/form/')
  const isAssetRoute = pathname.startsWith('/assets/')

  // 1. Authenticated users should not see public pages
  if (isAuthenticated && (publicRoutes.includes(pathname) || isFormRoute || isAssetRoute)) {
    return NextResponse.redirect(new URL(dashboardRoute, req.url))
  }

  // 2. Public pages always allowed
  if (publicRoutes.includes(pathname) || isFormRoute || isAssetRoute) {
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