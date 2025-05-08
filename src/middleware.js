// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// static public routes
const publicRoutes = ['/', '/login', '/signup', '/assets/*', '/form/*']
const dashboardRoute = '/dashboard/candidates'

// build your refresh‐secret
const refreshSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret'
)

export async function middleware(req) {
  //   const { pathname } = req.nextUrl

  const cookies = req.cookies.getAll();
  console.log(cookies, "This is cookies")
    const refreshToken = req.cookies.get('refreshToken')?.value
  console.log(refreshToken, "This si refresh token")
    let isAuthenticated = false
    if (refreshToken) {
      try {
        const { payload } = await jwtVerify(refreshToken, refreshSecret)
        if (payload.sub) {
          isAuthenticated = true
        }
      } catch (err) {
        isAuthenticated = false
      }
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
