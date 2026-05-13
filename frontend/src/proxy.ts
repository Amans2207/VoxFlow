import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { updateSession } from './utils/supabase/supabase-middleware';

/**
 * NEURAL PROXY v16 (MODERN CONVENTION)
 * Handles authentication shielding and session persistence.
 */
export async function handleProxy(request: NextRequest) {
  // 1. Supabase Session Refresh
  const supabaseResponse = await updateSession(request);
  const { pathname } = request.nextUrl;

  // 2. Admin Shielding
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

export const proxyConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
