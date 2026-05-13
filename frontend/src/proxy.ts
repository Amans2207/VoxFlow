import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateSession } from './utils/supabase/supabase-middleware';

import type { MiddlewareConfig } from 'next/server';

/**
 * NEURAL PROXY v16 (MASTER MIDDLEWARE)
 * Unified entry point for Auth, Session, and Shielding.
 * Synchronized for Next.js 16.2.6 Turbopack.
 */
export async function proxy(request: NextRequest) {
  // 1. Supabase Session Persistence (Always runs first)
  const supabaseResponse = await updateSession(request);
  const { pathname } = request.nextUrl;

  // 2. Next-Auth Guard (Dashboard Shielding)
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    // 3. Admin Shielding
    if (pathname.startsWith('/dashboard/admin_vxf')) {
      if (!token || token.email !== 'admin@voxflow.ai') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

    // 4. Standard Dashboard Access
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse;
}

// STATIC CONFIG: Mandatory for Next.js 16.2.6
export const config: MiddlewareConfig = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
