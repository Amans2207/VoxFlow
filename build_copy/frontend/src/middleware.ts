import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * TITAN-X PRODUCTION MIDDLEWARE
 * Protects administrative nodes and ensures identity-aware routing.
 */
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Define Protected Admin Path
  const isAdminPath = path.startsWith('/dashboard/admin_vxf');

  if (isAdminPath) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // STRICT ADMIN LOCK: Only allow specific email
    const ADMIN_EMAIL = 'admin@voxflow.ai';
    
    if (!token || token.email !== ADMIN_EMAIL) {
      console.warn(`[Security] Unauthorized access attempt to ${path} by ${token?.email || 'Anonymous'}`);
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs on relevant paths
export const config = {
  matcher: ['/dashboard/:path*'],
};
