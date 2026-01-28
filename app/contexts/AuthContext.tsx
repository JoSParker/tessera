
"use client";
import { signInWithEmail, signUpWithEmail } from "@/lib/apiClient";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  profile: any | null;
  session: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
    // TODO: Initialize session/user from JWT (localStorage/cookie)
    // Example: load token from localStorage and decode user
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    // For JWT, just clear state and remove token from storage
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
