"use client";

import React, { useState } from "react";
import { 
  Search, Grid, List, Filter, Download, Trash2, 
  Share2, Smartphone, Video, Music, Image as ImageIcon, 
  Plus, MoreVertical, CloudLightning, Star, Eye
} from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import { toast } from "react-hot-toast";

type AssetType = 'all' | 'video' | 'image' | 'audio' | 'stock';

export default function AssetVaultPage() {
  const { videoTracks } = useEditorStore();
  const [filter, setFilter] = useState<AssetType>('all');
  const [search, setSearch] = useState("");

  const categories = [
    { id: 'all', label: 'All Assets', icon: <Grid size={16} /> },
    { id: 'video', label: 'Videos', icon: <Video size={16} /> },
    { id: 'image', label: 'Images', icon: <ImageIcon size={16} /> },
    { id: 'audio', label: 'Audio', icon: <Music size={16} /> },
    { id: 'stock', label: 'Neural Stock', icon: <Star size={16} /> },
  ];

  const assets = [
    { id: '1', name: 'Raw_Vlog_01.mp4', type: 'video', size: '45.2 MB', date: '2h ago', thumbnail: true },
    { id: '2', name: 'Interview_Audio.wav', type: 'audio', size: '12.8 MB', date: '5h ago', thumbnail: false },
    { id: '3', name: 'Background_Motion.jpg', type: 'image', size: '2.4 MB', date: '1d ago', thumbnail: true },
    { id: '4', name: 'Neural_Cyberpunk_Stock.mp4', type: 'stock', size: '18.9 MB', date: '3d ago', thumbnail: true },
    { id: '5', name: 'iPhone_Clip_12.mov', type: 'video', size: '89.1 MB', date: 'Just now', isMobile: true },
  ];

  const filteredAssets = assets.filter(a => (filter === 'all' || a.type === filter) && a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full min-h-screen bg-[#000000] flex flex-col gap-10 p-2 overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-[#262626] uppercase tracking-[6px]">TITAN-X CLOUD STORAGE</p>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
               ASSET <span className="text-[#00e5ff]">VAULT</span>.
            </h1>
         </div>
         <div className="flex gap-4">
            <button className="h-14 px-8 bg-white/2 border border-white/5 rounded-2xl text-[10px] font-black uppercase text-white flex items-center gap-3 hover:bg-white/5 transition-all">
               <Download size={16} />
               Export All
            </button>
            <button onClick={() => toast.success("Opening Neural Ingest Manager...")} className="h-14 px-10 bg-[#00e5ff] text-black text-[10px] font-black uppercase rounded-2xl shadow-[0_0_20px_rgba(0,229,255,0.2)] flex items-center gap-3">
               <Plus size={16} />
               Upload Assets
            </button>
         </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-6">
         <div className="flex-1 bg-[#0A0A0B] border border-white/5 rounded-3xl flex items-center px-8 gap-4 group focus-within:border-[#00e5ff33] transition-all">
            <Search size={20} className="text-zinc-700 group-focus-within:text-[#00e5ff]" />
            <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search by filename, tag, or scene metadata..." 
               className="flex-1 h-16 bg-transparent border-none text-[12px] font-black uppercase tracking-widest text-white outline-none placeholder:text-zinc-600"
            />
         </div>
         <div className="bg-[#0A0A0B] p-2 rounded-3xl border border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
               <button 
                  key={cat.id} 
                  onClick={() => setFilter(cat.id as any)}
                  className={`h-12 px-8 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all whitespace-nowrap ${
                     filter === cat.id ? "bg-[#00e5ff] text-black shadow-lg" : "text-zinc-400 hover:text-white"
                  }`}
               >
                  {cat.icon}
                  {cat.label}
               </button>
            ))}
         </div>
      </div>

      {/* ASSET GRID */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-8 overflow-y-auto no-scrollbar pb-20 pr-2">
         
         {/* TitanX Mobile Sync Highlight */}
         <div className="md:col-span-2 xl:col-span-2 aspect-video bg-[#00e5ff05] border border-[#00e5ff22] rounded-[48px] p-10 flex flex-col justify-between group cursor-pointer hover:bg-[#00e5ff11] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00e5ff0a] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#00e5ff]">
                     <Smartphone size={24} />
                     <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Titan-X Bridge Linked</span>
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Mobile Auto-Sync</h4>
               </div>
               <CloudLightning className="text-[#00e5ff]" size={32} />
            </div>
            <div className="flex flex-col gap-2">
               <p className="text-[10px] font-medium text-zinc-500 uppercase leading-relaxed max-w-[250px]">
                  Clips from your iPhone are automatically ingested into the vault in 4K ProRes.
               </p>
               <span className="text-[9px] font-black text-[#00e5ff] uppercase tracking-widest">5 New Assets Found</span>
            </div>
         </div>

         {/* Asset Cards */}
         {filteredAssets.map(asset => (
            <div key={asset.id} className="group bg-[#0A0A0B] border border-white/5 rounded-[40px] p-6 flex flex-col gap-6 hover:border-white/10 transition-all shadow-xl">
               <div className="aspect-square bg-black border border-white/5 rounded-[32px] relative overflow-hidden flex items-center justify-center">
                  {asset.thumbnail ? (
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  ) : (
                     <div className="text-zinc-800">
                        {asset.type === 'audio' ? <Music size={48} /> : <Video size={48} />}
                     </div>
                  )}
                  {asset.isMobile && (
                     <div className="absolute top-4 left-4 px-3 py-1 bg-[#00e5ff] rounded-lg text-[7px] font-black text-black uppercase tracking-widest shadow-lg animate-bounce">NEW</div>
                  )}
                  {asset.isMobile && (
                     <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[7px] font-black text-white uppercase tracking-widest border border-white/10">MOBILE</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                     <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#00e5ff] hover:text-black transition-all"><Eye size={18} /></button>
                     <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-[#00e5ff] hover:text-black transition-all"><Share2 size={18} /></button>
                  </div>
               </div>
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                     <span className="text-[11px] font-black text-white uppercase truncate w-32 tracking-widest">{asset.name}</span>
                     <button className="text-zinc-800 hover:text-white transition-all"><MoreVertical size={16} /></button>
                  </div>
                  <div className="flex justify-between items-center text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">
                     <span>{asset.size}</span>
                     <span>{asset.date}</span>
                  </div>
               </div>
            </div>
         ))}

         {/* Empty State Mock */}
         <div className="aspect-square bg-white/2 border border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center gap-4 text-zinc-800 group hover:border-[#00e5ff33] transition-all cursor-pointer">
            <Plus size={32} className="group-hover:text-[#00e5ff] transition-all" />
            <span className="text-[9px] font-black uppercase tracking-widest">New Resource</span>
         </div>

      </div>
    </div>
  );
}
