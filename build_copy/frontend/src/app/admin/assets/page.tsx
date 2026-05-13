"use client";

import React, { useState } from "react";
import { 
  CloudUpload, Box, Music, Sparkles, Filter, 
  Trash2, Eye, ExternalLink, Database, Cpu,
  Layers, Palette, Music2, Type, Globe, Zap,
  Search, Plus, CheckCircle2, AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/utils/apiClient";

export default function AdminAssets() {
  const [activeCategory, setActiveCategory] = useState<'LUTs' | 'SFX' | 'Transitions' | 'Prompts'>('LUTs');
  const [isUploading, setIsUploading] = useState(false);

  const [assets, setAssets] = useState([
    { id: '1', name: 'Cyberpunk Neon', type: 'LUT', status: 'Global', date: '2026-05-12', uses: 1240 },
    { id: '2', name: 'Vintage 8mm', type: 'LUT', status: 'Global', date: '2026-05-11', uses: 850 },
    { id: '3', name: 'Deep Whoosh', type: 'SFX', status: 'Global', date: '2026-05-13', uses: 3200 },
    { id: '4', name: 'Cinematic Zoom', type: 'Transition', status: 'Pending', date: '2026-05-13', uses: 0 },
  ]);

  const handlePushAsset = async () => {
    setIsUploading(true);
    try {
      const payload = {
        name: "Neural Glow",
        type: activeCategory === 'LUTs' ? 'LUT' : 'Asset',
        category: activeCategory,
        url: "https://voxflow.in/assets/neural_glow.cube"
      };
      
      await apiClient.post('/api/admin/assets/deploy', payload);
      
      setIsUploading(false);
      toast.success("Asset Pushed: 'Neural Glow' is now live globally! ⚡", {
        style: { background: '#0A0A0B', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
    } catch (error) {
      setIsUploading(false);
      toast.error("Deployment Failed.");
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#a855f7] rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-[#a855f7] uppercase tracking-[6px]">System Resource Orchestrator</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Global Assets</h2>
        </div>

        <button 
          onClick={handlePushAsset}
          className="h-16 px-10 bg-white text-black rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all group overflow-hidden relative"
        >
           <div className="absolute inset-0 bg-[#a855f711] translate-y-full group-hover:translate-y-0 transition-transform"></div>
           <CloudUpload size={20} className="relative z-10" />
           <span className="text-[10px] font-black uppercase tracking-widest relative z-10">Push New Global Resource</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* LEFT: UPLOAD PORTAL */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-10 flex flex-col gap-8">
               <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Asset Provisioning</span>
                  <h3 className="text-xl font-black text-white uppercase italic">Neural Uploader</h3>
               </div>

               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                     <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Resource Name</label>
                     <input type="text" placeholder="e.g. STARBOY_LUT_V2" className="h-14 bg-white/2 border border-white/5 rounded-xl px-5 text-[10px] font-black text-white uppercase tracking-widest focus:border-[#a855f733] outline-none transition-all" />
                  </div>

                  <div className="flex flex-col gap-3">
                     <label className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Category</label>
                     <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'LUT', icon: <Palette size={14} />, label: 'LUT' },
                          { id: 'SFX', icon: <Music2 size={14} />, label: 'SFX' },
                          { id: 'FX', icon: <Sparkles size={14} />, label: 'TRANSITION' },
                          { id: 'AI', icon: <Zap size={14} />, label: 'AI PROMPT' },
                        ].map(cat => (
                           <button key={cat.id} className="h-14 bg-white/2 border border-white/5 rounded-xl flex items-center justify-center gap-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:border-[#a855f733] hover:text-white transition-all">
                              {cat.icon}
                              {cat.label}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="h-48 bg-white/2 border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-[#a855f733] transition-all relative overflow-hidden">
                     <div className="absolute inset-0 bg-[#a855f705] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <CloudUpload size={32} className="text-zinc-800 group-hover:text-[#a855f7] transition-all" />
                     <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors">Drop Payload Here</span>
                        <span className="text-[7px] font-bold text-zinc-800 uppercase">.cube, .wav, .mp4, .json</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-[#a855f711] to-transparent border border-[#a855f722] rounded-[40px] p-8 flex items-center gap-6">
               <div className="w-12 h-12 bg-[#a855f722] rounded-2xl flex items-center justify-center text-[#a855f7] animate-pulse">
                  <Database size={24} />
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Global Node Sync</span>
                  <p className="text-[8px] font-bold text-zinc-700 uppercase leading-relaxed">Assets pushed here populate all 14.2k active user Design Labs in &lt;500ms.</p>
               </div>
            </div>
         </div>

         {/* RIGHT: ASSET REPOSITORY */}
         <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] overflow-hidden">
               <div className="p-10 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-10">
                     {['All', 'LUTs', 'SFX', 'Transitions'].map(tab => (
                        <button key={tab} className="text-[10px] font-black uppercase tracking-[3px] text-zinc-700 hover:text-white transition-colors relative group">
                           {tab}
                           <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#a855f7] group-hover:w-full transition-all"></div>
                        </button>
                     ))}
                  </div>
                  <div className="flex items-center gap-4">
                     <Search size={16} className="text-zinc-800" />
                     <input type="text" placeholder="Search Repo..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-zinc-500 placeholder:text-zinc-800" />
                  </div>
               </div>

               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/5">
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Asset Detail</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Type</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Distribution</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Uses</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Master Control</th>
                     </tr>
                  </thead>
                  <tbody>
                     {assets.map(asset => (
                        <tr key={asset.id} className="border-b border-white/2 hover:bg-white/[0.01] transition-colors group">
                           <td className="p-8">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 bg-white/2 border border-white/5 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-[#a855f7] transition-all">
                                    {asset.type === 'LUT' ? <Layers size={20} /> : asset.type === 'SFX' ? <Music size={20} /> : <Zap size={20} />}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white uppercase tracking-tight">{asset.name}</span>
                                    <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest">UID-{asset.id.padStart(4, '0')}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="p-8">
                              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-3 py-1 bg-white/2 border border-white/5 rounded-full">{asset.type}</span>
                           </td>
                           <td className="p-8">
                              <div className={`flex items-center gap-2 ${asset.status === 'Global' ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                                 <Globe size={14} />
                                 <span className="text-[9px] font-black uppercase tracking-widest">{asset.status}</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <span className="text-[11px] font-black text-white">{asset.uses.toLocaleString('en-US')}</span>
                           </td>
                           <td className="p-8 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                 <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><Eye size={16} /></button>
                                 <button className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500 transition-all hover:text-white"><Trash2 size={16} /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
