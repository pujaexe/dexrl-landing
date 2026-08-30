"use client";

import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Cookies from "js-cookie";
import { useNavigate } from "@/lib/router-compat";
import { affiliateLogout, getCurrentUserData } from "@/services/authService";

interface AuthContextType {
  userSession: any;
  setUserSession: any;
  loading: boolean;
  affiliateLoginWithGoogle: (googleIdToken: string) => Promise<void>;
  affiliateSignUpWithGoogle: (googleIdToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const affiliateLoginWithGoogle = async (googleIdToken: string) => {
    if (!googleIdToken) {
      console.error("No Google token found");
      return;
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: googleIdToken,
    });

    if (error) throw error;
    Cookies.set("is_google_login", "yes", {
      expires: 1,
      path: "/",
      sameSite: "None",
      secure: true,
    });
    
    setLoading(false);
    navigate("/auth");
  };

  const affiliateSignUpWithGoogle = async (googleIdToken: string) => {
    if (!googleIdToken) {
      console.error("No Google token found");
      return;
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: googleIdToken,
    });

    if (error) throw error;

    setLoading(false);
    navigate("/signup");
  };

  useEffect(() => {
    const user = getCurrentUserData();
    if (user) {
      setUserSession(user);
    }
  }, []);

  const logout = async () => {
    affiliateLogout();
    setUserSession(null)
  };

  return (
    <AuthContext.Provider
      value={{
        userSession,
        setUserSession,
        loading,
        affiliateLoginWithGoogle,
        affiliateSignUpWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
