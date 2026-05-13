"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, CheckCircle2, Layout, Smartphone, User, Lock, Trash2, Crown, Shield, Mail, Zap, Camera, Loader2 } from "lucide-react";
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/Toast';
import { soundEngine } from '@/utils/SoundEngine';
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { showToast } = useToast();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [userName, setUserName] = useState("Alex Rivera");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
           setBalance(profile.credit_balance || 0);
           setAvatarUrl(profile.avatar_url);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = () => {
    console.log(`[Settings] Saving profile updates for: ${userName}`);
    setIsSaving(true);
    soundEngine?.play("processing");
    setTimeout(() => {
      setIsSaving(false);
      showToast("Profile Updated Successfully", "success");
      soundEngine?.play("success");
    }, 1500);
  };

  const handleUpdateSecurity = () => {
    console.log("[Settings] Initializing neural passphrase update...");
    showToast("Updating Security Layers...", "info");
    soundEngine?.play("click");
  };

  const handleRefillCredits = () => {
    console.log("[Settings] Redirecting to Billing Hub for refill...");
    router.push('/dashboard/billing');
  };

  const handleTerminateAccount = () => {
    console.log("[Settings] CAUTION: Account termination triggered.");
    const confirm = window.confirm("Are you absolutely sure? This action is IRREVERSIBLE.");
    if (confirm) {
      console.log("[Settings] Account termination confirmed. Executing purge...");
      showToast("Purge Sequence Initiated", "error");
    }
  };

  return (
    <div className="flex flex-col gap-10 lg:gap-16 pb-24 lg:pb-20">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
        <div>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white m-0 leading-none">
              Studio <span className="text-[#f59e0b]">Settings</span>
           </h1>
           <p className="text-[10px] font-black text-[#404040] uppercase tracking-[4px] mt-4">
              Account & Security Control v4.2 PRO
           </p>
        </div>
        <div className="w-full md:w-auto flex items-center gap-4 bg-[#f59e0b1a] p-5 rounded-2xl border border-[#f59e0b33] shadow-xl">
           <Crown size={24} className="text-[#f59e0b]" />
           <div className="text-right flex-1 md:flex-none">
              <p className="text-[9px] font-black text-[#f59e0b] uppercase tracking-widest">Account Tier</p>
              <p className="text-lg font-black text-white uppercase tracking-tighter">Creator Pro</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        
        {/* Main Settings Column */}
        <div className="lg:col-span-2 flex flex-col gap-10 lg:gap-12">
           
           {/* Profile Card */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl relative">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="group w-32 h-32 rounded-[40px] bg-white/2 border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative shadow-2xl active:scale-95 transition-all"
                 >
                    {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <User size={48} className="text-[#404040]" />}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <Camera size={24} className="text-white" />
                    </div>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" />
                 <div className="text-center md:text-left">
                    <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter">{userName}</h2>
                    <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mt-2">Lead Creator | Joined Jan 2024</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Display Name</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="h-16 px-6 bg-white/2 border border-white/5 rounded-2xl text-white text-sm font-black tracking-tight outline-none focus:border-white/10 transition-colors" 
                    />
                 </div>
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">Studio Email</label>
                    <input 
                      type="email" 
                      defaultValue="alex@voxflow.studio" 
                      disabled 
                      className="h-16 px-6 bg-white/1 border border-white/2 rounded-2xl text-[#404040] text-sm font-black tracking-tight cursor-not-allowed" 
                    />
                 </div>
              </div>

              <button 
                disabled={isSaving}
                onClick={handleSaveProfile}
                className={`h-16 px-12 mt-10 w-full md:w-auto font-black rounded-2xl text-[11px] uppercase tracking-[4px] border-none shadow-2xl active:scale-95 transition-all ${isSaving ? 'bg-white/5 text-[#404040] cursor-not-allowed' : 'bg-white text-black cursor-pointer'}`}
              >
                 {isSaving ? <Loader2 className="animate-spin m-auto" size={20} /> : "Save Changes"}
              </button>
           </div>

           {/* Security Card */}
           <div className="p-8 lg:p-12 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
              <h3 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-4">
                 <Lock className="text-[#3b82f6]" size={24} /> Security & Passwords
              </h3>
              
              <div className="flex flex-col gap-8">
                 {[
                   { label: 'Current Passphrase', placeholder: '••••••••' },
                   { label: 'New Neural Passphrase', placeholder: 'Min 12 characters' },
                   { label: 'Confirm Passphrase', placeholder: 'Re-enter' }
                 ].map(f => (
                   <div key={f.label} className="flex flex-col gap-3">
                      <label className="text-[10px] font-black text-[#404040] uppercase tracking-widest pl-2">{f.label}</label>
                      <input 
                        type="password" 
                        placeholder={f.placeholder} 
                        className="h-16 px-6 bg-white/2 border border-white/5 rounded-2xl text-white text-sm font-black tracking-tight outline-none focus:border-white/10 transition-colors placeholder:text-white/5" 
                      />
                   </div>
                 ))}
                 <div className="flex flex-col md:flex-row gap-4 mt-6">
                    <button 
                      onClick={handleUpdateSecurity}
                      className="h-14 md:h-16 px-10 bg-[#3b82f6] text-white font-black rounded-2xl text-[10px] uppercase tracking-[2px] border-none shadow-xl active:scale-95 transition-all"
                    >
                      Update Security
                    </button>
                    <button className="h-14 md:h-16 px-10 bg-white/5 text-white font-black rounded-2xl text-[10px] uppercase tracking-[2px] border-none active:scale-95 transition-all">
                      Email Reset Link
                    </button>
                 </div>
              </div>
           </div>

           {/* Danger Zone */}
           <div className="p-8 lg:p-12 bg-[#ef444405] rounded-[48px] border border-[#ef44441a] shadow-2xl">
              <h3 className="text-xl lg:text-2xl font-black text-[#ef4444] uppercase tracking-tighter mb-6 flex items-center gap-4">
                 <Trash2 className="text-[#ef4444]" size={24} /> Danger Zone
              </h3>
              <p className="text-[11px] text-[#404040] font-bold uppercase tracking-widest leading-relaxed mb-10">
                 Deleting your account is permanent. All jobs, localized outputs, and credits will be purged from the neural core.
              </p>
              <button 
                onClick={handleTerminateAccount}
                className="h-16 px-12 bg-[#ef4444] text-white font-black rounded-2xl text-[10px] uppercase tracking-[4px] border-none shadow-2xl active:scale-95 transition-all w-full md:w-auto"
              >
                Terminate Account
              </button>
           </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="flex flex-col gap-8 lg:gap-10">
           
           <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                 <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest">Neural Usage</p>
                 <Zap className="text-[#10b981]" size={20} />
              </div>
              <p className="text-3xl font-black text-white mb-4 tracking-tighter">{balance.toFixed(1)} <span className="text-[10px] text-[#404040]">mins</span></p>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-8">
                 <div className="h-full bg-[#10b981] rounded-full" style={{ width: '75%' }} />
              </div>
              <button 
                onClick={handleRefillCredits}
                className="h-14 w-full bg-white/5 text-white font-black rounded-xl text-[10px] uppercase tracking-[2px] border-none active:scale-95 transition-all cursor-pointer"
              >
                Refill Credits
              </button>
           </div>

           <div className="p-8 lg:p-10 bg-[#0A0A0B] rounded-[48px] border border-white/5 shadow-2xl">
              <p className="text-[10px] font-black text-[#404040] uppercase tracking-widest mb-10">Account Snapshot</p>
              <div className="flex flex-col gap-6">
                 {[
                   { label: 'Plan', val: 'Creator Pro' },
                   { label: 'Renewal', val: 'Mar 14, 2026' },
                   { label: 'Auto-Bill', val: 'Active' }
                 ].map(item => (
                   <div key={item.label} className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-[#262626] uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs font-black text-white uppercase tracking-tighter">{item.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 lg:p-10 bg-gradient-to-br from-[#3b82f61a] to-transparent border border-[#3b82f633] rounded-[48px] shadow-2xl">
              <Mail className="text-[#3b82f6] mb-6" size={32} />
              <h4 className="text-xl lg:text-2xl font-black text-white uppercase tracking-tighter leading-none">Concierge<br/>Support</h4>
              <p className="text-[10px] text-[#404040] font-black uppercase tracking-widest mt-6 leading-relaxed">Our team responds within 4 hours, around the clock.</p>
              <a href="mailto:concierge@voxflow.studio" className="block mt-6 text-sm font-black text-[#3b82f6] no-underline tracking-tighter">concierge@voxflow.studio</a>
           </div>

        </div>
      </div>
    </div>
  );
}
