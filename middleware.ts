import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl

  // ログインページ、API認証、静的ファイル、画像などは除外
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') || // 画像、CSS、JSなどの静的ファイル
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
