"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from "recharts";
import { TrendingUp, DollarSign, Globe, Zap, Users, ArrowUpRight } from "lucide-react";

const DATA_REACH = [
  { name: "Current", reach: 1.2, cost: 5000 },
  { name: "Hindi", reach: 4.8, cost: 200 },
  { name: "Spanish", reach: 8.4, cost: 400 },
  { name: "Mandarin", reach: 15.2, cost: 600 },
  { name: "Global", reach: 24.5, cost: 850 },
];

export default function ROIAnalytics() {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);

  const savings = 14250; // Mock savings vs traditional studio

  if (!isMounted) return <div style={{ height: '400px' }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ background: 'rgba(0, 102, 255, 0.1)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(0, 102, 255, 0.2)' }}>
          <div style={{ color: 'rgba(0, 242, 255, 0.6)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Studio Savings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00f2ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="w-6 h-6" /> {savings.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>VS Traditional Agency Costs</div>
        </div>

        <div style={{ background: 'rgba(80, 255, 80, 0.05)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(80, 255, 80, 0.1)' }}>
          <div style={{ color: 'rgba(80, 255, 80, 0.6)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Reach Multiplier</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#50ff50', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight className="w-6 h-6" /> 18.4x
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Global Localization Lift</div>
        </div>

        <div style={{ background: 'rgba(255, 170, 0, 0.05)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(255, 170, 0, 0.1)' }}>
          <div style={{ color: 'rgba(255, 170, 0, 0.6)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Neural Efficiency</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffaa00', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap className="w-6 h-6" /> 94%
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Automation vs Manual Ops</div>
        </div>
      </div>

      {/* Reach Chart */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'white', marginBottom: '4px' }}>GLOBAL REACH PROJECTION</h4>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Potential audience expansion per localization tier</p>
          </div>
          <Globe className="w-5 h-5 text-blue-500" />
        </div>

        <div style={{ height: '220px', width: '100%' }}>
          <ResponsiveContainer width="100%" aspect={2}>
            <AreaChart data={DATA_REACH}>
              <defs>
                <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}M`} />
              <Tooltip 
                contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#0066FF' }}
              />
              <Area type="monotone" dataKey="reach" stroke="#0066FF" strokeWidth={3} fill="url(#reachGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
