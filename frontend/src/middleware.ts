import { handleProxy } from './proxy';
import type { NextRequest, MiddlewareConfig } from 'next/server';

/**
 * NEXT.JS BRIDGE
 * Redirecting standard middleware calls to the new Neural Proxy.
 */
export async function middleware(request: NextRequest) {
  return await handleProxy(request);
}

export const config: MiddlewareConfig = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
