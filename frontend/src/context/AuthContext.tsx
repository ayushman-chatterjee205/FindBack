"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, role?: UserRole, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TRIAL_ACCOUNTS: Record<
  string,
  { role: UserRole; name: string; roll?: string; isOfficer?: boolean; defaultPass: string }
> = {
  "student@campus.edu": {
    role: "student",
    name: "Ayushman Chatterjee",
    roll: "2563002",
    defaultPass: "student1234",
  },
  "guard@campus.edu": {
    role: "staff",
    name: "Officer Sharma",
    defaultPass: "guard1234",
  },
  "officer@campus.edu": {
    role: "staff",
    name: "Campus Security Officer",
    isOfficer: true,
    defaultPass: "officer1234",
  },
};

export const isDemoEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === "student@campus.edu" ||
    normalized === "guard@campus.edu" ||
    normalized === "officer@campus.edu"
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check active tab session in sessionStorage (preserves active demo login during current browsing session)
    const sessionUserStr = typeof window !== "undefined" ? sessionStorage.getItem("findback_user") : null;
    const sessionToken = typeof window !== "undefined" ? sessionStorage.getItem("findback_token") : null;

    if (sessionUserStr && sessionToken) {
      try {
        const parsed = JSON.parse(sessionUserStr);
        const isOfficer = parsed.is_security_officer || parsed.email?.toLowerCase() === "officer@campus.edu";
        parsed.is_security_officer = isOfficer;
        parsed.can_switch_views = isOfficer;
        setUser(parsed);
        setToken(sessionToken);
        if (typeof document !== "undefined") {
          document.cookie = `findback_session=${sessionToken}; path=/; SameSite=Lax`;
        }
        setIsLoading(false);
        return;
      } catch {
        sessionStorage.removeItem("findback_user");
        sessionStorage.removeItem("findback_token");
      }
    }

    // 2. Check persistent localStorage (ONLY for official credentials, strictly valid for 7 days)
    const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("findback_user") : null;
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("findback_token") : null;
    const loginTimeStr = typeof window !== "undefined" ? localStorage.getItem("findback_login_time") : null;

    if (savedUserStr && savedToken) {
      try {
        const parsed = JSON.parse(savedUserStr);
        const isDemo = isDemoEmail(parsed.email) || parsed.is_demo;

        // If a demo user was in localStorage, wipe it (demo must never be remembered across browser opens)
        if (isDemo) {
          localStorage.removeItem("findback_user");
          localStorage.removeItem("findback_token");
          localStorage.removeItem("findback_login_time");
          setUser(null);
          setToken(null);
          if (typeof document !== "undefined") {
            document.cookie = "findback_session=; path=/; max-age=0";
          }
          setIsLoading(false);
          return;
        }

        // Official credentials: valid for 7 days (7 * 24 * 60 * 60 * 1000 ms)
        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : 0;
        const now = Date.now();

        if (loginTime && (now - loginTime > SEVEN_DAYS_MS)) {
          // 7 days expired
          localStorage.removeItem("findback_user");
          localStorage.removeItem("findback_token");
          localStorage.removeItem("findback_login_time");
          if (typeof document !== "undefined") {
            document.cookie = "findback_session=; path=/; max-age=0";
          }
          setUser(null);
          setToken(null);
          setIsLoading(false);
          if (typeof window !== "undefined" && window.location.pathname !== "/signed-out" && window.location.pathname !== "/login") {
            window.location.href = "/signed-out?reason=expired";
          }
          return;
        }

        const isOfficer = parsed.is_security_officer || parsed.email?.toLowerCase() === "officer@campus.edu";
        parsed.is_security_officer = isOfficer;
        parsed.can_switch_views = isOfficer;
        setUser(parsed);
        setToken(savedToken);
        if (typeof document !== "undefined") {
          document.cookie = `findback_session=${savedToken}; path=/; max-age=604800; SameSite=Lax`;
        }
      } catch {
        setUser(null);
        setToken(null);
        if (typeof document !== "undefined") {
          document.cookie = "findback_session=; path=/; max-age=0";
        }
      }
    } else {
      setUser(null);
      setToken(null);
      if (typeof document !== "undefined") {
        document.cookie = "findback_session=; path=/; max-age=0";
      }
    }
    setIsLoading(false);
  }, []);

  const authenticateTrialAccount = (email: string) => {
    const trial = TRIAL_ACCOUNTS[email.toLowerCase()];
    if (!trial) {
      return { success: false, message: "Account does not exist. Please register first." };
    }

    const verifiedUser: User = {
      id: trial.isOfficer ? "cso-001" : trial.role === "staff" ? "stf-001" : "std-001",
      email: email.toLowerCase(),
      full_name: trial.name,
      roll_number: trial.roll,
      role: trial.role,
      is_security_officer: !!trial.isOfficer,
      can_switch_views: !!trial.isOfficer,
      created_at: new Date().toISOString(),
    };

    const sessionToken = `trial_token_${Date.now()}`;
    setUser(verifiedUser);
    setToken(sessionToken);

    sessionStorage.setItem("findback_user", JSON.stringify(verifiedUser));
    sessionStorage.setItem("findback_token", sessionToken);
    localStorage.removeItem("findback_user");
    localStorage.removeItem("findback_token");
    localStorage.removeItem("findback_login_time");
    if (typeof document !== "undefined") {
      document.cookie = `findback_session=${sessionToken}; path=/; SameSite=Lax`;
    }

    return { success: true };
  };

  const login = async (
    email: string,
    role: UserRole = "student",
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    const isDemo = isDemoEmail(normalizedEmail);
    const trial = TRIAL_ACCOUNTS[normalizedEmail];

    // 1. If password provided, attempt real backend JWT authentication
    if (password) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        if (res.ok) {
          const data = await res.json();
          const isOfficer = normalizedEmail === "officer@campus.edu" || data.user.email?.toLowerCase() === "officer@campus.edu";
          const backendUser: User = {
            id: data.user.id,
            email: data.user.email,
            full_name: isOfficer ? "Campus Security Officer" : data.user.full_name,
            roll_number: data.user.roll_number,
            role: data.user.role as UserRole,
            is_security_officer: isOfficer,
            can_switch_views: isOfficer,
            created_at: data.user.created_at || new Date().toISOString(),
          };

          setUser(backendUser);
          setToken(data.access_token);

          if (isDemo) {
            // Demo credentials: store ONLY for this active tab session, never persist across browser restarts
            sessionStorage.setItem("findback_user", JSON.stringify(backendUser));
            sessionStorage.setItem("findback_token", data.access_token);
            localStorage.removeItem("findback_user");
            localStorage.removeItem("findback_token");
            localStorage.removeItem("findback_login_time");
            if (typeof document !== "undefined") {
              // True session cookie: automatically deleted when browser is closed
              document.cookie = `findback_session=${data.access_token}; path=/; SameSite=Lax`;
            }
          } else {
            // Official credentials: persist for 7 days
            localStorage.setItem("findback_user", JSON.stringify(backendUser));
            localStorage.setItem("findback_token", data.access_token);
            localStorage.setItem("findback_login_time", Date.now().toString());
            sessionStorage.removeItem("findback_user");
            sessionStorage.removeItem("findback_token");
            if (typeof document !== "undefined") {
              document.cookie = `findback_session=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
            }
          }

          return { success: true };
        } else {
          const errData = await res.json().catch(() => ({}));

          // If demo trial account and backend returned an error, fallback to verified trial pass
          if (trial && password === trial.defaultPass) {
            return authenticateTrialAccount(normalizedEmail);
          }

          if (res.status === 404 || errData.detail?.toLowerCase().includes("not exist")) {
            return {
              success: false,
              message: "Account does not exist. Please register first.",
            };
          }

          return {
            success: false,
            message: errData.detail || "Incorrect email or password.",
          };
        }
      } catch {
        // Backend offline or unreachable: strictly permit verified trial accounts only
        if (trial && password === trial.defaultPass) {
          return authenticateTrialAccount(normalizedEmail);
        }

        return {
          success: false,
          message: "Account does not exist. Please register first.",
        };
      }
    }

    // No password provided: strictly permit verified trial accounts only
    if (trial) {
      return authenticateTrialAccount(normalizedEmail);
    }

    // Strict rejection for any unregistered account
    return {
      success: false,
      message: "Account does not exist. Please register first.",
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("findback_user");
    localStorage.removeItem("findback_token");
    localStorage.removeItem("findback_login_time");
    sessionStorage.removeItem("findback_user");
    sessionStorage.removeItem("findback_token");
    if (typeof document !== "undefined") {
      document.cookie = "findback_session=; path=/; max-age=0";
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    // View switching is strictly restricted to Campus Security Officer
    const canSwitch = user.is_security_officer || user.can_switch_views || user.email?.toLowerCase() === "officer@campus.edu" || user.role === "admin";
    if (!canSwitch) {
      console.warn("View switching is strictly restricted to Campus Security Officer.");
      return;
    }
    const updated: User = {
      ...user,
      role: newRole,
      full_name: user.is_security_officer ? "Campus Security Officer" : user.full_name,
    };
    setUser(updated);
    localStorage.setItem("findback_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
