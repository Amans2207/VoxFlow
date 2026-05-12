"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "../actions/auth";

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={`glass-panel ${styles.authCard}`}>
        <div className={styles.logo}>
          <h2>VoxFlow</h2>
        </div>
        <h1>Welcome Back</h1>
        <p>Enter your credentials to access your dashboard.</p>
        
        <form action={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              required 
              placeholder="••••••••"
            />
          </div>
          
          {errorMsg && <div style={{ color: '#ff5555', fontSize: '0.85rem' }}>{errorMsg}</div>}
          
          <button type="submit" className="btn-primary">Sign In</button>
        </form>
        
        <div className={styles.footer}>
          Don't have an account? <Link href="/signup" className={styles.link}>Sign Up</Link>
        </div>
        <div className={styles.adminLink}>
          <Link href="/admin_login" className={styles.link}>Admin Access</Link>
        </div>
      </div>
    </div>
  );
}
