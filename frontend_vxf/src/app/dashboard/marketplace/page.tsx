"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Download, Zap, TrendingUp, Filter, Search, ChevronRight, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function Marketplace() {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [deployingId, setDeployingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('marketplace_templates').select('*');
      if (data && data.length > 0) setTemplates(data);
      else {
        setTemplates([
          { id: '1', title: 'Viral Hormozi Pack', creator: 'Aman Pro', price: 100, sales: 1240, rating: 4.9, preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80' },
          { id: '2', title: 'Cyber-Rush Node', creator: 'NeuralFX', price: 50, sales: 850, rating: 4.8, preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' },
          { id: '3', title: 'Executive Gold LUTs', creator: 'StudioFlux', price: 150, sales: 430, rating: 5.0, preview: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80' }
        ]);
      }
    };
    fetchTemplates();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    console.log(`[Marketplace] Searching for: ${e.target.value}`);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    console.log(`[Marketplace] Filter changed to: ${filter}`);
    soundEngine?.play("click");
  };

  const handleInjectAsset = (id: string, title: string) => {
    console.log(`[Marketplace] Injecting Asset: ${title} (ID: ${id})`);
    setDeployingId(id);
    soundEngine?.play("process");
    showToast(`Injecting ${title}...`, "info");

    setTimeout(() => {
      setDeployingId(null);
      console.log(`[Marketplace] Asset ${title} injected successfully.`);
      showToast(`${title} Ready in Studio`, "success");
      soundEngine?.play("success");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Market<span className="text-[#10b981]">place</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4">
                Neural Asset Exchange v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5 shadow-2xl">
             <Search size={20} className="text-[#404040]" />
             <input 
                type="text" 
                placeholder="SEARCH ASSETS..." 
                value={searchQuery}
                onChange={handleSearch}
                className="bg-transparent border-none text-white text-[11px] font-black uppercase tracking-widest outline-none flex-1 md:w-48"
             />
          </div>
       </header>

       {/* Filters - Snap Scrollable on Mobile */}
       <div className="flex gap-4 overflow-x-auto snap-x no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          {['Trending', 'New', 'Elite', 'Free'].map((f) => (
            <button 
                key={f} 
                onClick={() => handleFilterChange(f)}
                className={`h-12 lg:h-14 px-8 lg:px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer border transition-all snap-center whitespace-nowrap ${activeFilter === f ? 'bg-[#10b9811a] border-[#10b981] text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/2 border-white/5 text-[#404040] hover:text-white/60'}`}
            >
               {f}
            </button>
          ))}
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {templates.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).map((t) => (
            <div key={t.id} className="bg-[#0A0A0B] rounded-[48px] border border-white/5 overflow-hidden flex flex-col shadow-2xl group hover:border-white/10 transition-all">
               <div className="h-60 relative overflow-hidden">
                  <img src={t.preview} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 right-6 px-5 py-3 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 text-[#10b981] text-[11px] font-black shadow-2xl">
                     {t.price} CREDITS
                  </div>
               </div>
               <div className="p-8 lg:p-10 flex flex-col gap-6 lg:gap-8">
                  <div className="flex justify-between items-start">
                     <div>
                        <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter mb-2">{t.title}</h3>
                        <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest">Architect: {t.creator}</p>
                     </div>
                     <div className="flex items-center gap-2 text-[#f59e0b] text-sm font-black">
                        <Star size={14} fill="#f59e0b" /> {t.rating}
                     </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                     <div className="flex flex-col gap-1">
                        <p className="text-[9px] font-black text-[#262626] uppercase tracking-widest">Deployments</p>
                        <p className="text-sm font-black text-[#404040]">{t.sales.toLocaleString()} UNITS</p>
                     </div>
                     <button 
                        disabled={deployingId === t.id}
                        onClick={() => handleInjectAsset(t.id, t.title)}
                        className={`h-14 lg:h-16 px-8 lg:px-10 font-black rounded-2xl text-[10px] uppercase tracking-widest cursor-pointer shadow-2xl active:scale-95 transition-all border-none ${deployingId === t.id ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-white text-black'}`}
                     >
                        {deployingId === t.id ? (
                            <div className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" />
                                INJECTING
                            </div>
                        ) : "Inject Asset"}
                     </button>
                  </div>
               </div>
            </div>
          ))}
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
