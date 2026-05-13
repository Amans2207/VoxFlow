import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
          const syncUrl = `${apiBase}/api/register`;
          console.log(`[NextAuth] Syncing profile with Neural Core: ${syncUrl}`);
          
          const res = await fetch(syncUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });
          
          if (!res.ok) console.warn(`[NextAuth] Neural Core sync returned status: ${res.status}`);
          return true;
        } catch (error) {
          console.error("[NextAuth] CRITICAL: Backend Neural Core Offline. Sync Bypassed.", error);
          return true; // Still let them in, but sync failed
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
