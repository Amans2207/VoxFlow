"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Clock, Download, ExternalLink, 
  Trash2, Search, Filter, Loader2, Video, 
  Zap, AlertCircle, Scissors 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function HistoryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showToast("Authentication Required", "error");
      return;
    }

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      showToast("Neural History Corrupted", "error");
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const filteredTasks = tasks.filter(task => 
    task.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.status && task.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header Pillar */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Neural <span className="text-[#CCFF00]">History</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <History className="text-[#CCFF00]" size={14} /> Titan-X Task Archive v4.2
             </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#404040]" size={16} />
                <input 
                  type="text" 
                  placeholder="SEARCH JOB ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 pl-12 pr-6 bg-white/2 border border-white/5 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest outline-none focus:border-[#CCFF0033] transition-all"
                />
             </div>
             <button className="h-12 w-12 bg-white/3 border border-white/5 rounded-2xl flex items-center justify-center text-[#404040] hover:text-white transition-all">
                <Filter size={18} />
             </button>
          </div>
       </header>

       {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
             <Loader2 size={48} className="animate-spin text-[#CCFF00]" />
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest">Retrieving Neural Logs...</p>
          </div>
       ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-8 border-2 border-dashed border-white/5 rounded-[48px]">
             <div className="w-20 h-20 bg-white/2 rounded-3xl flex items-center justify-center text-[#404040]">
                <AlertCircle size={40} />
             </div>
             <div className="text-center">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Neural Records Found</h3>
                <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mt-2">Start your first production to populate the archive.</p>
             </div>
          </div>
       ) : (
          <div className="grid grid-cols-1 gap-6">
             {filteredTasks.map((task) => (
               <motion.div 
                 key={task.id}
                 layout
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="group p-8 bg-[#0A0A0B] border border-white/5 rounded-[32px] hover:border-white/10 transition-all flex flex-col md:flex-row items-center justify-between gap-8"
               >
                  <div className="flex items-center gap-8 w-full md:w-auto">
                     <div className="w-16 h-16 bg-white/2 rounded-2xl flex items-center justify-center text-[#CCFF00] group-hover:scale-110 transition-transform">
                        <Video size={28} />
                     </div>
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">JOB-{task.id.slice(0, 8)}</span>
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${task.status === 'completed' ? 'bg-[#10b9811a] text-[#10b981]' : 'bg-[#CCFF001a] text-[#CCFF00]'}`}>
                              {task.status}
                           </span>
                        </div>
                        <p className="text-sm font-bold text-zinc-500">{new Date(task.created_at).toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-none border-white/5 pt-6 md:pt-0">
                     {task.output_url && (
                        <>
                           <button 
                             onClick={() => {
                               soundEngine?.play("click");
                               router.push(`/editor?videoUrl=${encodeURIComponent(task.output_url)}`);
                             }}
                             className="flex-1 md:flex-none h-14 px-8 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-600/20 transition-all"
                           >
                              <Scissors size={14} /> Edit
                           </button>
                           <a 
                             href={task.output_url} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex-1 md:flex-none h-14 px-8 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                           >
                              <Download size={14} /> Download
                           </a>
                        </>
                     )}
                     <button className="h-14 w-14 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-center text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <Trash2 size={18} />
                     </button>
                  </div>
               </motion.div>
             ))}
          </div>
       )}

       <div className="p-10 bg-[#CCFF000d] rounded-[48px] border border-[#CCFF001a] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black">
                <Zap size={24} fill="currentColor" />
             </div>
             <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Neural Insights Active</h3>
                <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest mt-1">Your task logs are encrypted and stored in the Titan-X Cloud.</p>
             </div>
          </div>
          <button 
            onClick={() => { soundEngine?.play("click"); fetchHistory(); }}
            className="h-14 px-10 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
          >
             Sync Neural Logs
          </button>
       </div>
    </div>
  );
}
