import { handleProxy, proxyConfig } from './proxy';
import type { NextRequest } from 'next/server';

/**
 * NEXT.JS BRIDGE
 * Redirecting standard middleware calls to the new Neural Proxy.
 */
export async function middleware(request: NextRequest) {
  return await handleProxy(request);
}

export const config = proxyConfig;
