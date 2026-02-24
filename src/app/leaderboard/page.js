"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import UserAvatar from "@/components/UserAvatar";
import { 
  Trophy, Medal, Target, Flame, Search, Filter, 
  ChevronUp, ChevronDown, Award, Zap, Star, Shield,
  Activity, Crown, Users, TrendingUp, Tv, User
} from "lucide-react";

// Cache global pour éviter les flashs de chargement lors du switch d'onglets
const leaderboardCache = {
  users: null,
  animes: null,
  lastFetched: { users: 0, animes: 0 }
};

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

const SkeletonPodium = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`glass-card p-10 rounded-[48px] border-white/5 flex flex-col items-center gap-8 bg-white/5 animate-pulse ${i === 2 ? 'md:-translate-y-12 h-[450px]' : 'h-[380px]'}`}>
        <div className="size-32 md:size-40 rounded-[40px] bg-white/5 shadow-2xl"></div>
        <div className="w-3/4 h-6 bg-white/5 rounded-full"></div>
        <div className="w-1/2 h-4 bg-white/5 rounded-full"></div>
        <div className="w-full h-12 bg-white/5 rounded-3xl"></div>
      </div>
    ))}
  </div>
);

const SkeletonTable = () => (
  <div className="space-y-4 p-8">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex gap-8 items-center bg-white/5 p-6 rounded-3xl animate-pulse">
        <div className="w-10 h-6 bg-white/5 rounded-full"></div>
        <div className="size-14 rounded-2xl bg-white/5"></div>
        <div className="flex-1 h-6 bg-white/5 rounded-full"></div>
        <div className="w-24 h-6 bg-white/5 rounded-full"></div>
      </div>
    ))}
  </div>
);

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('animes'); // 'users' or 'animes'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async (isInitial = false) => {
    const now = Date.now();
    const hasCache = leaderboardCache[activeTab] && (now - leaderboardCache.lastFetched[activeTab] < CACHE_DURATION);

    if (hasCache) {
      setData(leaderboardCache[activeTab]);
      setLoading(false);
      // On rafraîchit en arrière-plan si on veut être ultra-frais
      return;
    }

    setLoading(true);
    setData([]); // Nettoyer pour forcer le skeleton
    
    try {
      const endpoint = activeTab === 'users' ? '/api/users/leaderboard' : '/api/votes';
      const res = await fetch(endpoint);
      const result = await res.json();
      
      if (Array.isArray(result)) {
        leaderboardCache[activeTab] = result;
        leaderboardCache.lastFetched[activeTab] = now;
        setData(result);
      } else {
        console.error("API did not return an array:", result);
        setData([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }, [activeTab]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const filteredData = Array.isArray(data) ? data.filter(item => {
    const name = activeTab === 'users' ? (item.username || "") : (item.title || "");
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-glow -z-10 opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <span className="bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] italic border border-primary/20 shadow-lg shadow-primary/10">HALL OF FAME</span>
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="size-6 rounded-full border-2 border-background bg-slate-800"></div>
                ))}
              </div>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.8]">
              CLASSEMENT <br /><span className="text-primary premium-text-glow">{activeTab === 'users' ? 'DES OTAKUS' : 'DES ANIMES'}</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-lg font-medium italic">
              {activeTab === 'users' 
                ? "L'élite des Otakus. Gravissez les échelons en votant dans l'Arène et en réussissant les quiz."
                : "Les animes les plus plébiscités par la communauté. Découvrez qui domine l'Arène cette semaine."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col md:flex-row gap-6"
          >
             {/* Tabs Toggle */}
             <div className="bg-white/5 p-1.5 rounded-[24px] border border-white/10 flex gap-2">
                <button 
                  onClick={() => setActiveTab('animes')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'animes' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Tv className="size-4" /> Animes
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Users className="size-4" /> Otakus
                </button>
             </div>

             <div className="relative group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-slate-500 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder={activeTab === 'users' ? "Rechercher un Otaku..." : "Rechercher un Anime..."}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white/5 border border-white/10 text-white pl-16 pr-10 py-4.5 rounded-[24px] w-full md:w-[280px] focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-bold italic text-sm placeholder:text-slate-600 shadow-2xl"
               />
             </div>
          </motion.div>
        </div>

        {/* Podium Section */}
        {loading ? <SkeletonPodium /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-end">
            <AnimatePresence mode="wait">
              {filteredData.slice(0, 3).map((item, idx) => {
                const name = activeTab === 'users' ? (item.username || "Otaku Anonyme") : (item.title || "Anime Inconnu");
                const image = (activeTab === 'users' ? item.avatar : item.imageUrl) || null;
                const statLabel = activeTab === 'users' ? 'XP' : 'VOTES';
                const statValue = activeTab === 'users' ? (item.xp || 0).toLocaleString() : (item._count?.votes || 0).toLocaleString();

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative glass-card p-10 rounded-[48px] border-white/5 flex flex-col items-center gap-8 ${idx === 0 ? 'md:order-2 md:-translate-y-12 border-primary/20 shadow-[0_30px_60px_-15px_rgba(140,43,238,0.3)] bg-primary/5' : (idx === 1 ? 'md:order-1' : 'md:order-3')} bg-white/5 shadow-2xl transition-all hover:bg-white/[0.07]`}
                  >
                    {idx === 0 && <Crown className="absolute -top-8 size-16 text-primary fill-primary animate-bounce drop-shadow-[0_0_15px_rgba(140,43,238,0.5)]" />}
                    
                    <div className="relative">
                      {activeTab === 'users' ? (
                        <div className="relative z-10">
                          <UserAvatar name={name} size="lg" />
                        </div>
                      ) : (
                        <div className={`size-32 md:size-40 rounded-[40px] border-[6px] ${idx === 0 ? 'border-primary' : (idx === 1 ? 'border-slate-400' : 'border-amber-600')} overflow-hidden shadow-2xl relative z-10 p-1 bg-background flex items-center justify-center`}>
                          {image ? (
                            <Image src={image} alt={name} fill className="object-cover rounded-[34px]" />
                          ) : (
                            <Award className="size-16 text-slate-700" />
                          )}
                        </div>
                      )}
                      <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl font-black text-xs italic ${idx === 0 ? 'bg-primary' : 'bg-slate-800'} text-white shadow-xl z-20 whitespace-nowrap border-2 border-background`}>
                        # {idx + 1}
                      </div>
                    </div>

                    <div className="text-center space-y-2">
                      <h2 className={`text-xl font-black text-white italic uppercase tracking-tighter line-clamp-2 min-h-[3rem] ${idx === 0 ? 'text-2xl' : ''}`}>{name}</h2>
                      <div className="flex items-center justify-center gap-3">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{statLabel}</span>
                          <span className="text-primary font-black italic">{statValue}</span>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center group-hover:bg-white/10 transition-colors">
                          <span className="text-primary font-black italic text-sm">{idx === 0 ? 'Indétrônable' : 'En pleine ascension'}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* List Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[40px] border-white/5 overflow-hidden shadow-2xl bg-white/[0.01]"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic w-24">Rang</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{activeTab === 'users' ? 'Utilisateur' : 'Anime'}</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Statut</th>
                  <th className="px-10 py-8 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{activeTab === 'users' ? 'Niveau' : 'Score'}</th>
                  <th className="px-10 py-8 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{activeTab === 'users' ? 'XP Total' : 'Total Votes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {loading ? (
                   <tr>
                     <td colSpan="5" className="p-0 border-none">
                       <SkeletonTable />
                     </td>
                   </tr>
                ) : (
                  filteredData.slice(3).map((item, idx) => {
                    const name = activeTab === 'users' ? (item.username || "Otaku Anonyme") : (item.title || "Anime Inconnu");
                    const image = (activeTab === 'users' ? item.avatar : item.imageUrl) || null;
                    const detailValue = activeTab === 'users' ? `LVL ${item.level || 1}` : `${Math.round((item._count?.votes || 0) * 1.5)}%`;
                    const statValue = activeTab === 'users' ? (item.xp || 0).toLocaleString() : (item._count?.votes || 0).toLocaleString();

                    return (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        <td className="px-10 py-8">
                          <span className="text-slate-500 font-black italic"># {idx + 4}</span>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            {activeTab === 'users' ? (
                              <UserAvatar name={name} size="sm" />
                            ) : (
                              <div className={`relative w-14 h-20 rounded-xl overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg bg-white/5 flex items-center justify-center`}>
                                {image ? (
                                  <Image src={image} alt={name} fill className="object-cover" />
                                ) : (
                                  <Star className="size-5 text-slate-700" />
                                )}
                              </div>
                            )}
                            <span className="text-white font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">{name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-2">
                              <div className="size-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(140,43,238,0.8)]"></div>
                              <span className="text-[9px] text-primary font-black uppercase tracking-widest italic">{activeTab === 'users' ? 'En ligne' : 'Top Tendance'}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="bg-white/5 border border-white/5 px-4 py-1.5 rounded-full inline-block">
                              <span className="text-white font-black italic text-[10px] tracking-tighter uppercase whitespace-nowrap">{detailValue}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <span className="text-white font-black italic tracking-wide">{statValue}</span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
                {!loading && filteredData.length === 0 && (
                   <tr>
                     <td colSpan="5" className="py-20 text-center text-slate-500 font-black uppercase italic tracking-[0.2em] text-[10px]">
                        Aucun résultat trouvé pour &quot;{searchTerm}&quot;
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
