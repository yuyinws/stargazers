import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const allCookies = request.cookies.getAll()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/gh/stars',
}
