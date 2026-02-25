"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3, Share2, BarChart3, Target, Award, Heart, Clock,
  Trophy, Medal, Flame, Settings, Edit2, Activity, CheckCircle2,
  ChevronRight, Zap, Play, X, Shield, Star, LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import { calculateExpertise, getPrestigeTitle } from "@/lib/expertise";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [journeyProgress, setJourneyProgress] = useState(null);
  const { user: authUser, logout, openLogin } = useAuth();

  const expertiseData = calculateExpertise(user?.quizAttempts, user?.votes);
  const prestigeTitle = getPrestigeTitle(user?.level, user?.xp, user?._count?.votes);

  const fetchProfile = useCallback(async () => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${authUser.id}`);
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    fetchProfile();

    // Charger le parcours en cours
    const saved = localStorage.getItem("otaku_quiz_progress");
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        if (progress.userId === authUser?.id || progress.userId === authUser?.username) {
          setJourneyProgress(progress);
        }
      } catch (e) {
        console.error("Failed to parse journey progress", e);
      }
    }
  }, [fetchProfile, authUser]);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-32 px-6">
        <div className="glass-card p-12 rounded-[40px] text-center space-y-8 max-w-md border-white/5">
          <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto">
            <Shield className="size-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Profil Inaccessible</h2>
            <p className="text-slate-500 font-medium">Connectez-vous pour voir votre progression et vos badges.</p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={openLogin}
              className="bg-primary text-white font-black py-5 px-8 rounded-xl uppercase tracking-widest text-[10px] italic shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Se Connecter Maintenant
            </button>
            <Link href="/" className="text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-glow -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[400px] rounded-[48px] overflow-hidden group shadow-2xl border border-white/5"
        >
          <Image
            src="https://images.unsplash.com/photo-1614850523296-d8c1af03d400?q=80&w=2070&auto=format&fit=crop"
            alt="Cover"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

          <div className="absolute bottom-10 left-10 flex flex-col md:flex-row items-end gap-10 w-[calc(100%-80px)] z-10">
             <div className="relative group/avatar">
               <motion.div
                 whileHover={{ scale: 1.05 }}
                 className="relative size-32 md:size-48 rounded-[40px] border-[8px] border-background overflow-hidden shadow-2xl transition-transform duration-500 flex items-center justify-center bg-slate-800"
               >
                 <UserAvatar name={user?.username} size="lg" className="border-0 shadow-none !rounded-none" />
               </motion.div>
               <div className="absolute -bottom-3 -right-3 size-14 bg-primary rounded-2xl flex items-center justify-center text-2xl shadow-xl border-4 border-background hover:scale-110 transition-transform cursor-pointer shadow-primary/40">
                 <Zap className="size-6 text-white fill-white" />
               </div>
             </div>

             <div className="flex-1 flex flex-col gap-6 pb-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex flex-col gap-3 items-center md:items-start relative">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-none text-center md:text-left">
                    {user?.username || "Otaku"}
                  </h1>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 group px-3 py-1 rounded-full bg-primary/10 border border-primary/20 cursor-default hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(140,43,238,0.2)]"
                  >
                    <Star className="size-3 text-primary fill-primary" />
                    <span className="text-[9px] md:text-[10px] font-black text-primary uppercase italic tracking-widest">{prestigeTitle}</span>
                  </motion.div>
                </div>
                <div className="flex gap-8 items-center mt-2">
                      <span className="bg-primary/20 backdrop-blur-md border border-primary/40 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/10">WEEB ASSIDU</span>
                      <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">LVL {user?.level || 1}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 italic max-w-xl leading-relaxed font-medium">
                    &quot;Love and Peace! À la recherche du meilleur ramen dans le multivers numérique.&quot;
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button className="bg-primary hover:bg-primary/90 text-white font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] italic transition-all flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 leading-none">
                    <Edit3 className="size-4" /> Modifier le Profil
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 text-white font-black px-6 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] italic transition-all border border-white/10 hover:border-white/20 flex items-center gap-3 leading-none">
                    <Share2 className="size-4" /> Partager
                  </button>
                  <button className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all leading-none">
                    <Settings className="size-4" />
                  </button>
                </div>
             </div>
          </div>
        </motion.section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[32px] p-8 flex flex-col gap-8 border-white/5 shadow-2xl"
            >
              <h3 className="text-white font-black uppercase italic tracking-[0.2em] text-[10px] flex items-center gap-3">
                 <BarChart3 className="size-4 text-primary" /> Progression Niveau Otaku
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Vers Niveau {(user?.level || 1) + 1}</span>
                   <span className="text-white font-black italic text-sm leading-none">{(user?.xp || 0).toLocaleString()} XP</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="h-full premium-gradient rounded-full relative shadow-[0_0_15px_rgba(140,43,238,0.5)]"
                   ></motion.div>
                </div>
                <p className="text-[9px] text-slate-500 text-center font-bold italic tracking-wide">Plus que {1000 - ((user?.xp || 0) % 1000)} XP pour le prochain rang</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[32px] p-8 flex flex-col gap-10 border-white/5 shadow-2xl relative overflow-hidden group"
            >
               <div className="absolute -top-24 -right-24 size-48 bg-primary/20 blur-[80px] group-hover:bg-primary/30 transition-colors"></div>
               <h3 className="text-white font-black uppercase italic tracking-[0.2em] text-[10px] flex items-center gap-3">
                 <Target className="size-4 text-primary" /> Expertise par Genre
               </h3>
                <div className="relative aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 border-[1px] border-white/5 rounded-full"></div>
                  <div className="absolute inset-8 border-[1px] border-white/5 rounded-full"></div>
                  <div className="absolute inset-16 border-[1px] border-white/5 rounded-full opacity-50"></div>
                  
                  {/* Dynamic Radar Chart */}
                  <svg className="size-full drop-shadow-[0_0_20px_rgba(140,43,238,0.4)] overflow-visible" viewBox="0 0 100 100">
                    {/* Background Hexagon (Static) */}
                    <polygon 
                       points="50,10 88,38 74,82 26,82 12,38" 
                       className="fill-white/5 stroke-white/10" 
                       strokeWidth="1" 
                    />
                    {/* User Expertise Polygon (Dynamic) */}
                    {(() => {
                        const centerX = 50;
                        const centerY = 50;
                        // Calculate points based on expertiseData (5 axes: 90, 162, 234, 306, 18 degrees)
                        const angles = [270, 342, 54, 126, 198]; // Adjust angles to match hexagon
                        const points = expertiseData.map((d, i) => {
                           const angle = (angles[i] * Math.PI) / 180;
                           const r = (d.value / 100) * 40; // Max radius 40
                           return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
                        }).join(" ");
                        
                        return (
                          <motion.polygon 
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            points={points} 
                            className="fill-primary/30 stroke-primary" 
                            strokeWidth="2" 
                          />
                        );
                    })()}

                  {/* Nodes at each point */}
                  {expertiseData.map((d, i) => {
                      const centerX = 50;
                      const centerY = 50;
                      const angles = [270, 342, 54, 126, 198];
                      const angle = (angles[i] * Math.PI) / 180;
                      const r = (d.value / 100) * 40;
                      return (
                        <motion.circle 
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + i * 0.1 }}
                          cx={centerX + r * Math.cos(angle)} 
                          cy={centerY + r * Math.sin(angle)} 
                          r="1.5"
                          className="fill-white shadow-[0_0_10px_white]"
                        />
                      );
                  })}
                  </svg>
                  
                  {/* Labels */}
                  <span className="absolute top-1 text-[7px] md:text-[8px] font-black text-white uppercase italic tracking-widest">{expertiseData[0].label}</span>
                  <span className="absolute top-[35%] -right-4 md:-right-6 text-[7px] md:text-[8px] font-black text-white uppercase italic tracking-widest">{expertiseData[1].label}</span>
                  <span className="absolute bottom-2 -right-4 md:-right-6 text-[7px] md:text-[8px] font-black text-white uppercase italic tracking-widest">{expertiseData[2].label}</span>
                  <span className="absolute bottom-2 -left-4 md:-left-6 text-[7px] md:text-[8px] font-black text-white uppercase italic tracking-widest">{expertiseData[3].label}</span>
                  <span className="absolute top-[35%] -left-4 md:-left-6 text-[7px] md:text-[8px] font-black text-white uppercase italic tracking-widest">{expertiseData[4].label}</span>
               </div>
               <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center glass-card p-3 rounded-xl border-white/5 text-[10px]">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Total Votes</span>
                    <span className="text-white font-black italic">{user?._count?.votes || 0}</span>
                  </div>
                  <div className="flex justify-between items-center glass-card p-3 rounded-xl border-white/5 text-[10px]">
                    <span className="text-slate-400 font-black uppercase tracking-widest">Quiz Tentés</span>
                    <span className="text-white font-black italic">{user?._count?.quizAttempts || 0}</span>
                  </div>
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[32px] p-8 flex flex-col gap-6 border-white/5 shadow-2xl"
            >
              <h3 className="text-white font-black uppercase italic tracking-[0.2em] text-[10px] flex items-center gap-3">
                 <Award className="size-4 text-primary" /> Badges de Gloire
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {user?.badges?.map((badge, i) => (
                  <motion.div 
                    key={badge.id} 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="aspect-square rounded-2xl flex items-center justify-center transition-all cursor-pointer border border-white/5 shadow-lg bg-primary/20"
                    title={badge.name}
                  >
                    <Trophy className="size-5 fill-primary text-primary" />
                  </motion.div>
                ))}
                {(user?.badges?.length || 0) === 0 && Array(4).fill(0).map((_, i) => (
                   <div key={i} className="aspect-square rounded-2xl flex items-center justify-center border border-white/5 bg-white/5 grayscale opacity-30">
                     <Shield className="size-5 text-slate-600" />
                   </div>
                ))}
              </div>
            </motion.div>

            {journeyProgress && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-[32px] p-8 border-primary/20 shadow-[0_20px_40px_-15px_rgba(140,43,238,0.2)] bg-primary/5 flex flex-col gap-6"
              >
                <div className="flex justify-between items-center">
                   <h3 className="text-white font-black uppercase italic tracking-[0.2em] text-[10px] flex items-center gap-3">
                     <Zap className="size-4 text-primary fill-primary" /> Défi Global en Cours
                   </h3>
                   <span className="text-[10px] font-black text-primary italic">{Math.round((journeyProgress.currentStep / (journeyProgress.sessionData?.questions?.length || 1)) * 100)}%</span>
                </div>
                
                <div className="space-y-4">
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${(journeyProgress.currentStep / (journeyProgress.sessionData?.questions?.length || 1)) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                      <Play className="size-4 fill-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-white uppercase italic truncate">{(journeyProgress.sessionData?.questions?.[journeyProgress.currentStep]?.animeTitle) || "En cours..."}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Question {journeyProgress.currentStep + 1} / {journeyProgress.sessionData?.questions?.length || 30}</p>
                    </div>
                  </div>
                  <Link 
                    href="/quizzes"
                    className="w-full py-4 rounded-xl bg-primary text-white font-black italic uppercase text-[9px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all"
                  >
                    CONTINUER <ChevronRight className="size-3" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Activity Column */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-[32px] p-8 flex flex-col gap-4 border-white/5 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 size-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"></div>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] relative z-10">VOTES TOTAUX</span>
                <div className="flex items-end gap-3 relative z-10">
                   <span className="text-5xl font-black text-white italic tracking-tighter">{user?._count?.votes || 0}</span>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-[32px] p-8 flex flex-col gap-4 border-white/5 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 size-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"></div>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] relative z-10">EXPERIENCE TOTALE</span>
                <div className="flex items-end gap-3 relative z-10">
                  <span className="text-5xl font-black text-white italic tracking-tighter">{(user?.xp || 0).toLocaleString()}</span>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-8">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                  <Heart className="size-6 text-primary fill-primary" /> Vos derniers votes
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {user?.votes?.map((v, idx) => (
                   <motion.div 
                     key={v.id}
                     className="relative group rounded-3xl overflow-hidden aspect-[3/4] border border-white/5 shadow-2xl"
                   >
                     {v.anime.imageUrl && (
                       <Image 
                         src={v.anime.imageUrl} 
                         alt={v.anime.title} 
                         fill
                         className="object-cover transition-transform duration-700 group-hover:scale-110" 
                       />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                     <div className="absolute bottom-6 left-6 right-6 z-20">
                        <h4 className="text-lg font-black text-white italic uppercase leading-none truncate tracking-tighter mb-1">{v.anime.title}</h4>
                        <span className="text-[8px] text-primary font-bold uppercase tracking-[0.2em]">CHOIX DU COMBATANT</span>
                     </div>
                   </motion.div>
                 ))}
                 {(user?.votes?.length || 0) === 0 && (
                   <div className="col-span-full py-12 text-center text-slate-500 font-black uppercase tracking-[0.2em] italic text-[10px]">
                     Aucun vote enregistré pour le moment.
                   </div>
                 )}
               </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card border-white/5 rounded-[40px] p-10 flex flex-col gap-10 shadow-2xl relative overflow-hidden"
            >
              <h3 className="text-xl font-black text-white italic uppercase tracking-[0.2em] flex items-center gap-4 relative z-10 text-[12px]">
                 <Activity className="size-5 text-primary" /> Activité Récente
              </h3>
              <div className="flex flex-col gap-10 relative z-10">
                {user?.quizAttempts?.map((attempt, idx) => (
                  <div key={attempt.id} className="flex gap-8 group">
                     <div className="flex flex-col items-center">
                        <div className="size-10 rounded-2xl flex items-center justify-center bg-green-500/20 text-green-500">
                          <CheckCircle2 className="size-4" />
                        </div>
                        {idx !== (user?.quizAttempts?.length || 0) - 1 && <div className="w-0.5 flex-1 bg-white/5 my-3"></div>}
                     </div>
                     <div className="flex-1 pb-2">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                           <h4 className="text-white font-black italic uppercase text-sm tracking-tight group-hover:text-primary transition-colors">{attempt.quiz.title} Complété</h4>
                           <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">RÉCENT</span>
                        </div>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed tracking-wide">Score de {attempt.score}%</p>
                     </div>
                  </div>
                ))}
                {(user?.quizAttempts?.length || 0) === 0 && (
                   <div className="text-slate-500 font-black uppercase tracking-[0.2em] italic text-[10px]">L&apos;histoire de vos accomplissements s&apos;écrira ici.</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
