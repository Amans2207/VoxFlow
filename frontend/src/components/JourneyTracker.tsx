"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import apiClient from '@/utils/apiClient';
import { useUserStore } from '@/store/useUserStore';

export const JourneyTracker = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const batchRef = useRef<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const event = {
      email: user.email,
      path: pathname,
      timestamp: new Date().toISOString(),
      type: 'route_change'
    };

    batchRef.current.push(event);

    // Send batch every 60 seconds if not empty
    const interval = setInterval(() => {
      if (batchRef.current.length > 0) {
        apiClient.post('/api/admin/analytics/track', {
          batch: batchRef.current,
          client: 'Starboy-Frontend'
        }).then(() => {
          batchRef.current = [];
        }).catch(() => {
          // Keep batch for next try
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [pathname, user]);

  return null;
};
