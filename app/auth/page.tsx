"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { signInWithEmail, signUpWithEmail } from "@/lib/apiClient";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Check for error in URL params
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        // Sign In
        const { data, error } = await signInWithEmail(formData.email, formData.password);
        if (error) throw error;
        router.push("/");
      } else {
        // Sign Up
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        
        const { data, error } = await signUpWithEmail(
          formData.email,
          formData.password,
          formData.name
        );
        if (error) throw error;
        
        setSuccess("Account created! Please check your email to verify your account.");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  

  const toggleMode = () => {
    setIsFlipping(true);
    setError(null);
    setSuccess(null);

    setTimeout(() => {
      setIsLogin(!isLogin);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }, 300);

    setTimeout(() => {
      setIsFlipping(false);
    }, 600);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4" style={{ perspective: "1000px" }}>
      <div 
        className={`w-full max-w-md transition-transform duration-600 ease-out ${isFlipping ? "scale-95 opacity-80" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="glass-panel rounded-2xl p-8 border border-[#233f48]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">ChronosMatrix</h1>
            </div>
            <p className="text-sm text-[#92bbc9] uppercase tracking-wider font-mono">
              {isLogin ? "Sign in to your account" : "Create new account"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-[#92bbc9] uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#233f48]/30 border border-[#233f48] rounded-xl px-4 py-3 text-white placeholder-[#92bbc9]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#92bbc9] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#233f48]/30 border border-[#233f48] rounded-xl px-4 py-3 text-white placeholder-[#92bbc9]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#92bbc9] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#233f48]/30 border border-[#233f48] rounded-xl px-4 py-3 text-white placeholder-[#92bbc9]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-[#92bbc9] uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-[#233f48]/30 border border-[#233f48] rounded-xl px-4 py-3 text-white placeholder-[#92bbc9]/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              style={{ boxShadow: "0 4px 20px rgba(19, 182, 236, 0.3)" }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">
                    {isLogin ? "login" : "person_add"}
                  </span>
                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#233f48]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs font-mono text-[#92bbc9] uppercase bg-[#101d22]">Or</span>
            </div>
          </div>

          

          {/* Toggle Mode */}
          <div className="mt-8 pt-6 border-t border-[#233f48] text-center">
            <p className="text-sm text-[#92bbc9] mb-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-[#92bbc9]/50 uppercase tracking-widest font-mono">
              Secure time tracking for professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
