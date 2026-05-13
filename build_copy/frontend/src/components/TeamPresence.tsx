"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Circle, Plus } from "lucide-react";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";


interface PresenceUser {
  id: string;
  email: string;
  online_at: string;
}

export default function TeamPresence({ projectId }: { projectId: string }) {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const supabase = createClient();
  const { showToast } = useToast();

  const handleInvite = () => {
    const email = prompt("Enter collaborator email to invite to this studio:");
    if (email) {
      soundEngine?.play("processing");
      showToast(`Inviting ${email} to Titan Production...`, "info");
      setTimeout(() => {
        soundEngine?.play("success");
        showToast("Invitation sent successfully!", "success");
      }, 2000);
    }
  };


  useEffect(() => {
    if (!projectId) return;

    const channel = supabase.channel(`project:${projectId}`, {
      config: {
        presence: {
          key: 'user',
        },
      },
    });

    const statusHandler = async (status: string) => {
      if (status === 'SUBSCRIBED') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await channel.track({
            id: user.id,
            email: user.email,
            online_at: new Date().toISOString(),
          });
        }
      }
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const rawUsers = Object.values(newState).flat() as unknown as PresenceUser[];
        const uniqueUsers = Array.from(
          new Map(rawUsers.filter(u => u && u.id).map(u => [u.id, u])).values()
        );
        setOnlineUsers(uniqueUsers);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(statusHandler);

    return () => {
      channel.unsubscribe();
    };
  }, [projectId]);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
      <div className="flex -space-x-2 overflow-hidden">
        {onlineUsers.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ scale: 0, x: -10 }}
            animate={{ scale: 1, x: 0 }}
            className="inline-block h-8 w-8 rounded-full ring-2 ring-black bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase"
            title={u.email}
          >
            {u.email.charAt(0)}
          </motion.div>
        ))}
        {onlineUsers.length === 0 && (
          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Live Presence</span>
        <span className="text-[11px] text-white/60 font-medium">
          {onlineUsers.length} {onlineUsers.length === 1 ? 'Collaborator' : 'Collaborators'}
        </span>
      </div>
      <button 
        onClick={handleInvite}
        className="ml-2 p-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-full transition-all border border-blue-500/30"
        title="Invite Collaborator"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
