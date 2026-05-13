"use client";

import React, { useState } from "react";
import styles from "../login/login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signup } from "../actions/auth";

export default function Signup() {
  const [errorMsg, setErrorMsg] = useState("");

  const handleSignup = async (formData: FormData) => {
    const result = await signup(formData);
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
        <h1>Create Account</h1>
        <p>Join 10,000+ creators globalizing their content.</p>
        
        <form action={handleSignup} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" name="name" required placeholder="John Doe" />
          </div>
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

          <div className={styles.formGroup}>
            <label>Promo Code (Optional)</label>
            <input 
              type="text" 
              name="referralCode" 
              placeholder="e.g. TECHGURU100"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          {errorMsg && <div style={{ color: '#ff5555', fontSize: '0.85rem' }}>{errorMsg}</div>}
          
          <button type="submit" className="btn-accent">Create Account</button>
        </form>
        
        <div className={styles.footer}>
          Already have an account? <Link href="/login" className={styles.link}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
