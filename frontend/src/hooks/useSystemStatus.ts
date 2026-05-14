'use client';

/**
 * useSystemStatus — THE HEARTBEAT HOOK
 * ======================================
 * Single source of truth for system readiness.
 * Checks three things on mount and every N seconds:
 *   1. Is the backend reachable? (Heartbeat)
 *   2. Is the user session valid? (NextAuth + Zustand sync)
 *   3. Does the user have enough credits? (Balance > 0)
 *
 * Exposes:
 *   - engineStatus: 'online' | 'offline' | 'connecting'
 *   - isAuthenticated: boolean
 *   - hasFuel: boolean (credits > 0)
 *   - isReady: all three are green
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'react-hot-toast';

type EngineStatus = 'connecting' | 'online' | 'offline';

interface SystemStatus {
  engineStatus: EngineStatus;
  isAuthenticated: boolean;
  hasFuel: boolean;
  isReady: boolean;
  creditBalance: number;
  refresh: () => void;
}

const HEARTBEAT_INTERVAL_MS = 15_000; // 15 seconds
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export function useSystemStatus(): SystemStatus {
  const { data: session, status: sessionStatus } = useSession();
  const { user, setUser, fetchUserCredits } = useUserStore();

  const [engineStatus, setEngineStatus] = useState<EngineStatus>('connecting');

  // ── Heartbeat Check ──────────────────────────────────────────────────────
  const checkHeartbeat = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const res = await fetch(`${API_BASE}/api/health`, {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        if (engineStatus !== 'online') {
          setEngineStatus('online');
          // Only toast recovery if we were previously offline
          if (engineStatus === 'offline') {
            toast.success('Neural Core: ONLINE', { id: 'engine-status' });
          }
        }
      } else {
        setEngineStatus('offline');
      }
    } catch {
      setEngineStatus('offline');
      if (engineStatus === 'online') {
        toast.error('Neural Core: CONNECTION LOST', { id: 'engine-status' });
      }
    }
  }, [engineStatus]);

  // ── Session → Store Sync ──────────────────────────────────────────────────
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.email && !user) {
      setUser({
        email: session.user.email,
        name: session.user.name || 'Neural User',
        credits: 0,
        role: 'STANDARD',
      });
      fetchUserCredits(session.user.email);
    }
  }, [session, sessionStatus, user, setUser, fetchUserCredits]);

  // ── Heartbeat Loop ────────────────────────────────────────────────────────
  useEffect(() => {
    checkHeartbeat(); // Run immediately on mount
    const interval = setInterval(checkHeartbeat, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkHeartbeat]);

  // ── Derived State ─────────────────────────────────────────────────────────
  const isAuthenticated =
    sessionStatus === 'authenticated' && !!session?.user?.email;
  const creditBalance = user?.credits ?? 0;
  const hasFuel = creditBalance > 0;
  const isReady = engineStatus === 'online' && isAuthenticated && hasFuel;

  return {
    engineStatus,
    isAuthenticated,
    hasFuel,
    isReady,
    creditBalance,
    refresh: checkHeartbeat,
  };
}
