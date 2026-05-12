"use client";

import React, { useState } from "react";
import styles from "../login/login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Configurable admin validation using NEXT_PUBLIC_ env vars (for dev/test)
    const configuredId = process.env.NEXT_PUBLIC_ADMIN_ID || "VoxFlowAdmin_aman";
    const configuredPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "VoxFlow@2211!#";

    const normalizedInputId = adminId.trim().toLowerCase();
    const normalizedCfgId = configuredId.trim().toLowerCase();

    if (normalizedInputId === normalizedCfgId && password === configuredPassword) {
      sessionStorage.setItem("vxf_admin_auth", "verified");
      router.push("/admin_vxf");
    } else {
      setError("Invalid admin credentials — check Admin ID and Password.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={`glass-panel ${styles.authCard}`} style={{ border: '1px solid rgba(204, 255, 0, 0.3)' }}>
        <div className={styles.logo}>
          <h2 style={{ color: 'var(--accent-lime)' }}>Control Panel</h2>
        </div>
        <h1>Secure Access</h1>
        <p>Restricted to verified administrators only.</p>
        
        <form onSubmit={handleAdminLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Admin ID</label>
            <input 
              type="text" 
              value={adminId} 
              onChange={(e) => setAdminId(e.target.value)} 
              required 
              placeholder="Admin ID"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Master Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          
          {error && <div style={{ color: '#ff5555', fontSize: '0.85rem' }}>{error}</div>}
          
          <button type="submit" className="btn-accent" style={{ marginTop: '16px' }}>Authorize Access</button>
        </form>
        
        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>← Back to User Login</Link>
        </div>
      </div>
    </div>
  );
}
