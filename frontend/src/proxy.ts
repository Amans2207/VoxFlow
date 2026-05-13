import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/supabase-middleware';
import type { MiddlewareConfig } from 'next/server';

/**
 * NEURAL PROXY (Next.js 16.2.6 Standard)
 * Replaces middleware.ts logic with a unified named export.
 */
export async function proxy(request: NextRequest) {
  // Sync Supabase Auth state across the edge
  return await updateSession(request);
}

// STATIC CONFIG: Mandatory for Next.js 16 static parsing
export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match everything EXCEPT:
     * - Next-Auth API (/api/auth)
     * - Static assets and internal paths
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
