"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Globe, Users, TrendingUp, CheckCircle2 } from "lucide-react";

const LANGUAGES = [
  { id: "hi", name: "Hindi", audience: 600 },
  { id: "es", name: "Spanish", audience: 550 },
  { id: "pt", name: "Portuguese", audience: 260 },
  { id: "fr", name: "French", audience: 300 },
  { id: "zh", name: "Mandarin", audience: 1100 },
  { id: "ar", name: "Arabic", audience: 310 },
];

export default function ReachPredictor() {
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["hi", "es"]);

  const totalReach = useMemo(() => {
    return selectedLangs.reduce((acc, id) => {
      const lang = LANGUAGES.find(l => l.id === id);
      return acc + (lang?.audience || 0);
    }, 0);
  }, [selectedLangs]);

  const data = useMemo(() => {
    return [
      { month: "Jan", reach: 100 },
      { month: "Feb", reach: 120 },
      { month: "Mar", reach: 150 },
      { month: "Apr", reach: totalReach * 0.2 + 150 },
      { month: "May", reach: totalReach * 0.5 + 200 },
      { month: "Jun", reach: totalReach + 300 },
    ];
  }, [totalReach]);

  const toggleLang = (id: string) => {
    setSelectedLangs(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0' }}>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Controls */}
        <div className="w-full md:w-1/3">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe className="text-blue-500" /> Global Reach Predictor
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.8rem' }}>Select target languages to see your potential audience expansion.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => toggleLang(lang.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid',
                  transition: 'all 0.3s',
                  background: selectedLangs.includes(lang.id) ? 'rgba(0, 102, 255, 0.1)' : 'var(--bg-card)',
                  borderColor: selectedLangs.includes(lang.id) ? 'var(--accent-blue)' : 'var(--border-theme)',
                  color: selectedLangs.includes(lang.id) ? 'var(--text-main)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <span className="text-sm font-medium">{lang.name}</span>
                {selectedLangs.includes(lang.id) && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '20px', background: 'var(--accent-blue)', borderRadius: '16px', boxShadow: '0 10px 20px rgba(0, 102, 255, 0.2)' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' }}>Total Addressable Audience</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              {totalReach}M <span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.7 }}>people</span>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <TrendingUp className="w-4 h-4" /> 4.2x Avg. Growth Lift
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-theme)' }}>
          <div className="flex items-center justify-between mb-8">
            <h4 style={{ fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users className="w-4 h-4" /> Projected Viewership Growth
            </h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="w-2 h-2 rounded-full bg-blue-500" /> With VoxFlow
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="w-2 h-2 rounded-full bg-gray-600" /> Current Baseline
              </div>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" aspect={2}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-theme)", borderRadius: "12px", color: "var(--text-main)" }}
                  itemStyle={{ color: "var(--accent-blue)" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorReach)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
