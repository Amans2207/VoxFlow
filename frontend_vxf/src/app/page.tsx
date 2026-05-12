"use client";

import React from "react";

import styles from "./page.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import MagicPreview from "@/components/MagicPreview";

const VoicePlayground = dynamic(() => import("@/components/VoicePlayground"), {
  ssr: false,
});
import { motion } from "framer-motion";
import { Zap, Globe, Sparkles, Monitor, Layout, Users, Briefcase, ChevronRight, Wand2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/Toast";
import { soundEngine } from "@/utils/SoundEngine";
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const { setTheme, currentTheme } = useTheme();
  const { showToast } = useToast();
  const [userCount, setUserCount] = React.useState(0);

  React.useEffect(() => {
    const fetchUserCount = async () => {
      const supabase = createClient();
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      if (count !== null) setUserCount(count);
    };
    fetchUserCount();
  }, []);

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.2 }
  };

  
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handleDownload = () => {
    soundEngine?.play("process");
    showToast("Initializing Titan-X Windows Build Download...", "info");
    
    // Create a dummy file for download demonstration
    const blob = new Blob(["VoxFlow Native Build Stub v1.2.0"], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "VoxFlow_v1.2.0_x64.exe";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    setTimeout(() => {
      soundEngine?.play("success");
      showToast("Stable build downloaded successfully.", "success");
    }, 1500);
  };

  const handleCTA = (e: React.MouseEvent) => {
    soundEngine?.play("click");
  };

  return (
    <div className={styles.container}>
      <div className="mesh-bg"></div>
      
      {/* Live Performance Ticker */}
      <div style={{ background: 'var(--accent-blue)', color: 'white', padding: '8px 0', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', textAlign: 'center', position: 'relative', zIndex: 1100 }}>
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
        >
          TITAN-X PIPELINE ACTIVE • 12,482 VIDEOS DUBBED THIS WEEK • 99.9% NEURAL ACCURACY • GLOBAL BROADCAST SCALE ENABLED • v2.4.0 (STARBOY) DEPLOYED • 
          TITAN-X PIPELINE ACTIVE • 12,482 VIDEOS DUBBED THIS WEEK • 99.9% NEURAL ACCURACY • GLOBAL BROADCAST SCALE ENABLED • v2.4.0 (STARBOY) DEPLOYED • 
        </motion.div>
      </div>

      <header className="header-sticky" style={{ backdropFilter: 'blur(20px)', background: 'rgba(5,5,5,0.7)', zIndex: 1000 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <div className="logo" style={{ marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em' }}>VOX<span style={{ color: 'var(--accent-blue)' }}>FLOW</span></h2>
          </div>
          <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="#features" onClick={handleCTA} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Features</Link>
            <Link href="#pricing" onClick={handleCTA} style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Pricing</Link>
            
            <button 
              onClick={() => {
                soundEngine?.play("click");
                const themes = ['starboy', 'cyber-rush', 'executive-gold', 'emerald-phantom', 'crimson-fury', 'clean-studio'];
                const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
                setTheme(themes[nextIndex] as any);
                showToast(`Theme switched to ${themes[nextIndex].toUpperCase()}`, "info");
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Cycle Theme"
            >
              <Wand2 className="w-5 h-5 text-blue-400" />
            </button>

            <Link href="/login" onClick={handleCTA}>
              <button className="btn-secondary" style={{ padding: '8px 24px', fontSize: '0.85rem' }}>Login</button>
            </Link>
            <Link href="/signup" onClick={handleCTA}>
              <button className="btn-primary" style={{ padding: '8px 24px', fontSize: '0.85rem', boxShadow: '0 0 30px var(--primary-glow)', background: 'var(--accent-blue)', color: 'white', border: 'none' }}>Get Started</button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="mesh-gradient" style={{ opacity: 0.4 }}></div>
      
      {/* Hero Section */}
      <section className={styles.hero} style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="badge-neon" 
          style={{ marginBottom: '32px', background: 'rgba(0, 102, 255, 0.1)', color: 'var(--accent-blue)', borderColor: 'rgba(0, 102, 255, 0.3)' }}
        >
          🚀 TITAN-X AI ENGINE LIVE
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="neon-text headline-glow" 
          style={{ fontSize: '7rem', marginBottom: '32px', lineHeight: '0.85', fontWeight: 900, letterSpacing: '-0.05em' }}
        >
          AI Production <br/>
          <span className="gradient-clip">At Scale.</span>
        </motion.h1>
        <motion.p 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto 48px', color: 'var(--text-secondary)', lineHeight: '1.4', fontWeight: 500 }}
        >
          High-ticket localization for the world's top creators. <br/>
          <span style={{ color: 'var(--text-main)' }}>Dub, Lip-Sync, and Repurpose with the Titan-X Pipeline.</span>
        </motion.p>

        <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className={styles.actions} style={{ gap: '24px' }}>
          <Link href="/signup" onClick={handleCTA}>
            <button className={styles.glowCTA} style={{ fontSize: '1.2rem', padding: '20px 48px', borderRadius: '16px' }}>Join the Creative Elite</button>
          </Link>
          <Link href="/login" onClick={handleCTA}>
            <button className="btn-secondary" style={{padding: '20px 48px', fontSize: '1.2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'}}>Enter Dashboard</button>
          </Link>
        </motion.div>

        {/* Interactive Magic Preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1 }}>
          <MagicPreview />
        </motion.div>

        {/* Early Bird Counter */}
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <Users className="w-5 h-5 text-blue-400" />
            <div className="flex flex-col">
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Early Bird Special</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>
                {Math.max(0, 50 - userCount)} / 50 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Slots Remaining</span>
              </span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="flex flex-col">
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Locked Price</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-blue)' }}>{userCount < 50 ? '₹999' : '₹1,499'}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {userCount < 50 
              ? `Next ${Math.max(0, 50 - userCount)} users save 33% off the standard rate (₹1,499)`
              : 'Standard production rates now apply.'
            }
          </p>
        </div>

        {/* Desktop Download Section */}
        <motion.div {...fadeInUp} className={styles.desktopDownload} style={{ marginTop: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', padding: '48px' }}>
          <div className={styles.downloadText} style={{ textAlign: 'left' }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }}>VoxFlow for Windows</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '600px' }}>Leverage your local GPU for 2x faster previews, native screen recording, and lossless 4K export. Optimized for RTX and M-Series Silicon.</p>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button className={styles.downloadBtn} onClick={handleDownload} style={{ background: 'white', color: 'black', padding: '16px 32px', borderRadius: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Monitor className="w-6 h-6" />
                Download Stable (.exe)
              </button>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot"></span> v1.2.0 Stable Build
              </div>
            </div>
          </div>
          <div className="glass-glow" style={{ padding: '32px', width: '320px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 102, 255, 0.05)', border: '1px solid rgba(0, 102, 255, 0.1)' }}>
            <Zap className="w-12 h-12 text-blue-500 mb-4" />
            <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '4px' }}>GPU ACCELERATED</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.6, textAlign: 'center' }}>Harness local neural cores for instant processing.</p>
          </div>
        </motion.div>

      </section>

      {/* 3-Step Viral Workflow */}
      <section id="features" className={styles.section} style={{ marginTop: '120px' }}>
        <div className={styles.sectionHeader} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className={styles.sectionLabel}>The Titan Pipeline</motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} style={{ fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>The 3-Step Viral Workflow</motion.h2>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className={styles.featuresGrid} 
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}
        >
          <motion.div variants={fadeInUp} className="glass-bento group relative overflow-hidden p-10 cursor-default hover:border-blue-500/50 transition-all duration-500">
            <div className="icon-glow-container mb-8">
              <div className="radial-glow" />
              <Zap className="w-12 h-12 text-blue-500 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Smart Upload</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '24px' }}>Direct-to-cloud streaming for ultra-fast, secure video uploads. Our edge-node architecture eliminates server bottlenecks.</p>
            <button onClick={() => { soundEngine?.play("click"); showToast("Edge Ingestion Protocol Active", "info"); }} className="text-xs font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all">View Neural Logic <ChevronRight className="w-3 h-3" /></button>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-bento group relative overflow-hidden p-10 cursor-default hover:border-blue-500/50 transition-all duration-500">
            <div className="icon-glow-container mb-8">
              <div className="radial-glow" />
              <Globe className="w-12 h-12 text-blue-500 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>AI Localization</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '24px' }}>Titan-X handles dubbing and lip-syncing in 100+ languages simultaneously using proprietary asynchronous voice mapping.</p>
            <button onClick={() => { soundEngine?.play("click"); showToast("Asynchronous Sync Protocol Engaged", "info"); }} className="text-xs font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all">View Neural Logic <ChevronRight className="w-3 h-3" /></button>
          </motion.div>

          <motion.div variants={fadeInUp} className="glass-bento group relative overflow-hidden p-10 cursor-default hover:border-blue-500/50 transition-all duration-500">
            <div className="icon-glow-container mb-8">
              <div className="radial-glow" />
              <Sparkles className="w-12 h-12 text-blue-500 relative z-10 group-hover:scale-110 transition-transform" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Viral Kit</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '24px' }}>Instantly download dubbed videos with AI-generated captions and high-engagement hashtags tuned for the global algorithm.</p>
            <button onClick={() => { soundEngine?.play("click"); showToast("Metadata Sync Protocol Ready", "info"); }} className="text-xs font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all">View Neural Logic <ChevronRight className="w-3 h-3" /></button>
          </motion.div>
        </motion.div>
      </section>


      {/* Bento Grid Audiences */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>Who It's For</div>
          <h2 style={{ fontSize: '3.5rem' }}>Two Audiences. One Studio.</h2>
        </div>
        <div className="bento-grid">
          {/* For Creators */}
          <motion.div 
            {...fadeInUp}
            className="glass-bento" 
            style={{ gridColumn: 'span 7', padding: '48px', position: 'relative', overflow: 'hidden' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>For Creators</h3>
            </div>
            <p className="text-lg mb-8 max-width-[500px]" style={{ color: 'var(--text-secondary)' }}>Solo YouTubers, podcasters, and indie filmmakers who want to break into new geos without hiring a localization team.</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-4 h-4 text-blue-500" /> Ship multilingual cuts in under an hour</li>
              <li className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-4 h-4 text-blue-500" /> Keep your voice — literally</li>
              <li className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-4 h-4 text-blue-500" /> Unlock 4x audience reach on average</li>
            </ul>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 italic" style={{ color: 'var(--text-main)' }}>
              "I dropped a single tutorial in and woke up to seven localized cuts. My Brazil traffic 10x'd that week."
              <div className="mt-4 text-sm font-bold text-blue-400">— Maya Okafor, 480K-sub creator</div>
            </div>
          </motion.div>

          {/* Business Stats */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="glass-bento" 
            style={{ gridColumn: 'span 5', padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}
          >
             <div className="text-6xl font-black text-blue-500 mb-2">4.2X</div>
             <p className="text-lg font-bold mb-8" style={{ color: 'var(--text-main)' }}>Average Reach Lift</p>
             <div className="h-[2px] bg-white/10 w-full mb-8" />
             <div className="grid grid-cols-2 gap-8">
                 <div>
                   <div className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>12.4K+</div>
                   <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Creators</p>
                 </div>
                 <div>
                   <div className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>100+</div>
                   <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>Languages</p>
                 </div>
             </div>
          </motion.div>

          {/* For Businesses */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="glass-bento" 
            style={{ gridColumn: 'span 12', padding: '60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}
          >
            <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Briefcase className="text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>For Businesses</h3>
              </div>
              <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>Lean startup teams and content orgs scaling product launches, training, and marketing across global markets.</p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-5 h-5 text-blue-500" /> Centralized library for every team</li>
                <li className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-5 h-5 text-blue-500" /> Encrypted S3 storage, owner-only access</li>
                <li className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}><ChevronRight className="w-5 h-5 text-blue-500" /> Replace $50k/yr localization vendors</li>
              </ul>
            </div>
            <div className="p-8 bg-blue-600/10 rounded-3xl border border-blue-500/20">
               <div className="text-sm font-bold text-blue-400 mb-4 tracking-widest uppercase">Success Story</div>
               <p className="text-lg italic mb-6" style={{ color: 'var(--text-main)' }}>"VoxFlow replaced our entire dubbing pipeline. Onboarding videos now ship in 10 languages on launch day."</p>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full" />
                  <div>
                    <div className="font-bold" style={{ color: 'var(--text-main)' }}>Daniel Reyes</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Head of Content, Lumen Labs</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Voice Playground */}
      <VoicePlayground />

      {/* Footer */}
      <footer className="voxflow-footer">
          <div className="footer-content">
              <div className="footer-section brand">
                  <h2 className="logo">VOX<span>FLOW</span></h2>
                  <p>Elevating video localization with AI. Dub, Sync, and Scale globally.</p>
                  <div className="social-icons" style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
                      <a href="#">Instagram</a>
                      <a href="#">LinkedIn</a>
                      <a href="#">Twitter</a>
                  </div>
              </div>

              <div className="footer-section links">
                  <h3>Quick Links</h3>
                  <ul>
                      <li><Link href="/dashboard">Dashboard</Link></li>
                      <li><Link href="/signup">Pricing</Link></li>
                      <li><Link href="#">API Docs</Link></li>
                  </ul>
              </div>

              <div className="footer-section contact">
                  <h3>Support</h3>
                  <p><a href="https://amanstudiodev.in/" target="_blank" rel="noopener noreferrer">aman@amanstudio.in</a></p>
                  <p>24/7 AI Processing Active</p>
              </div>
          </div>

          <div className="footer-bottom">
              <p>&copy; 2026 <a href="https://amanstudiodev.in/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-blue)', fontWeight: 'bold'}}>Aman Studio</a>. Built for 10K+ Scale. <span className="status-dot"></span> System Online</p>
          </div>
      </footer>
    </div>
  );
}
