"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTopAnime, getRandomCharacter } from "@/lib/jikan";
import { motion } from "framer-motion";
import { Zap, Rocket, Trophy, Swords, Brain, ChevronRight, TrendingUp } from "lucide-react";

export default function Home() {
  const [topAnime, setTopAnime] = useState([]);
  const [featuredCharacters, setFeaturedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const [animeData, char1, char2] = await Promise.all([
          getTopAnime(5),
          getRandomCharacter(),
          getRandomCharacter()
        ]);
        if (mounted) {
          setTopAnime(animeData);
          setFeaturedCharacters([char1, char2]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-glow -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Saison 4 en cours
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] text-white uppercase">
              L&apos;ARÈNE <br />
              <span className="text-transparent bg-clip-text premium-gradient">ANIME ULTIME.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Affrontez-vous dans des combats d&apos;anime épiques, testez vos connaissances avec des quiz thématiques et grimpez dans le classement mondial pour devenir l&apos;Otaku ultime.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/battle"
                className="group relative bg-primary hover:scale-105 transition-transform text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-3 shadow-xl shadow-primary/20"
              >
                Commencer le Mash
                <Rocket className="size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/leaderboard"
                className="px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm border border-primary/20 hover:bg-primary/5 transition-all flex items-center gap-3 text-white"
              >
                Voir le classement
                <Trophy className="size-5" />
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-60">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white italic">1.2M+</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Votes exprimés</div>
              </div>
              <div className="w-px h-8 bg-primary/20"></div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white italic">45k</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Utilisateurs actifs</div>
              </div>
              <div className="w-px h-8 bg-primary/20"></div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white italic">800+</div>
                <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">Quiz</div>
              </div>
            </div>
          </motion.div>

          {/* Face-off Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full max-w-xl"
          >
            <div className="relative grid grid-cols-2 gap-4 p-4 glass-card rounded-2xl overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="vs-badge size-16 rounded-full border-4 border-background flex items-center justify-center shadow-2xl">
                  <span className="text-white font-black italic text-2xl tracking-tighter">VS</span>
                </div>
              </div>
              
              {loading ? (
                <div className="col-span-2 h-[450px] flex items-center justify-center text-slate-500 italic font-medium">Chargement des challengers...</div>
              ) : (
                featuredCharacters.map((char, idx) => char && (
                  <div key={idx} className="group relative h-[450px] rounded-xl overflow-hidden cursor-pointer border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
                    <Image 
                      src={char.images.webp.image_url} 
                      alt={char.name} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${idx === 0 ? 'text-primary' : 'text-accent-blue'}`}>
                        {idx === 0 ? 'Challenger' : 'Défenseur'}
                      </span>
                      <h3 className="text-xl font-black text-white truncate italic uppercase tracking-tight">{char.name}</h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Leaderboard Snippet */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter italic">
                LEADERS DU <br /> <span className="text-primary italic">MASH ACTUEL</span>
              </h2>
              <p className="text-slate-400 leading-relaxed font-medium">
                Ces titres d&apos;anime d&apos;élite dominent actuellement l&apos;arène. Votez aujourd&apos;hui pour changer l&apos;histoire.
              </p>
              <Link href="/leaderboard" className="w-fit flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                Voir le classement complet <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="lg:col-span-3 glass-card rounded-3xl overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">
                      <th className="px-8 py-6">Rang</th>
                      <th className="px-4 py-6">Anime</th>
                      <th className="px-4 py-6 text-right">Points</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {loading ? (
                      <tr><td colSpan="3" className="text-center py-20 text-slate-500 italic font-medium">Récupération des rangs...</td></tr>
                    ) : (
                      topAnime.slice(0, 3).map((anime, idx) => (
                        <tr key={anime.mal_id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black italic ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500 gold-glow' : idx === 1 ? 'bg-slate-400/20 text-slate-400' : 'bg-orange-600/20 text-orange-600'}`}>
                              {idx + 1}
                            </div>
                          </td>
                          <td className="px-4 py-6">
                            <div className="flex items-center gap-4">
                              <div className="relative size-12 rounded-xl overflow-hidden border border-white/10 group-hover:scale-110 transition-transform">
                                <Image src={anime.images.webp.small_image_url} alt={anime.title} fill className="object-cover" />
                              </div>
                              <span className="font-black text-white uppercase italic truncate max-w-[200px] tracking-tight">{anime.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-right font-black text-primary italic text-lg tracking-tighter">
                            {((anime.score || 0) * 15000).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 bg-white/[0.02] flex justify-center border-t border-white/5">
                <Link href="/leaderboard" className="text-[10px] text-slate-500 hover:text-white uppercase tracking-[0.3em] font-black transition-colors">
                  Voir tout le classement
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Path Selection */}
        <section className="py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">CHOISISSEZ VOTRE VOIE</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Link 
              href="/battle"
              className="glass-card p-10 rounded-3xl group hover:border-primary/50 transition-all cursor-pointer flex flex-col items-start text-left"
            >
              <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                <Swords className="size-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Face-à-face</h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">
                Deux titans entrent, un seul reste. Votez dans des duels à l&apos;aveugle pour déterminer le classement mondial de la communauté.
              </p>
              <div className="flex items-center text-primary font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-2 transition-all mt-auto">
                Prêt pour l&apos;arène ? ⚔️<ChevronRight className="size-4 ml-1" />
              </div>
            </Link>

            <Link 
              href="/quizzes"
              className="glass-card p-10 rounded-3xl group hover:border-accent-blue/50 transition-all cursor-pointer flex flex-col items-start text-left"
            >
              <div className="size-16 rounded-2xl bg-accent-blue/20 flex items-center justify-center text-accent-blue mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-accent-blue/10">
                <Brain className="size-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Quiz Otaku</h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">
                Testez vos connaissances sur l&apos;univers de l&apos;anime avec des quiz thématiques dynamiques. Du Shonen basique au Seinen obscur.
              </p>
              <div className="flex items-center text-accent-blue font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-2 transition-all mt-auto">
                Faire un Quiz <ChevronRight className="size-4 ml-1" />
              </div>
            </Link>

            <Link 
              href="/leaderboard"
              className="glass-card p-10 rounded-3xl group hover:border-white/30 transition-all cursor-pointer flex flex-col items-start text-left"
            >
              <div className="size-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-white/5">
                <Trophy className="size-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tight">Rang Mondial</h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">
                Gagnez des points pour chaque vote et quiz. Grimpez dans les rangs pour débloquer des cadres de profil et des badges exclusifs.
              </p>
              <div className="flex items-center text-white font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-2 transition-all mt-auto">
                Rang Mondial <ChevronRight className="size-4 ml-1" />
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
