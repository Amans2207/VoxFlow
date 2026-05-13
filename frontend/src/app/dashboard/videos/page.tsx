"use client";

import React, { useState, useEffect } from "react";
import { createClient } from '@/utils/supabase/client';
import { 
  Download, CheckSquare, Square, Trash2, Zap, 
  LayoutGrid, List, ChevronRight, Activity, Cpu, 
  Film, Filter, MoreHorizontal, Loader2 
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

const ALL_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
];

export default function MyVideos() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('All Productions');

  useEffect(() => {
    const fetchJobs = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setJobs(data.map(j => ({
          ...j,
          targetLangName: ALL_LANGUAGES.find(l => l.code === j.target_lang)?.name || "Universal"
        })));
      } else {
          // Mock for demo
          setJobs([
              { id: 'j1', filename: 'Viral_Edit_Final.mp4', status: 'Completed', targetLangName: 'English' },
              { id: 'j2', filename: 'Market_Update_ES.mp4', status: 'Processing', targetLangName: 'Spanish' }
          ]);
      }
    };
    fetchJobs();
  }, []);

  const toggleSelection = (id: string) => {
    console.log(`[Vault] Toggling selection for job: ${id}`);
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    soundEngine?.play("click");
  };

  const handleDownloadSelected = () => {
    console.log(`[Vault] Initializing batch download for ${selectedIds.length} artifacts...`);
    showToast(`Downloading ${selectedIds.length} Files`, "info");
    soundEngine?.play("processing");
  };

  const handleIndividualDownload = (id: string, name: string) => {
    console.log(`[Vault] Downloading artifact: ${name} (ID: ${id})`);
    showToast(`Downloading ${name}`, "info");
    soundEngine?.play("success");
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                My <span className="text-[#00f2ff]">Vault</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Film size={14} className="text-[#00f2ff]" /> Global Production Management v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
             {selectedIds.length > 0 && (
               <button 
                onClick={handleDownloadSelected}
                className="h-14 lg:h-16 px-8 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase tracking-[2px] border-none shadow-[0_20px_40px_rgba(0,242,255,0.2)] active:scale-95 transition-all"
               >
                  Download Selected ({selectedIds.length})
               </button>
             )}
             <div className="bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5 text-right flex-1 md:flex-none">
                <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">Storage Usage</p>
                <p className="text-lg font-black text-white uppercase tracking-tighter">1.2 GB / 50 GB</p>
             </div>
          </div>
       </header>

       {/* Production List */}
       <div className="flex flex-col gap-8 lg:gap-10">
          <div className="flex justify-between items-center px-2">
             <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x whitespace-nowrap">
                {['All Productions', 'Completed', 'Processing', 'Failed'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => { setActiveTab(tab); soundEngine?.play("click"); }}
                    className={`text-[10px] font-black uppercase tracking-widest cursor-pointer border-none bg-transparent transition-colors snap-center ${activeTab === tab ? 'text-white' : 'text-[#404040] hover:text-white/60'}`}
                  >
                    {tab}
                  </button>
                ))}
             </div>
             <div className="hidden md:block">
                <Filter size={18} className="text-[#404040] cursor-pointer hover:text-white transition-colors" />
             </div>
          </div>

          {jobs.length === 0 ? (
            <div className="h-[400px] bg-white/2 border-2 border-dashed border-white/5 rounded-[48px] flex flex-col items-center justify-center gap-6 p-8 text-center shadow-2xl">
               <div className="w-20 h-20 bg-white/3 rounded-3xl flex items-center justify-center border border-white/5">
                  <Zap size={40} className="text-[#404040]" />
               </div>
               <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px]">No neural artifacts found in your vault</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
               {jobs.map((job) => (
                 <div 
                   key={job.id} 
                   className={`p-6 lg:p-8 rounded-[32px] border transition-all flex flex-col md:flex-row items-start md:items-center gap-6 lg:gap-10 shadow-2xl ${selectedIds.includes(job.id) ? 'bg-[#00f2ff08] border-[#00f2ff33]' : 'bg-[#0A0A0B] border-white/5'}`}
                 >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                       <button 
                         onClick={() => toggleSelection(job.id)}
                         className={`bg-transparent border-none transition-colors cursor-pointer ${selectedIds.includes(job.id) ? 'text-[#00f2ff]' : 'text-[#262626] hover:text-white/40'}`}
                       >
                          {selectedIds.includes(job.id) ? <CheckSquare size={24} /> : <Square size={24} />}
                       </button>
                       
                       <div className="w-24 lg:w-32 aspect-video bg-black rounded-xl overflow-hidden border border-white/5 shrink-0 shadow-lg">
                          <img src={`https://picsum.photos/seed/${job.id + "vault"}/200/120`} className="w-full h-full object-cover opacity-50" alt="Preview" />
                       </div>

                       <div className="flex-1">
                          <h4 className="text-base lg:text-lg font-black text-white uppercase tracking-tighter leading-none mb-2">{job.filename}</h4>
                          <div className="flex items-center gap-3">
                             <span className="text-[9px] font-black text-[#00f2ff] uppercase tracking-widest">{job.targetLangName}</span>
                             <div className="w-1 h-1 bg-[#262626] rounded-full" />
                             <span className="text-[9px] font-black text-[#404040] uppercase tracking-widest">{job.status}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-none border-white/5 pt-4 md:pt-0">
                       <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${job.status === 'Completed' ? 'bg-[#10b9811a] text-[#10b981]' : 'bg-white/5 text-[#404040]'}`}>
                          {job.status === 'Processing' ? <Loader2 size={10} className="animate-spin inline mr-2" /> : null}
                          {job.status}
                       </div>
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleIndividualDownload(job.id, job.filename)}
                            className="w-12 h-12 lg:w-14 lg:h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-white hover:bg-white/10 active:scale-90 transition-all"
                          >
                             <Download size={18} />
                          </button>
                          <button className="w-12 h-12 lg:w-14 lg:h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-[#404040] hover:text-white transition-all">
                             <MoreHorizontal size={18} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
       </div>

       <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
