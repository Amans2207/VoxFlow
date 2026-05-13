import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateSession } from './utils/supabase/supabase-middleware';

/**
 * TITAN-X UNIFIED MIDDLEWARE (PROD-READY)
 * Merged logic for Supabase Auth, NextAuth Identity, and Admin Shield.
 */
export async function middleware(request: NextRequest) {
  // 1. Supabase Session Management (Neural Bridge)
  // This ensures the user's Supabase session is refreshed on every request
  const supabaseResponse = await updateSession(request);
  const { pathname } = request.nextUrl;

  // 2. NextAuth Identity & Admin Protection
  // Protects the /dashboard/admin_vxf administrative vault
  if (pathname.startsWith('/dashboard/admin_vxf')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    const ADMIN_EMAIL = 'admin@voxflow.ai';
    
    if (!token || token.email !== ADMIN_EMAIL) {
      console.warn(`[Security] Unauthorized access attempt to ${pathname} by ${token?.email || 'Anonymous'}`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 3. Legacy Admin Route Protection (from proxy.ts)
  if (pathname.startsWith('/admin')) {
    const adminAuth = request.cookies.get('vxf_admin_auth')?.value;
    if (pathname !== '/admin_login' && adminAuth !== 'verified') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin_login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public assets (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
