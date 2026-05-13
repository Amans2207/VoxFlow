import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  // First, update the Supabase session
  const supabaseResponse = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    // Check for the 'vxf_admin_auth' cookie
    const adminAuth = request.cookies.get('vxf_admin_auth')?.value;
    
    // If we're not on the login page and not authenticated, redirect to admin login
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
