import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (!pathname.startsWith('/admin/cpanel')) {
    return NextResponse.next();
  }

  // No token
  if (!token) {
    return NextResponse.redirect(
      new URL('/admin', req.url)
    );
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // Example role protection
    if (
      payload.role !== 'ADMIN' &&
      payload.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.redirect(
        new URL('/unauthorized', req.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL('/admin', req.url)
    );
  }
}

export const config = {
  matcher: ['/admin/cpanel/:path*'],
};