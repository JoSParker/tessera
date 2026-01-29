
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    return null;
  }
}

interface AuthContextType {
  user: any | null;
  profile: any | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signIn: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // No-op for now; profile fetching should use API route if needed
  const fetchProfile = async (userId: string) => {};
  const refreshProfile = async () => {};

  useEffect(() => {
    // Initialize session/user from JWT stored in localStorage or recover from cookie
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) {
            const payload = parseJwt(token as string);
            if (!cancelled) setUser(payload);
            setLoading(false);
            return;
          }

          try {
            const res = await fetch('/api/auth', { credentials: 'include' });
            if (!res.ok) {
              setLoading(false);
              return;
            }
            const json = await res.json();
            if (json?.token) {
              localStorage.setItem('token', json.token);
              const payload = parseJwt(json.token as string);
              if (!cancelled) setUser(payload);
            } else if (json?.user) {
              if (!cancelled) setUser(json.user);
            }
          } catch (e) {
            // ignore
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const signIn = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      try {
        const payload = parseJwt(token);
        setUser(payload);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSignOut = async () => {
    // Call server to clear HttpOnly cookie, then clear client state
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (e) {
      // ignore network errors, still clear client state
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signOut: handleSignOut,
        signIn,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
