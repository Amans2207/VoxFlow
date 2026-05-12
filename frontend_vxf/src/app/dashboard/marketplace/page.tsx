"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Download, Zap, TrendingUp, Filter, Search, ChevronRight, Loader2, X, Upload, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralProgressBar from "@/components/NeuralProgressBar";

export default function Marketplace() {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchTemplates = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('marketplace_templates').select('*');
      if (data && data.length > 0) setTemplates(data);
      else {
        setTemplates([
          { id: '1', title: 'Viral Hormozi Pack', creator: 'Aman Pro', price: 100, sales: 1240, rating: 4.9, preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80' },
          { id: '2', title: 'Cyber-Rush Node', creator: 'NeuralFX', price: 50, sales: 850, rating: 4.8, preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80' },
          { id: '3', title: 'Executive Gold LUTs', creator: 'StudioFlux', price: 150, sales: 430, rating: 5.0, preview: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80' },
          { id: '4', title: 'MrBeast Dynamics', creator: 'BeastMode', price: 200, sales: 2100, rating: 4.9, preview: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80' },
          { id: '5', title: 'Iman Gadzhi Aesthetic', creator: 'GadzhiFlow', price: 120, sales: 980, rating: 4.7, preview: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80' },
          { id: '6', title: 'Ali Abdaal Clarity', creator: 'DeepStudy', price: 80, sales: 1540, rating: 4.8, preview: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&q=80' },
          { id: '7', title: 'Logan Paul Energy', creator: 'ViralX', price: 250, sales: 3200, rating: 4.6, preview: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&q=80' },
          { id: '8', title: 'Vaynerchuk Raw', creator: 'DailyVee', price: 90, sales: 1100, rating: 4.9, preview: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80' },
          { id: '9', title: 'Tate War Room', creator: 'TopG', price: 500, sales: 500, rating: 4.5, preview: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80' },
          { id: '10', title: 'Lex Fridman Deep', creator: 'NeuralMind', price: 110, sales: 860, rating: 5.0, preview: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80' },
          { id: '11', title: 'Beast Philanthropy', creator: 'CharityAI', price: 0, sales: 5400, rating: 4.9, preview: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80' },
          { id: '12', title: 'MKBHD Tech Glow', creator: 'Studio7', price: 180, sales: 1200, rating: 5.0, preview: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80' }
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
    const template = templates.find(t => t.id === id);
    setSelectedTemplate(template);
    soundEngine?.play("click");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    showToast("Ingesting Primary Asset...", "info");
    soundEngine?.play("process");

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setUploadedUrl(data.url);
      showToast("Asset Ready for Injection", "success");
      soundEngine?.play("success");
    } catch (err) {
      showToast("Upload Failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const startSynthesis = async () => {
    if (!uploadedUrl || !selectedTemplate) return;

    setIsProcessing(true);
    setProgress(20);
    showToast("Activating Neural Style Transfer...", "info");
    soundEngine?.play("process");

    try {
      const res = await fetch(`${API_BASE}/api/marketplace/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          video_url: uploadedUrl,
          user_id: 'temp_user'
        })
      });
      
      if (!res.ok) throw new Error("Synthesis failed");

      // Mock polling for demo, in real it should use WebSocket
      let p = 20;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setResultUrl(`${API_BASE}/exports/render_sample.mp4`); // Example
          setIsProcessing(false);
          showToast("Viral Synthesis Complete!", "success");
          soundEngine?.play("success");
        }
      }, 300);

    } catch (err) {
      showToast("Synthesis Failed", "error");
      setIsProcessing(false);
    }
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
                        onClick={() => handleInjectAsset(t.id, t.title)}
                        className="h-14 lg:h-16 px-8 lg:px-10 font-black rounded-2xl text-[10px] uppercase tracking-widest cursor-pointer shadow-2xl active:scale-95 transition-all border-none bg-white text-black hover:bg-[#10b981] hover:text-white"
                     >
                        Inject Asset
                     </button>
                  </div>
               </div>
            </div>
          ))}
       </div>

       {/* Quick Edit Modal */}
       <AnimatePresence>
         {selectedTemplate && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
           >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-[#0A0A0B] border border-white/10 w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl relative"
             >
               <button 
                 onClick={() => { setSelectedTemplate(null); setUploadedUrl(null); setResultUrl(null); }}
                 className="absolute top-8 right-8 text-[#404040] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
               >
                 <X size={24} />
               </button>

               <div className="p-10 lg:p-14">
                  <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-4">
                     Quick Edit: <span className="text-[#10b981]">{selectedTemplate.title}</span>
                  </h2>
                  <p className="text-[11px] text-[#404040] font-bold uppercase tracking-[4px] mb-12">
                     Inject your primary media to apply this viral preset.
                  </p>

                  {!resultUrl ? (
                    <div className="flex flex-col gap-10">
                       <div 
                         onClick={() => !isUploading && !isProcessing && document.getElementById('market-upload')?.click()}
                         className="h-60 bg-white/2 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-[#10b98133] transition-all group"
                       >
                          {isUploading ? (
                             <Loader2 size={32} className="text-[#10b981] animate-spin" />
                          ) : uploadedUrl ? (
                             <CheckCircle2 size={32} className="text-[#10b981]" />
                          ) : (
                             <Upload size={32} className="text-[#404040] group-hover:text-white transition-colors" />
                          )}
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">
                             {isUploading ? "Ingesting..." : uploadedUrl ? "Media Ready" : "Upload Primary Video"}
                          </p>
                          <input id="market-upload" type="file" className="hidden" accept="video/*" onChange={handleFileUpload} />
                       </div>

                       {isProcessing && <NeuralProgressBar progress={progress} label="Applying Neural Styles..." color="#10b981" />}

                       <button 
                         disabled={!uploadedUrl || isProcessing}
                         onClick={startSynthesis}
                         className={`h-20 w-full rounded-3xl font-black text-[12px] uppercase tracking-[6px] transition-all border-none shadow-2xl ${!uploadedUrl || isProcessing ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-[#10b981] text-black cursor-pointer hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'}`}
                       >
                          {isProcessing ? "Synthesizing..." : "Inject Assets"}
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-10 items-center text-center">
                       <div className="w-24 h-24 bg-[#10b9811a] rounded-full flex items-center justify-center text-[#10b981] mb-2">
                          <Download size={40} />
                       </div>
                       <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Viral Clip Ready!</h3>
                       <p className="text-[11px] text-[#404040] font-bold uppercase tracking-widest -mt-6">Credits Deducted: {selectedTemplate.price}</p>
                       <a 
                         href={resultUrl} 
                         download 
                         className="h-20 w-full bg-white text-black rounded-3xl font-black text-[12px] uppercase tracking-[6px] flex items-center justify-center no-underline hover:shadow-2xl transition-all"
                       >
                          Download Your Viral Clip
                       </a>
                    </div>
                  )}
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

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
