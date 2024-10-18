"use client"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isNotProtected = path === '/auth'

  const isNotAdmin = path.startsWith('/');
  const token = request.cookies.get('token')?.value || '';
  const role = request.cookies.get('role')?.value || '';
  if (!isNotProtected && !token) {
    return NextResponse.redirect(new URL('/auth', request.nextUrl))
  }

  if (isNotAdmin && role == "admin") {
    return NextResponse.redirect(new URL('/fleet', request.nextUrl))
  }

}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/:path*'
  ]
}
