"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, ShieldAlert, Cpu, Activity, Zap, 
  Trash2, RotateCcw, Play, Pause, Search,
  Filter, CheckCircle2, AlertCircle, Loader2,
  X, ChevronRight, Maximize2, ShieldCheck, Clock
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminQueue() {
  const [logs, setLogs] = useState<string[]>([
    "[10:42:01] Neural Pipe: Initializing stream for JOB-8x92",
    "[10:42:05] Audio Engine: Syncing ElevenLabs Voice 'Aman'",
    "[10:42:10] Video Engine: Mapping transitions to timeline tracks 1-4",
    "[10:42:15] Neural Sync: Latency established at 42ms",
    "[10:42:20] Cloud GPU: Partitioning 8GB VRAM for H100 Node 02",
  ]);

  const [activeJobs, setActiveJobs] = useState([
    { id: 'JOB-8x92', user: 'aman@voxflow.ai', status: 'Processing', progress: 68, type: 'Dubbing', time: '02:45' },
    { id: 'JOB-2p14', user: 'sarah@creative.co', status: 'In Queue', progress: 0, type: 'Synthesis', time: '00:12' },
    { id: 'JOB-9l88', user: 'elena@vfx.io', status: 'Processing', progress: 42, type: 'Render', time: '05:20' },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    // Listen for real-time status updates
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
    const { io } = require('socket.io-client');
    const socket = io(API_BASE);

    socket.on('render_status', (data: any) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${data.message}`]);
      
      setActiveJobs(prev => {
        const existing = prev.find(j => j.id === data.job_id);
        if (existing) {
          return prev.map(j => j.id === data.job_id ? { ...j, status: data.status, progress: data.progress } : j);
        } else {
          return [...prev, { id: data.job_id, user: 'System', status: data.status, progress: data.progress, type: 'Task', time: 'LIVE' }];
        }
      });

      if (data.status === 'Completed' || data.status === 'Failed') {
        toast(data.message, { icon: data.status === 'Completed' ? '✅' : '❌' });
      }
    });

    return () => socket.disconnect();
  }, []);

  const handleKillJob = (id: string) => {
    if (confirm(`Emergency Terminate ${id}? This will purge the VRAM partition.`)) {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] EMERGENCY: TERMINATED ${id} BY MASTER ADMIN`]);
      setActiveJobs(prev => prev.filter(j => j.id !== id));
      toast.error(`TERMINATED: ${id} purged from Titan-X Pipe.`, {
        icon: '💀',
        style: { background: '#0A0A0B', color: '#ff4b4b', border: '1px solid rgba(255, 75, 75, 0.2)', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse shadow-[0_0_10px_#00e5ff]"></div>
              <span className="text-[10px] font-black text-[#00e5ff] uppercase tracking-[6px]">Titan-X Orchestration Monitor</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Production Queue</h2>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-8 py-4 bg-white/2 border border-white/5 rounded-[32px] flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Global Throughput</span>
                 <span className="text-[12px] font-black text-[#10b981]">14.2 GB/s</span>
              </div>
              <div className="w-10 h-10 bg-[#10b98111] rounded-2xl flex items-center justify-center text-[#10b981]">
                 <Activity size={20} />
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         {/* LEFT: JOB TABLE */}
         <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] overflow-hidden shadow-2xl">
               <div className="p-10 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Neural Pipes</span>
                     <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black text-[#00e5ff] uppercase">{activeJobs.length} RUNNING</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <button className="p-3 bg-white/2 border border-white/5 rounded-xl text-zinc-600 hover:text-white transition-all"><RotateCcw size={16} /></button>
                     <button className="p-3 bg-white/2 border border-white/5 rounded-xl text-zinc-600 hover:text-white transition-all"><Search size={16} /></button>
                  </div>
               </div>

               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-white/5">
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Identity</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Task Type</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Neural Progress</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest">Status</th>
                        <th className="p-8 text-[9px] font-black text-zinc-600 uppercase tracking-widest text-right">Emergency</th>
                     </tr>
                  </thead>
                  <tbody>
                     {activeJobs.map(job => (
                        <tr key={job.id} className="border-b border-white/2 hover:bg-white/[0.01] transition-colors group">
                           <td className="p-8">
                              <div className="flex flex-col gap-1">
                                 <span className="text-[11px] font-black text-white uppercase tracking-tight">{job.id}</span>
                                 <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">{job.user}</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                                 {job.type === 'Dubbing' ? <Zap size={14} /> : job.type === 'Synthesis' ? <Cpu size={14} /> : <Terminal size={14} />}
                                 <span className="text-[10px] font-black uppercase tracking-widest">{job.type}</span>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className="flex flex-col gap-2 w-32">
                                 <div className="flex justify-between items-center text-[8px] font-black uppercase">
                                    <span className="text-zinc-700">{job.progress}%</span>
                                    <span className="text-zinc-800">{job.time}</span>
                                 </div>
                                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                       className="h-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" 
                                       style={{ width: `${job.progress}%` }}
                                    ></div>
                                 </div>
                              </div>
                           </td>
                           <td className="p-8">
                              <div className={`flex items-center gap-2 ${job.status === 'Processing' ? 'text-[#00e5ff]' : 'text-zinc-600'}`}>
                                 {job.status === 'Processing' ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
                                 <span className="text-[9px] font-black uppercase tracking-widest">{job.status}</span>
                              </div>
                           </td>
                           <td className="p-8 text-right">
                              <button 
                                onClick={() => handleKillJob(job.id)}
                                className="h-10 px-5 bg-red-500/10 border border-red-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                              >
                                Terminate
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center text-zinc-700">
                     <span className="text-[10px] font-black uppercase tracking-widest">H100 Node Status</span>
                     <Cpu size={18} />
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Compute Partition</span>
                        <span className="text-2xl font-black text-white">42%</span>
                     </div>
                     <div className="h-2 bg-white/2 rounded-full overflow-hidden">
                        <div className="h-full bg-[#a855f7] w-[42%]"></div>
                     </div>
                  </div>
               </div>
               <div className="bg-[#0A0A0B] border border-white/5 rounded-[40px] p-8 flex flex-col gap-6">
                  <div className="flex justify-between items-center text-zinc-700">
                     <span className="text-[10px] font-black uppercase tracking-widest">Bandwidth Flow</span>
                     <Activity size={18} />
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Egress Stream</span>
                        <span className="text-2xl font-black text-white">1.2 GB/s</span>
                     </div>
                     <div className="h-2 bg-white/2 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10b981] w-[65%]"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: TERMINAL LOGS */}
         <div className="xl:col-span-4 flex flex-col gap-8 h-full">
            <div className="flex-1 bg-black border border-white/10 rounded-[48px] p-10 flex flex-col gap-8 shadow-3xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[#00e5ff03] opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                     <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                     </div>
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Titan-X Signal Stream</span>
                  </div>
                  <Maximize2 size={14} className="text-zinc-800" />
               </div>

               <div className="flex-1 font-mono text-[10px] text-zinc-500 overflow-y-auto no-scrollbar flex flex-col gap-3">
                  {logs.map((log, i) => (
                     <div key={i} className="flex gap-4 group/line">
                        <span className="text-zinc-800 select-none">{(i + 1).toString().padStart(2, '0')}</span>
                        <span className={`group-hover/line:text-[#00e5ff] transition-colors ${log.includes('EMERGENCY') ? 'text-red-500' : ''}`}>
                           {log}
                        </span>
                     </div>
                  ))}
                  <div ref={logEndRef} />
                  <div className="flex items-center gap-2 animate-pulse text-[#00e5ff]">
                     <ChevronRight size={14} />
                     <span className="w-2 h-4 bg-[#00e5ff]/50"></span>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[8px] font-black text-zinc-700 uppercase">Orchestration Integrity</span>
                     <span className="text-[8px] font-black text-[#10b981] uppercase">99.9%</span>
                  </div>
                  <div className="bg-[#10b98111] border border-[#10b98122] rounded-xl p-4 flex items-center gap-3">
                     <ShieldCheck size={14} className="text-[#10b981]" />
                     <span className="text-[9px] font-black text-[#10b981] uppercase">Neural Firewall Active</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
