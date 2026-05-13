'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  RefreshCw,
  Activity
} from 'lucide-react';

export default function AdminPortal() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCredits: 0,
    totalRevenue: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'Admin' || profile?.is_admin) {
      setIsAdmin(true);
      fetchStats();
    } else {
      window.location.href = '/dashboard';
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Total Users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Total Credits
      const { data: creditsData } = await supabase
        .from('profiles')
        .select('credit_balance');
      const totalCredits = creditsData?.reduce((acc, curr) => acc + Number(curr.credit_balance), 0) || 0;

      // 3. Total Revenue (Approved Transactions)
      const { data: revenueData } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'Approved');
      const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      // 4. Active Jobs
      const { count: jobCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Processing');

      setStats({
        totalUsers: userCount || 0,
        totalCredits: Math.round(totalCredits),
        totalRevenue: Math.round(totalRevenue),
        activeJobs: jobCount || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-['Inter']">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            ADMIN COMMAND CENTER
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-cyan-400" />
            Neural Core Access: Level 4 Authorized
          </p>
        </div>
        <button 
          onClick={fetchStats}
          disabled={loading}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Creators" 
          value={stats.totalUsers.toLocaleString()} 
          icon={<Users className="text-cyan-400" />} 
          delay={0.1}
        />
        <StatCard 
          title="Neural Balance" 
          value={stats.totalCredits.toLocaleString()} 
          icon={<Zap className="text-yellow-400" />} 
          delay={0.2}
        />
        <StatCard 
          title="Gross Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={<CreditCard className="text-emerald-400" />} 
          delay={0.3}
        />
        <StatCard 
          title="Active Renders" 
          value={stats.activeJobs.toLocaleString()} 
          icon={<Activity className="text-rose-400" />} 
          delay={0.4}
        />
      </div>

      {/* Main Panel */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time Feed Mock */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-cyan-400" />
              Platform Performance
            </h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
              Live Optimized
            </span>
          </div>
          
          <div className="h-64 flex items-end gap-4 px-4">
             {/* Chart Placeholder */}
             {[40, 70, 45, 90, 65, 80, 50, 85, 30, 95, 60, 75].map((h, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${h}%` }}
                 transition={{ delay: i * 0.05, duration: 1 }}
                 className="flex-1 bg-gradient-to-t from-cyan-600/20 to-cyan-400/60 rounded-t-sm"
               />
             ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            <span>May 01</span>
            <span>May 12</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
             <h3 className="text-lg font-bold mb-4">Strategic Pillar Control</h3>
             <div className="space-y-3">
                <ActionButton label="Flush Synthesis Cache" sub="Free up NVENC threads" color="cyan" />
                <ActionButton label="Broadcast System Alert" sub="Notify all active creators" color="yellow" />
                <ActionButton label="Force Database Re-Sync" sub="Fix ledger discrepancies" color="rose" />
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
             <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap size={18} className="text-indigo-400" />
                Scale Engine
             </h3>
             <p className="text-sm text-gray-400 mt-2">
                Scaling VoxFlow to handle 10,000+ simultaneous renders via RunPod Orchestration.
             </p>
             <button className="w-full mt-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2 transition-all">
                Launch Scale Cluster
                <ArrowUpRight size={16} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, delay }: { title: string; value: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-black/40 rounded-lg border border-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Global</span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-black mt-1 tracking-tight">{value}</p>
    </motion.div>
  );
}

function ActionButton({ label, sub, color }: { label: string; sub: string; color: 'cyan' | 'yellow' | 'rose' }) {
  const colors = {
    cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
    yellow: 'hover:border-yellow-500/50 hover:bg-yellow-500/5',
    rose: 'hover:border-rose-500/50 hover:bg-rose-500/5',
  };

  return (
    <button className={`w-full text-left p-3 rounded-xl border border-white/5 bg-black/20 transition-all ${colors[color]}`}>
      <div className="font-bold text-sm">{label}</div>
      <div className="text-[10px] text-gray-500 uppercase font-bold">{sub}</div>
    </button>
  );
}
