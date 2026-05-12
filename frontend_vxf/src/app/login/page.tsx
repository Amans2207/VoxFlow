"use client";

import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "../actions/auth";

import { signIn } from "next-auth/react";

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setErrorMsg("Google Authentication Failed");
    }
  };

  const handleLogin = async (formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#050505] items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-[#a855f7]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-[#10b981]/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[480px] bg-white/2 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 lg:p-16 flex flex-col gap-10 shadow-3xl z-10">
        <div className="flex flex-col gap-4 text-center">
           <h1 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">Vox<span className="text-[#a855f7]">Flow</span></h1>
           <p className="text-[10px] font-black text-[#404040] uppercase tracking-[5px]">Neural Command Center</p>
        </div>

        <div className="flex flex-col gap-6">
           <button 
             onClick={handleGoogleLogin}
             className="h-16 w-full bg-white text-black rounded-2xl flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-widest hover:bg-[#a855f7] hover:text-white transition-all shadow-xl active:scale-95 group"
           >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.024 1.024-2.584 2.12-5.912 2.12-5.408 0-9.76-4.392-9.76-9.8s4.352-9.8 9.76-9.8c2.936 0 5.144 1.152 6.704 2.624l2.32-2.32c-2.104-2.024-5.112-3.64-9.024-3.64-7.232 0-13.152 5.824-13.152 13.064s5.92 13.064 13.152 13.064c3.904 0 6.92-1.288 9.32-3.792 2.44-2.44 3.2-5.856 3.2-8.68 0-.848-.064-1.664-.192-2.432h-12.448z" />
              </svg>
              Continue with Google
           </button>

           <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[8px] font-black text-[#404040] uppercase tracking-widest">or neural bypass</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
           </div>

           <form action={handleLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                 <label className="text-[9px] font-black text-[#404040] uppercase tracking-widest ml-1">Secure Email</label>
                 <input 
                   type="email" 
                   name="email"
                   required
                   placeholder="agent@voxflow.ai"
                   className="h-14 w-full bg-white/2 border border-white/5 rounded-2xl px-6 text-[11px] font-bold text-white outline-none focus:border-[#a855f733] transition-all"
                 />
              </div>
              <div className="flex flex-col gap-2">
                 <label className="text-[9px] font-black text-[#404040] uppercase tracking-widest ml-1">Protocol Password</label>
                 <input 
                   type="password" 
                   name="password"
                   required
                   placeholder="••••••••"
                   className="h-14 w-full bg-white/2 border border-white/5 rounded-2xl px-6 text-[11px] font-bold text-white outline-none focus:border-[#a855f733] transition-all"
                 />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                   {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                className="h-14 w-full bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] text-[#404040] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all active:scale-95"
              >
                 Initialize Login
              </button>
           </form>
        </div>

        <div className="flex flex-col gap-4 text-center">
           <p className="text-[9px] font-black text-[#404040] uppercase tracking-widest">
              New to the ecosystem? <Link href="/signup" className="text-white hover:text-[#a855f7] transition-colors ml-2">Request Access</Link>
           </p>
           <Link href="/admin_login" className="text-[8px] font-black text-[#262626] uppercase tracking-widest hover:text-white transition-colors">Admin Command Access</Link>
        </div>
      </div>
    </div>
  );
}
