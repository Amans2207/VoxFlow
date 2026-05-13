import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateSession } from './utils/supabase/supabase-middleware';

import type { MiddlewareConfig } from 'next/server';

/**
 * NEURAL PROXY v16 (MASTER MIDDLEWARE)
 * Unified entry point for Auth, Session, and Shielding.
 */
export async function proxy(request: NextRequest) {
  // 1. Supabase Session Persistence
  const supabaseResponse = await updateSession(request);
  const { pathname } = request.nextUrl;

  // 2. Administrative Shielding
  if (pathname.startsWith('/dashboard/admin_vxf')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token || token.email !== 'admin@voxflow.ai') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return supabaseResponse;
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
