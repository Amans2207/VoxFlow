"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import MaintenanceOverlay from './MaintenanceOverlay';
import { usePathname } from 'next/navigation';

export default function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Admin routes should never be blocked by maintenance mode
    if (pathname?.startsWith('/admin')) {
        setIsMaintenance(false);
        return;
    }

    const checkStatus = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('system_settings').select('maintenance_mode').single();
      if (data?.maintenance_mode) {
        setIsMaintenance(true);
      } else {
        setIsMaintenance(false);
      }
    };

    checkStatus();

    // Optional: Real-time subscription to maintenance mode
    const supabase = createClient();
    const channel = supabase
      .channel('system_settings_maintenance')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'system_settings' }, payload => {
        if (!pathname?.startsWith('/admin')) {
            setIsMaintenance(payload.new.maintenance_mode);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname]);

  if (isMaintenance) {
    return <MaintenanceOverlay />;
  }

  return <>{children}</>;
}
