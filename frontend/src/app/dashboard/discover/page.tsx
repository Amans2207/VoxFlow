"use client";

import React from 'react';
import { Search, Home, Compass, Crown, User, Play, Clock, Heart, Plus, Sparkles, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';

export default function DiscoverScreen() {
  const { showToast } = useToast();
  const categories = [
    { title: 'Instagram Story', aspect: '9/16', items: [1, 2, 3, 4] },
    { title: 'YouTube Shorts', aspect: '9/16', items: [1, 2, 3, 4] },
    { title: 'Classic Video', aspect: '16/9', items: [1, 2, 3] },
  ];

  const handleTemplateSelect = (title: string) => {
    console.log(`[Discover] Selected template: ${title}`);
    soundEngine?.play("click");
    showToast(`Template Selected: ${title}`, "success");
  };

  const handleFavorite = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    console.log(`[Discover] Favorited: ${title}`);
    soundEngine?.play("success");
    showToast("Added to Viral Vault", "success");
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
       
       {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
          <div>
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
                Expl<span className="text-[#CCFF00]">ore</span>
             </h1>
             <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4 flex items-center gap-2">
                <Sparkles size={14} className="text-[#CCFF00]" /> Neural Template Database v4.2 PRO
             </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-4 bg-white/3 p-4 md:p-5 rounded-2xl border border-white/5 shadow-2xl">
             <Search size={20} className="text-[#404040]" />
             <input 
                type="text" 
                placeholder="SEARCH VIRAL NODES..." 
                className="bg-transparent border-none text-white text-[11px] font-black uppercase tracking-widest outline-none flex-1 md:w-48"
             />
          </div>
       </header>

       {/* Feed Content */}
       <div className="flex flex-col gap-12 lg:gap-20">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col gap-6 lg:gap-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-widest">{cat.title}</h3>
                  <button className="bg-transparent border-none text-[#CCFF00] text-[10px] font-black uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity">View Library</button>
               </div>
               
               {/* Horizontal Scroll Row */}
               <div className="flex gap-6 lg:gap-10 overflow-x-auto snap-x no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 pb-4">
                  {cat.items.map((item) => {
                    const templateTitle = `Neural Velocity ${cat.title} ${item}`;
                    return (
                      <div 
                        key={item} 
                        onClick={() => handleTemplateSelect(templateTitle)}
                        className={`flex-shrink-0 snap-center bg-[#0A0A0B] rounded-[48px] border border-white/5 relative overflow-hidden cursor-pointer group shadow-2xl transition-all duration-500 hover:border-white/10 ${cat.aspect === '9/16' ? 'w-[260px] md:w-[320px] aspect-[9/16]' : 'w-[400px] md:w-[500px] aspect-[16/9]'}`}
                      >
                         <img 
                           src={`https://picsum.photos/seed/${cat.title + item + "vxf"}/800/1200`} 
                           className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700" 
                           alt="Template"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                         
                         <div className="absolute bottom-8 left-8 right-8">
                            <p className="text-lg lg:text-xl font-black text-white uppercase tracking-tighter group-hover:text-[#CCFF00] transition-colors">{templateTitle}</p>
                            <div className="flex items-center gap-3 mt-3">
                               <Clock size={12} className="text-[#404040]" />
                               <span className="text-[10px] font-black text-[#404040] uppercase tracking-widest">12.4K DEPLOYED</span>
                            </div>
                         </div>

                         <div 
                           onClick={(e) => handleFavorite(e, templateTitle)}
                           className="absolute top-6 right-6 w-12 h-12 bg-black/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 text-white hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00] transition-all active:scale-90 shadow-2xl"
                         >
                            <Heart size={20} className="group-hover:fill-current transition-all" />
                         </div>
                      </div>
                    );
                  })}
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
