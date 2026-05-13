"use client";

import React, { useState } from 'react';
import { 
  Sparkles, Zap, Layers, Layout, Palette, Code, 
  Terminal, Cpu, Box, BoxSelect, Workflow, Plus,
  Settings2, Activity, Globe, Rocket, ChevronRight
} from 'lucide-react';

export default function Blueprints() {
  const [selectedBlueprint, setSelectedBlueprint] = useState('b1');

  const blueprints = [
    {
      id: 'b1',
      name: 'Neural Hormozi v2',
      category: 'Viral Logic',
      description: 'Dynamic caption orchestration with attention-tracking beat sync. Optimized for retention.',
      complexity: 'Advanced',
      usage: '12.4K',
      accent: '#CCFF00',
      specs: ['Auto-Captioning', 'Face-Centric Zoom', 'Sound FX Overlay']
    },
    {
      id: 'b2',
      name: 'Clean Executive',
      category: 'Corporate',
      description: 'Minimalist gold-accented transitions and professional lower-thirds. High-end aesthetic.',
      complexity: 'Standard',
      usage: '8.2K',
      accent: '#D4AF37',
      specs: ['Lut Filter: Gold', 'Text Presets: Outfit', 'Smooth Pans']
    },
    {
      id: 'b3',
      name: 'Cyber-Rush 2077',
      category: 'Gaming/Action',
      description: 'Aggressive glitch logic with neural-sync shakes and high-velocity color shifting.',
      complexity: 'Expert',
      usage: '5.1K',
      accent: '#00f2ff',
      specs: ['Glitch FX V3', 'RGB Split', 'Fast-Cut Engine']
    }
  ];

  const activeB = blueprints.find(b => b.id === selectedBlueprint) || blueprints[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '100px' }}>
       {/* Header */}
       <header style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '32px' }}>
          <div>
             <h1 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-3px', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
                System <span style={{ color: '#CCFF00' }}>Blueprints</span>
             </h1>
             <p style={{ fontSize: '10px', fontWeight: 900, color: '#404040', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Workflow color="#CCFF00" size={14} /> Orchestration Protocol Active v4.2 PRO
             </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
             <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#404040', textTransform: 'uppercase', letterSpacing: '2px' }}>Active Nodes</p>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>124</p>
             </div>
             <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
                <p style={{ fontSize: '9px', fontWeight: 900, color: '#404040', textTransform: 'uppercase', letterSpacing: '2px' }}>Global Sync</p>
                <p style={{ fontSize: '18px', fontWeight: 900, color: '#CCFF00' }}>99.8%</p>
             </div>
          </div>
       </header>

       <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '48px' }}>
          {/* Sidebar Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {blueprints.map(b => (
               <button 
                 key={b.id}
                 onClick={() => setSelectedBlueprint(b.id)}
                 style={{ 
                   padding: '24px', 
                   backgroundColor: selectedBlueprint === b.id ? 'rgba(255,255,255,0.05)' : '#0A0A0B',
                   border: selectedBlueprint === b.id ? `1px solid ${b.accent}` : '1px solid rgba(255,255,255,0.05)',
                   borderRadius: '32px',
                   cursor: 'pointer',
                   textAlign: 'left',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '16px'
                 }}
               >
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedBlueprint === b.id ? b.accent : '#404040' }}>
                     <Workflow size={20} />
                  </div>
                  <div>
                     <p style={{ fontSize: '12px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>{b.name}</p>
                     <p style={{ fontSize: '9px', fontWeight: 900, color: '#404040', textTransform: 'uppercase' }}>{b.category}</p>
                  </div>
               </button>
             ))}
             <button style={{ padding: '32px', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <Plus size={24} color="#404040" />
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#404040', textTransform: 'uppercase' }}>New Architecture</span>
             </button>
          </div>

          {/* Technical Detail */}
          <div style={{ padding: '64px', backgroundColor: '#0A0A0B', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: `linear-gradient(to bottom left, ${activeB.accent}05, transparent)`, filter: 'blur(100px)' }} />
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#000', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeB.accent, border: '1px solid rgba(255,255,255,0.05)' }}>
                   <Cpu size={40} />
                </div>
                <div>
                   <h2 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px' }}>{activeB.name}</h2>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <div style={{ width: '8px', height: '8px', backgroundColor: activeB.accent, borderRadius: '50%' }} />
                      <span style={{ fontSize: '10px', fontWeight: 900, color: activeB.accent, textTransform: 'uppercase' }}>{activeB.complexity} ARCHITECTURE</span>
                   </div>
                </div>
             </div>

             <p style={{ fontSize: '20px', fontWeight: 500, color: '#404040', lineHeight: '1.6', marginBottom: '48px', maxWidth: '700px' }}>
                {activeB.description}
             </p>

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '64px' }}>
                {activeB.specs.map(spec => (
                  <div key={spec} style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                     <Settings2 size={18} color="#404040" />
                     <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>{spec}</span>
                  </div>
                ))}
             </div>

             <div style={{ display: 'flex', gap: '24px' }}>
                <button style={{ padding: '24px 64px', backgroundColor: activeB.accent, color: '#000', fontWeight: 900, borderRadius: '20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                   Deploy Engine <Rocket size={20} />
                </button>
                <button style={{ padding: '24px 48px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontWeight: 900, borderRadius: '20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '4px', border: 'none', cursor: 'pointer' }}>View Logs</button>
             </div>
          </div>
       </div>
    </div>
  );
}
