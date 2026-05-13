"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

type Theme = "starboy" | "cyber-rush" | "executive" | "executive-gold" | "cyber-sunset" | "emerald-phantom" | "crimson-fury" | "clean-studio";

interface ThemeContextType {
  currentTheme: Theme;
  previewTheme: Theme | null;
  setTheme: (theme: Theme) => Promise<void>;
  setPreviewTheme: (theme: Theme | null) => void;
  isPaywallOpen: boolean;
  setIsPaywallOpen: (open: boolean) => void;
  userTier: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("starboy");
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [userTier, setUserTier] = useState("Lite");

  useEffect(() => {
    // 1. Instant load from localStorage
    const savedTheme = localStorage.getItem("vxf_theme") as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }

    // 2. Sync from Supabase & get user tier
    const syncFromSupabase = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("credit_balance, role, plan_tier, selected_theme_id")
          .eq("email", session.user.email)
          .single();

        if (profile) {
          const profileData = profile as any;
          setUserTier(profileData.plan_tier || "Lite");
          if (profileData.selected_theme_id && profileData.selected_theme_id !== savedTheme) {
            setCurrentTheme(profileData.selected_theme_id as Theme);
            document.documentElement.setAttribute("data-theme", profileData.selected_theme_id);
            localStorage.setItem("vxf_theme", profileData.selected_theme_id);
          }
        }
      }
    };

    syncFromSupabase();
  }, []);

  // Update document attribute when theme or preview changes
  useEffect(() => {
    const themeToApply = previewTheme || currentTheme;
    document.documentElement.setAttribute("data-theme", themeToApply);
  }, [currentTheme, previewTheme]);

  const setTheme = async (theme: Theme) => {
    // VIP Check
    const isVIP = theme === "executive-gold" || theme === "emerald-phantom";
    if (isVIP && userTier !== "Studio") {
      setIsPaywallOpen(true);
      return;
    }

    setCurrentTheme(theme);
    localStorage.setItem("vxf_theme", theme);

    // Sync to Supabase
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ selected_theme_id: theme })
        .eq("id", user.id);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        currentTheme, 
        previewTheme, 
        setTheme, 
        setPreviewTheme, 
        isPaywallOpen, 
        setIsPaywallOpen,
        userTier 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
