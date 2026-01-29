"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { signInWithEmail, signUpWithEmail } from "@/lib/apiClient";
import { useAuth } from "@/app/contexts/AuthContext";
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signIn } = useAuth();
  
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
        const res = await signInWithEmail(formData.email, formData.password);
        if (res?.error) throw new Error(res.error);
        if (res?.token) {
          signIn(res.token);
          router.push("/");
        } else {
          throw new Error('Invalid response from server');
        }
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
      <div className={styles.container}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.flipContainer} ${isFlipping ? styles.flipping : ''}`} style={{ transformStyle: "preserve-3d" }}>
        <div className={styles.authCard}>
          {/* Header */}
          <div className={styles.header}>
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <img src="/logo.png" alt="tessera" className="h-8 w-8 object-contain" />
                </div>
                <h1 className={styles.title}>tessera</h1>
              </div>
            <p className={styles.subtitle}>{isLogin ? "Sign in to your account" : "Create new account"}</p>
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
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
              style={{ boxShadow: "0 4px 20px rgba(19, 182, 236, 0.3)" }}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">{isLogin ? "login" : "person_add"}</span>
                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerText}>Or</div>
          </div>

          {/* Toggle Mode */}
          <div className={styles.toggleSection}>
            <p className={styles.toggleText}>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
            <button type="button" onClick={toggleMode} className={styles.toggleButton}>
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerText}>Secure time tracking for professionals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
