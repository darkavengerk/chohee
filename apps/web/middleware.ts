import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_NAMES } from '@chohee/shared';

const PROTECTED_PATHS = ['/me', '/upload', '/library'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!isProtected) return NextResponse.next();
  const token = req.cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/me/:path*', '/upload/:path*', '/library/:path*'],
};
