"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem("otaku_user") : null;
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (data.id) {
        localStorage.setItem("otaku_user", JSON.stringify(data));
        setUser(data);
        setShowLoginModal(false);
        return { success: true, user: data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Erreur de connexion" };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("otaku_user");
    setUser(null);
  };

  const openLogin = () => setShowLoginModal(true);
  const closeLogin = () => setShowLoginModal(false);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      showLoginModal, 
      openLogin, 
      closeLogin,
      isLoading
    }}>
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
