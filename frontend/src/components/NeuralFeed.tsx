"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Activity, Globe, CheckCircle2 } from "lucide-react";

const EVENT_TEMPLATES = [
  { icon: Zap, text: "Titan-X Sync: {lang} Voice Vector Aligned", color: "text-blue-400" },
  { icon: Globe, text: "Global Broadcast: Video pushed to {platform}", color: "text-lime-400" },
  { icon: Activity, text: "Neural Load: Optimizing GPU for 4K export", color: "text-orange-400" },
  { icon: CheckCircle2, text: "Viral Kit: Metadata synced for {user}", color: "text-purple-400" },
];

const LANGS = ["Hindi", "Spanish", "German", "Japanese", "French"];
const PLATFORMS = ["YouTube", "Instagram", "TikTok"];
const USERS = ["@aman", "@creator1", "@voxflow_pro", "@studio_x"];

export default function NeuralFeed() {
  const [events, setEvents] = useState<{ id: string; text: string; icon: any; color: string }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
      const lang = LANGS[Math.floor(Math.random() * LANGS.length)];
      const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
      const user = USERS[Math.floor(Math.random() * USERS.length)];

      const text = template.text
        .replace("{lang}", lang)
        .replace("{platform}", platform)
        .replace("{user}", user);

      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        text,
        icon: template.icon,
        color: template.color,
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
        <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Neural Activity Feed</h4>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-start gap-3 p-3 bg-black/40 rounded-xl border border-white/5"
            >
              <event.icon className={`w-4 h-4 mt-0.5 ${event.color}`} />
              <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                {event.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {events.length === 0 && (
          <p className="text-[10px] text-white/30 text-center py-4 italic">Waiting for neural signals...</p>
        )}
      </div>
    </div>
  );
}
