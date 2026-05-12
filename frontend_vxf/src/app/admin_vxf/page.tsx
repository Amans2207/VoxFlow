"use client";

import React, { useState, useEffect } from "react";
import styles from "./admin.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from '@/utils/supabase/client';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  utr: string;
  status: "Pending" | "Approved";
  date: string;
}

export default function AdminControlPanel() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Stats State
  const [visitorCount, setVisitorCount] = useState(8492);
  const [userCount, setUserCount] = useState(1204);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Advanced Tools State
  const [promos, setPromos] = useState<any[]>([]);
  const [ledger, setLedger] = useState<any[]>([]);
  const [paidUserCount, setPaidUserCount] = useState(0);
  const [earlyBirdLimit, setEarlyBirdLimit] = useState(50);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(124500);
  const [activeSubs, setActiveSubs] = useState(0);
  const [apiBurnRate, setApiBurnRate] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queue, setQueue] = useState<any[]>([]);
  
  // VIP Form State




  const [vipEmail, setVipEmail] = useState("");
  const [vipPass, setVipPass] = useState("");
  const [vipName, setVipName] = useState("");
  const [vipCredits, setVipCredits] = useState(500);
  const [statusMsg, setStatusMsg] = useState("");

  // Super User Form State
  const [superEmail, setSuperEmail] = useState("");
  const [superPass, setSuperPass] = useState("");
  const [superName, setSuperName] = useState("");
  const [superStatus, setSuperStatus] = useState("");

  // Promo Code Form State
  const [newPromoCode, setNewPromoCode] = useState("");
  const [rewardAmount, setRewardAmount] = useState(10);

  useEffect(() => {
    const auth = sessionStorage.getItem("vxf_admin_auth");
    if (auth !== "verified") {
      router.push("/admin_login");
    } else {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, [router]);

  const fetchAdminData = async () => {
    const supabase = createClient();
    
    // Fetch Promo Codes with Revenue Attribution
    const { data: promoData } = await supabase.from('promo_codes').select('*');
    if (promoData) {
      const enrichedPromos = promoData.map(p => ({
        ...p,
        revenue: (p.total_uses || 0) * 1499 * 0.35 // Mock: 35% margin on each use
      })).sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
      setPromos(enrichedPromos);
    }


    // Fetch Credit Ledger
    const { data: ledgerData } = await supabase.from('credit_ledger').select('*').order('created_at', { ascending: false }).limit(10);
    if (ledgerData) setLedger(ledgerData);

    // Fetch System Settings (FOMO Engine & Maintenance)
    const { data: settings } = await supabase.from('system_settings').select('*').single();
    if (settings) {
      setPaidUserCount(settings.paid_user_count);
      setEarlyBirdLimit(settings.early_bird_limit);
      setMaintenanceMode(settings.maintenance_mode || false);
    }

    // Fetch User Stats
    const { count: activeCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_status', 'Active');
    setActiveSubs(activeCount || 0);

    // Fetch Total Revenue (Aggregated from approved transactions)
    // For demo/actual: sum of amount where status = Approved
    // setTotalRevenue(actualSum + baseRevenue)

    // Calculate Burn Rate (Simulated based on jobs)
    const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true });
    setApiBurnRate((jobCount || 0) * 0.45); // $0.45 per job average cost

    // Fetch Users
    const resUsers = await fetch("/api/admin/users");
    const usersData = await resUsers.json();
    if (Array.isArray(usersData)) setUsers(usersData);

    // Fetch Queue
    const resQueue = await fetch("/api/admin/queue");
    const queueData = await resQueue.json();
    if (Array.isArray(queueData)) setQueue(queueData);

    // Fetch Transactions (Mocked for UI as per original)

    setTransactions([
      { id: "txn_8x9a", userId: "user_123", amount: 1000, utr: "312345678901", status: "Pending", date: new Date().toLocaleDateString() },
      { id: "txn_2b3c", userId: "user_456", amount: 500, utr: "312345678902", status: "Approved", date: new Date().toLocaleDateString() }
    ]);
  };

  const handleUpdateLimit = async (newLimit: number) => {
    const supabase = createClient();
    const { error } = await supabase.from('system_settings').update({ early_bird_limit: newLimit }).eq('id', 1);
    if (!error) setEarlyBirdLimit(newLimit);
  };

  const handleResetCounter = async () => {
    if (confirm("Are you sure you want to reset the FOMO counter?")) {
      const supabase = createClient();
      const { error } = await supabase.from('system_settings').update({ paid_user_count: 0 }).eq('id', 1);
      if (!error) setPaidUserCount(0);
    }
  };

  const handleToggleMaintenance = async () => {
    const nextMode = !maintenanceMode;
    const supabase = createClient();
    const { error } = await supabase.from('system_settings').update({ maintenance_mode: nextMode }).eq('id', 1);
    if (!error) {
      setMaintenanceMode(nextMode);
      alert(`Maintenance Mode: ${nextMode ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  const handleSearchUsers = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/users?query=${searchQuery}`);
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  };

  const handleUpdateCredits = async (userId: string, amount: number) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: 'ADD_CREDITS', amount })
    });
    const data = await res.json();
    if (data.success) {
      alert(`Added ${amount} credits!`);
      fetchAdminData();
    }
  };

  const handleToggleBlock = async (userId: string) => {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action: 'TOGGLE_BLOCK' })
    });
    const data = await res.json();
    if (data.success) {
      alert(`User status updated to ${data.nextStatus}`);
      fetchAdminData();
    }
  };

  const handleForceRerender = async (jobId: string) => {
    if (!confirm("Force AI engine to re-render this task? This will reset progress.")) return;
    const res = await fetch("/api/admin/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId })
    });
    const data = await res.json();
    if (data.success) {
      alert("Job reset to Pending. Engine will pick it up shortly.");
      fetchAdminData();
    }
  };





  const handleCreateVIP = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("Generating VIP Access...");
    try {
      const res = await fetch("/api/admin/create-vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: vipEmail, 
          password: vipPass, 
          fullName: vipName, 
          initialCredits: vipCredits 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg("✅ VIP Creator Created!");
        setVipEmail(""); setVipPass(""); setVipName("");
        fetchAdminData();
      } else {
        setStatusMsg("❌ Error: " + data.error);
      }
    } catch (err) {
      setStatusMsg("❌ Connection failed.");
    }
  };

  const handleCreateSuperUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuperStatus("Architecting Super User Access...");
    try {
      const res = await fetch("/api/admin/create-superuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: superEmail, 
          password: superPass, 
          fullName: superName
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuperStatus("🚀 Super User Activated (Studio Tier + 1000 Credits)!");
        setSuperEmail(""); setSuperPass(""); setSuperName("");
        fetchAdminData();
      } else {
        setSuperStatus("❌ Error: " + data.error);
      }
    } catch (err) {
      setSuperStatus("❌ Connection failed.");
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.from('promo_codes').insert({
      code_name: newPromoCode.toUpperCase(),
      reward_amount: rewardAmount,
      reward_type: 'Fixed'
    });

    if (!error) {
      alert("Promo Code Created!");
      setNewPromoCode("");
      fetchAdminData();
    } else {
      alert("Error: " + error.message);
    }
  };

  const handleApprovePayment = async (txn: Transaction) => {
    if (!confirm(`Approve payment of ₹${txn.amount} for user ${txn.userId}?`)) return;
    
    try {
      const supabase = createClient();
      
      // Fetch User Details for Personalized Notification
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', txn.userId)
        .single();

      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txn.id,
          userId: txn.userId,
          amount: txn.amount,
          userName: profile?.full_name || "Creator",
          userEmail: profile?.email || "creator@example.com"
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Payment Approved! Notifications triggered.");
        fetchAdminData();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to connect to approval system.");
    }
  };


  if (!isAuthenticated) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Verifying Identity...</div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div>
          <h1 style={{ color: 'var(--accent-lime)' }}>Master Control Panel</h1>
          <p style={{ color: "var(--text-secondary)" }}>Root Systems Administrator</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/dashboard">
            <button className="btn-primary">Back to Dashboard</button>
          </Link>
        </div>
      </header>

      {/* Admin Analytics HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className={`glass-panel`} style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL REVENUE (UPI)</p>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-lime)' }}>₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className={`glass-panel`} style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>ACTIVE SUBSCRIPTIONS</p>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{activeSubs}</div>
        </div>
        <div className={`glass-panel`} style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>API COST BURN (EST)</p>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff4b4b' }}>${apiBurnRate.toFixed(2)}</div>
        </div>
        <div className={`glass-panel`} style={{ padding: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.05em' }}>PAID USER COUNT (FOMO)</p>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-blue)' }}>{paidUserCount} / {earlyBirdLimit}</div>
        </div>
      </div>

      {/* Global System Controls */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', display: 'flex', gap: '32px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div>
          <h3 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>Global System Toggles</h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Master override for platform-wide availability.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleToggleMaintenance} 
            className="btn-secondary" 
            style={{ 
              borderColor: maintenanceMode ? '#ff4b4b' : 'rgba(255,255,255,0.1)', 
              color: maintenanceMode ? '#ff4b4b' : '#fff',
              background: maintenanceMode ? 'rgba(255,75,75,0.1)' : 'transparent'
            }}
          >
            {maintenanceMode ? '⛔ MAINTENANCE ACTIVE' : '🛠️ GO INTO MAINTENANCE'}
          </button>
          <button className="btn-secondary" disabled>🚀 FREEZE PROMOS (V3.0)</button>
        </div>
      </div>


      {/* FOMO Engine Control */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px', border: '1px solid rgba(0, 102, 255, 0.3)' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span> FOMO Pricing Engine (v2.0)
        </h3>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Early Bird Slot Limit</label>
            <input 
              type="number" 
              className={styles.inputField} 
              value={earlyBirdLimit} 
              onChange={e => handleUpdateLimit(parseInt(e.target.value))} 
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleResetCounter} className="btn-secondary" style={{ color: '#ff3333', borderColor: 'rgba(255,51,51,0.2)' }}>Reset Paid Count</button>
            <button onClick={() => handleUpdateLimit(earlyBirdLimit + 10)} className="btn-primary">+10 Slots</button>
          </div>
        </div>
      </div>


      {/* Affiliate & Revenue Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>📈</span> Revenue Attribution (By Promo Code)
          </h3>
          <div style={{ display: 'flex', gap: '40px', height: '200px', alignItems: 'flex-end' }}>
             {promos.slice(0, 8).map((p, i) => (
               <div key={p.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '100%', 
                    background: `linear-gradient(to top, var(--accent-blue), ${i % 2 === 0 ? 'var(--accent-lime)' : 'var(--accent-blue)'})`, 
                    height: `${Math.min(100, (p.revenue || 0) / 1000)}%`, 
                    borderRadius: '4px 4px 0 0', 
                    minHeight: '20px',
                    boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)'
                  }}></div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{p.code_name}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Referral Leaderboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {promos.slice(0, 5).map((p, i) => (
               <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: i === 0 ? 'var(--accent-lime)' : 'var(--text-secondary)' }}>#{i+1}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{p.code_name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-lime)' }}>₹{p.revenue?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{p.total_uses} Conversions</div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className={`glass-panel`} style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>👑</span> VIP Account Generator
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Create high-ticket accounts with pre-loaded Master Credits.</p>
          <form onSubmit={handleCreateVIP} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="Creator Name" className={styles.inputField} value={vipName} onChange={e => setVipName(e.target.value)} required />
            <input type="email" placeholder="Creator Email" className={styles.inputField} value={vipEmail} onChange={e => setVipEmail(e.target.value)} required />
            <input type="password" placeholder="Temporary Password" className={styles.inputField} value={vipPass} onChange={e => setVipPass(e.target.value)} required />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <label>Master Credits (Mins)</label>
                <span style={{ color: 'var(--accent-lime)', fontWeight: 'bold' }}>{vipCredits}</span>
              </div>
              <input type="range" min="100" max="5000" step="100" value={vipCredits} onChange={e => setVipCredits(parseInt(e.target.value))} style={{ accentColor: 'var(--accent-lime)' }} />
            </div>
            <button type="submit" className="btn-accent" style={{ background: 'var(--accent-lime)', color: '#000', fontWeight: 'bold' }}>Generate & Pre-load Credits</button>
            {statusMsg && <p style={{ fontSize: '0.8rem', color: 'var(--accent-lime)', textAlign: 'center' }}>{statusMsg}</p>}
          </form>
        </div>

        {/* Promo Manager */}
        <div className={`glass-panel`} style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>Promo Code Manager</h3>
          <form onSubmit={handleCreatePromo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="text" placeholder="CODE NAME (e.g. TECHGURU100)" className={styles.inputField} value={newPromoCode} onChange={e => setNewPromoCode(e.target.value)} required />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Reward Amount: {rewardAmount} mins</label>
              <input type="number" className={styles.inputField} style={{ width: '80px' }} value={rewardAmount} onChange={e => setRewardAmount(parseInt(e.target.value))} />
            </div>
            <button type="submit" className="btn-primary">Create Promo Code</button>
          </form>
          
          <div style={{ marginTop: '20px', maxHeight: '150px', overflowY: 'auto' }}>
            <h4 style={{ marginBottom: '8px', fontSize: '0.9rem' }}>Active Codes</h4>
            {promos.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '4px' }}>
                <code>{p.code_name}</code>
                <span>{p.total_uses} uses</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '40px' }}>
        <div className={`glass-panel`} style={{ padding: '32px', border: '1px solid #00f2ff', boxShadow: '0 0 30px rgba(0, 242, 255, 0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
             <h3 style={{ fontSize: '1.2rem', color: '#00f2ff' }}>Super User Architect</h3>
             <span className="badge-neon" style={{ fontSize: '0.6rem', padding: '2px 8px', background: 'rgba(0, 242, 255, 0.1)', color: '#00f2ff', borderColor: '#00f2ff50' }}>MASTER ACCESS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Grants maximum authority: **Studio Tier Access** + **1000 Master Credits**. 
            This user will have every modular feature unlocked by default.
          </p>
          <form onSubmit={handleCreateSuperUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', alignItems: 'flex-end' }}>
            <div className={styles.inputGroup}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Admin/Partner Name</label>
              <input type="text" placeholder="e.g. Aman Studio" className={styles.inputField} value={superName} onChange={e => setSuperName(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Super User Email</label>
              <input type="email" placeholder="email@voxflow.ai" className={styles.inputField} value={superEmail} onChange={e => setSuperEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>Master Password</label>
              <input type="password" placeholder="••••••••" className={styles.inputField} value={superPass} onChange={e => setSuperPass(e.target.value)} required />
            </div>
            <button type="submit" className="btn-accent" style={{ gridColumn: 'span 3', height: '50px', background: 'linear-gradient(90deg, #0072ff, #00f2ff)', color: 'white', fontWeight: 900, fontSize: '1rem' }}>DEPLOY SUPER USER ACCESS</button>
          </form>
          {superStatus && <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem', color: '#00f2ff', fontWeight: 700 }}>{superStatus}</p>}
        </div>
      </div>

      {/* Searchable User Database */}
      <div className={`glass-panel ${styles.tableContainer}`} style={{ marginBottom: '40px' }}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ fontSize: '1rem' }}>Searchable User Database</h3>
          <form onSubmit={handleSearchUsers} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Search by Name/Email..." 
              className={styles.inputField} 
              style={{ width: '300px', height: '36px' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary" style={{ height: '36px' }}>SEARCH</button>
          </form>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User Details</th>
              <th>Status</th>
              <th>Credits</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{u.full_name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                </td>
                <td>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    background: u.user_status === 'Active' ? 'rgba(80, 255, 80, 0.1)' : 'rgba(255, 75, 75, 0.1)',
                    color: u.user_status === 'Active' ? 'var(--accent-lime)' : '#ff4b4b',
                    border: u.user_status === 'Active' ? '1px solid rgba(80, 255, 80, 0.2)' : '1px solid rgba(255, 75, 75, 0.2)'
                  }}>
                    {u.user_status || 'Active'}
                  </span>
                </td>
                <td><span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>{u.credit_balance?.toFixed(1) || 0}m</span></td>
                <td style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      const amount = prompt("Enter Credits (mins) to add:");
                      if (amount) handleUpdateCredits(u.id, parseFloat(amount));
                    }} 
                    style={{ background: 'rgba(0, 242, 255, 0.1)', border: 'none', color: '#00f2ff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + CREDITS
                  </button>
                  <button 
                    onClick={() => handleToggleBlock(u.id)}
                    style={{ background: u.user_status === 'Blocked' ? 'rgba(80, 255, 80, 0.1)' : 'rgba(255, 75, 75, 0.1)', border: 'none', color: u.user_status === 'Blocked' ? 'var(--accent-lime)' : '#ff4b4b', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {u.user_status === 'Blocked' ? 'UNBLOCK' : 'BLOCK'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Production Queue Monitor */}
      <div className={`glass-panel ${styles.tableContainer}`} style={{ marginBottom: '40px', border: '1px solid rgba(0, 242, 255, 0.2)' }}>
        <h3 style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="neural-ping" style={{ width: '8px', height: '8px' }} />
          AI Production Queue (Live)
        </h3>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>Job ID</th>
              <th>Asset Name</th>
              <th>Target Lang</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Manual Trigger</th>
            </tr>
          </thead>
          <tbody>
            {queue.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>No active tasks in the neural pipe.</td>
              </tr>
            ) : (
              queue.map(j => (
                <tr key={j.id}>
                  <td style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{j.id.substring(0, 8)}...</td>
                  <td>{j.filename}</td>
                  <td>{j.target_lang}</td>
                  <td>
                    <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${j.status === 'Processing' ? '65%' : '10%'}`, height: '100%', background: 'var(--accent-blue)', boxShadow: '0 0 10px var(--accent-blue)' }} />
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.65rem', color: j.status === 'Processing' ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
                      {j.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleForceRerender(j.id)}
                      style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid rgba(255, 75, 75, 0.2)', color: '#ff4b4b', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      FORCE RE-RENDER
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={`glass-panel ${styles.tableContainer}`} style={{ marginBottom: '40px' }}>
        <h3 style={{ padding: '20px' }}>Audit Trail: Credit Ledger</h3>
        <table className={styles.table}>

          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Credits</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleDateString()}</td>
                <td><span className={styles.statusApproved}>{log.action_type}</span></td>
                <td>+{log.amount} Mins</td>
                <td>{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`glass-panel ${styles.tableContainer}`}>
        <h3 style={{ padding: '20px' }}>Pending Transactions</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>User ID</th>
              <th>Amount (INR)</th>
              <th>UTR / Ref ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td>{txn.userId}</td>
                <td>₹{txn.amount}</td>
                <td style={{ fontFamily: "monospace" }}>{txn.utr}</td>
                <td>
                  <span className={styles[`status${txn.status}`]}>
                    {txn.status}
                  </span>
                </td>
                <td>
                    {txn.status === "Pending" && (
                      <button 
                        className={styles.approveBtn} 
                        onClick={() => handleApprovePayment(txn)}
                      >
                        Approve
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
