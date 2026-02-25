"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Zap, Search, User as UserIcon, LogOut, ChevronRight, Menu, X as CloseIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/components/UserAvatar";

const Navbar = () => {
  const pathname = usePathname();
  const { user, login, logout, showLoginModal, openLogin, closeLogin, isLoading: isAuthLoading } = useAuth();
  const [usernameInput, setUsernameInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    
    const result = await login(usernameInput);
    if (result.success) {
      setUsernameInput("");
    }
  };

  const navLinks = [
    { name: "Arena", href: "/battle" },
    { name: "Quiz", href: "/quizzes" },
    { name: "Classement", href: "/leaderboard" },
    { name: "Profil", href: "/profile" },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="size-9 bg-primary rounded flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Zap className="size-5 fill-white" />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
              Otaku <span className="text-primary">Mash</span>
            </h2>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  pathname === link.href ? "text-primary" : "text-slate-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden xl:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 focus-within:border-primary/50 focus-within:bg-white/10 transition-all">
            <Search className="size-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un anime..."
              className="bg-transparent border-none text-xs text-white focus:ring-0 ml-2 w-40 placeholder:text-slate-600 outline-none"
            />
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <UserAvatar name={user.username} size="xs" className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black text-white uppercase italic tracking-widest group-hover:text-primary transition-colors">
                    {user.username}
                  </span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button 
                  onClick={openLogin}
                  className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
                >
                  Connexion
                </button>
                <button 
                  onClick={openLogin}
                  className="bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-widest py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                >
                  Rejoindre
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-primary transition-colors z-[60]"
          >
            {isMenuOpen ? <CloseIcon className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMenuOpen(false)}
               className="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-background border-l border-white/5 z-[60] md:hidden p-8 pt-24 flex flex-col gap-8 shadow-3xl"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-2xl font-black uppercase italic tracking-tighter transition-colors ${
                      pathname === link.href ? "text-primary" : "text-white/60 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-px w-full bg-white/5" />

              <div className="flex flex-col gap-6">
                {user ? (
                   <div className="space-y-6">
                      <Link 
                        href="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4"
                      >
                         <UserAvatar name={user.username} size="sm" />
                         <div className="flex flex-col">
                            <span className="text-white font-black italic uppercase tracking-widest leading-none">{user.username}</span>
                            <span className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">Voir le Profil</span>
                         </div>
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-4 text-slate-500 hover:text-red-500 font-bold uppercase text-sm tracking-widest transition-colors"
                      >
                        <LogOut className="size-5" /> Déconnexion
                      </button>
                   </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => {
                        openLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-5 rounded-2xl bg-white/5 text-white font-black uppercase italic tracking-widest text-sm border border-white/5"
                    >
                      Connexion
                    </button>
                    <button 
                      onClick={() => {
                        openLogin();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase italic tracking-widest text-sm shadow-xl shadow-primary/20"
                    >
                      Rejoindre l&apos;Arène
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLogin}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass-card rounded-[32px] p-10 border-white/10 shadow-3xl text-center space-y-8"
            >
              <div className="size-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mx-auto shadow-lg shadow-primary/10 border border-primary/20">
                <UserIcon className="size-8" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Accès Otaku</h2>
                <p className="text-slate-400 text-sm font-medium">Entrez votre pseudonyme pour commencer l&apos;aventure.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  autoFocus
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Pseudo (ex: Luffy, Naruto...)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-bold placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/10 transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={isAuthLoading || !usernameInput.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:grayscale text-white font-black py-4 px-6 rounded-xl transition-all text-xs uppercase tracking-[0.2em] italic shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                >
                  {isAuthLoading ? "Traitement..." : "Entrer dans l'Arène"}
                  <ChevronRight className="size-4" />
                </button>
              </form>
              
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Pas de mot de passe requis pour le moment</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

