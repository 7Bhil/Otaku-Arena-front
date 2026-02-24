"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { getPopularAnimesBatch } from "@/lib/jikan";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Zap, ChevronRight, Shield, Heart, Share2, Info, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Battle() {
  const [challenger, setChallenger] = useState(null);
  const [defender, setDefender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { user, openLogin } = useAuth();
  
  // Pool management
  const animePool = useRef([]);
  const poolPage = useRef(1);
  const isFetchingPool = useRef(false);

  const fillPool = useCallback(async () => {
    if (isFetchingPool.current) return;
    isFetchingPool.current = true;
    
    try {
      // Pick a random page from the top 20 (Top 500 animes)
      const randomPage = Math.floor(Math.random() * 20) + 1;
      const batch = await getPopularAnimesBatch(randomPage);
      if (batch && batch.length > 0) {
        // Shuffle the batch
        const shuffled = [...batch].sort(() => Math.random() - 0.5);
        animePool.current = [...animePool.current, ...shuffled];
        poolPage.current += 1;
      }
    } catch (error) {
      console.error("Failed to fill pool:", error);
    } finally {
      isFetchingPool.current = false;
    }
  }, []);

  const getNextMatchup = useCallback(() => {
    if (animePool.current.length < 5) {
      fillPool();
    }

    if (animePool.current.length < 2) {
      // Still too small, can't pick yet
      return null;
    }

    // Pick two and remove them from pool
    const char1 = animePool.current.shift();
    const char2 = animePool.current.shift();
    
    return [char1, char2];
  }, [fillPool]);

  const refreshMatchup = useCallback(() => {
    const next = getNextMatchup();
    if (next) {
      setChallenger(next[0]);
      setDefender(next[1]);
      setLoading(false);
    } else {
      setLoading(true);
      // Try again in a bit
      setTimeout(refreshMatchup, 500);
    }
  }, [getNextMatchup]);

  useEffect(() => {
    const init = async () => {
      await fillPool();
      refreshMatchup();
    };
    init();
  }, [fillPool, refreshMatchup]);

  const vote = async (winner, loser) => {
    if (voting) return;
    
    if (!user) {
      openLogin();
      return;
    }

    setVoting(true);

    try {
      // We don't await the fetch to make the UI feel instant
      fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winnerId: winner.mal_id,
          loserId: loser.mal_id,
          userId: user.id,
          animeDetails: {
            winner: {
              title: winner.title,
              imageUrl: winner.images.webp.large_image_url || winner.images.webp.image_url,
              type: 'Anime'
            },
            loser: {
              title: loser.title,
              imageUrl: loser.images.webp.large_image_url || loser.images.webp.image_url,
              type: 'Anime'
            }
          }
        })
      });

      // Prepare next matchup immediately
      refreshMatchup();
    } catch (error) {
      console.error("Failed to submit vote:", error);
      refreshMatchup();
    } finally {
      // Add a small delay to prevent double voting and allow animation to breathe
      setTimeout(() => setVoting(false), 300);
    }
  };

  return (
    <div className="relative pt-32 pb-40 overflow-hidden min-h-screen flex flex-col items-center">
      <div className="absolute inset-0 hero-glow -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 space-y-4 px-6"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Le Meilleur <span className="text-primary italic">Anime</span></h1>
        <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px] md:text-xs tracking-[0.4em]">Élisez votre favori pour grimper au classement</p>
      </motion.div>

      <div className="w-full max-w-7xl px-6 md:px-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6"
            >
              <Loader2 className="size-16 text-primary animate-spin" />
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] italic">Invocation des challengers populaires...</p>
            </motion.div>
          ) : (
            <>
              {/* Challenger */}
              <motion.div 
                key={challenger?.mal_id}
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="group relative w-full max-w-[400px] aspect-[3/4] rounded-[48px] overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-primary/40"
              >
                <Image 
                  src={challenger?.images?.webp?.large_image_url || challenger?.images?.webp?.image_url} 
                  alt={challenger?.title} 
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                <div className="absolute bottom-10 left-10 right-10 z-20 space-y-4">
                  <span className="bg-primary/20 backdrop-blur-md border border-primary/40 text-primary text-[10px] font-black px-4 py-1.5 rounded-full inline-block uppercase tracking-widest">RANK #{challenger?.rank || '?'}</span>
                  <h2 className="text-3xl font-black text-white italic uppercase leading-none tracking-tighter truncate" title={challenger?.title}>{challenger?.title}</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => vote(challenger, defender)}
                      disabled={voting}
                      className="flex-1 bg-white text-[#050505] font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] italic hover:scale-105 transition-transform shadow-xl shadow-white/10 disabled:opacity-50"
                    >
                      {voting ? "Vote..." : "Voter"}
                    </button>
                    <button className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"><Info className="size-4" /></button>
                  </div>
                </div>
              </motion.div>

              {/* VS Divider */}
              <div className="relative z-10">
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="size-24 md:size-32 bg-primary rounded-[32px] flex items-center justify-center shadow-[0_0_50px_rgba(140,43,238,0.5)] border-4 border-background italic font-black text-4xl md:text-5xl text-white tracking-widest"
                >
                  VS
                </motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10 hidden lg:block"></div>
              </div>

              {/* Defender */}
              <motion.div 
                key={defender?.mal_id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="group relative w-full max-w-[400px] aspect-[3/4] rounded-[48px] overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-primary/40"
              >
                <Image 
                  src={defender?.images?.webp?.large_image_url || defender?.images?.webp?.image_url} 
                  alt={defender?.title} 
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                <div className="absolute bottom-10 left-10 right-10 z-20 space-y-4">
                  <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black px-4 py-1.5 rounded-full inline-block uppercase tracking-widest">RANK #{defender?.rank || '?'}</span>
                  <h2 className="text-3xl font-black text-white italic uppercase leading-none tracking-tighter truncate" title={defender?.title}>{defender?.title}</h2>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => vote(defender, challenger)}
                      disabled={voting}
                      className="flex-1 bg-primary text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] italic hover:scale-105 transition-transform shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                      {voting ? "Vote..." : "Voter"}
                    </button>
                    <button className="size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"><Info className="size-4" /></button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 flex items-center gap-12"
      >
        <button 
          onClick={refreshMatchup}
          className="text-slate-500 hover:text-white font-black uppercase tracking-[0.4em] text-[10px] transition-colors flex items-center gap-3 italic group"
        >
          Passer ce Duel <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
