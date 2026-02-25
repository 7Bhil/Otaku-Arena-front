"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Zap, Play, Trophy, Brain, X, CheckCircle, AlertCircle, ChevronRight, Shield } from "lucide-react";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [resumableSession, setResumableSession] = useState(null);
  const [roadmap, setRoadmap] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, openLogin } = useAuth();
  useEffect(() => {
    fetch("/api/quizzes")
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);
        setLoading(false);
      });

    // Vérifier s'il y a une session en cours
    const saved = localStorage.getItem("otaku_quiz_progress");
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        if (progress.userId === user?.id || progress.userId === user?.username) {
           setResumableSession(progress);
           if (progress.sessionData?.roadmap) {
             setRoadmap(progress.sessionData.roadmap);
           }
        }
      } catch (e) {
        localStorage.removeItem("otaku_quiz_progress");
      }
    }
  }, [user]);

  const startGlobalChallenge = async (force = false) => {
    if (!user) {
      openLogin();
      return;
    }

    if (resumableSession && !force) {
      setShowConfirm(true);
      return;
    }

    setShowConfirm(false);
    setLoading(true);
    try {
      const res = await fetch("/api/quizzes/session");
      const data = await res.json();
      setActiveSession(data);
      setRoadmap(data.roadmap || []);
      // Nettoyer l'ancienne progression si on force un nouveau parcours
      localStorage.removeItem("otaku_quiz_progress");
      setResumableSession(null);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const startIndividualQuiz = async (quizId) => {
    if (!user) {
      openLogin();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      const data = await res.json();
      setActiveSession({ ...data, isIndividual: true });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="relative pt-32 pb-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 hero-glow -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-12">
          {/* Header & Global Challenge CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-10 md:gap-12 border-white/5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-96 bg-primary/20 blur-[120px] -mr-48 -mt-48"></div>
            
            <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <Zap className="size-3 fill-primary" /> Mode Compétitif
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Défi <span className="text-primary italic">Global</span></h1>
              <p className="text-slate-400 font-medium leading-relaxed max-w-xl">
                Affrontez l&apos;Arène avec une session intense de **30 questions aléatoires** sur les 100 meilleures franchises. Saurez-vous atteindre le score parfait ?
              </p>
              
                <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                  <button 
                    onClick={() => startGlobalChallenge(false)}
                    className="bg-primary hover:bg-primary/90 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-primary/40 transition-all flex items-center gap-4 italic uppercase text-sm tracking-[0.2em] hover:scale-105 active:scale-95"
                  >
                    Nouveau Parcours (30 Q) <Play className="size-5 fill-white" />
                  </button>
                  {resumableSession && (
                    <button 
                      onClick={() => {
                        setActiveSession({
                          ...resumableSession.sessionData,
                          initialStep: resumableSession.currentStep,
                          initialScore: resumableSession.score
                        });
                        setRoadmap(resumableSession.sessionData?.roadmap || []);
                        setResumableSession(null);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-orange-500/40 transition-all flex items-center gap-4 italic uppercase text-sm tracking-[0.2em] hover:scale-105 active:scale-95 border border-orange-400/30"
                    >
                      Continuer le Parcours ({resumableSession.currentStep + 1}/{resumableSession.sessionData.questions.length}) <ChevronRight className="size-5" />
                    </button>
                  )}
                </div>

                {/* Confirm Dialog */}
                {showConfirm && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="mt-6 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
                   >
                     <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                           <AlertCircle className="size-5" />
                        </div>
                        <div className="text-left">
                           <p className="text-white font-black uppercase italic text-xs">Parcours en cours détecté</p>
                           <p className="text-[10px] text-slate-400 font-bold">Voulez-vous abandonner votre progression actuelle ?</p>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => setShowConfirm(false)}
                          className="px-6 py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase text-slate-400 hover:text-white transition-colors"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={() => startGlobalChallenge(true)}
                          className="px-6 py-3 rounded-xl bg-red-500 text-[10px] font-black uppercase text-white hover:bg-red-600 transition-colors"
                        >
                          Abandonner & Recommencer
                        </button>
                     </div>
                   </motion.div>
                )}

                {/* Roadmap Visualizer */}
                {roadmap.length > 0 && !activeSession && (
                  <div className="pt-8 space-y-4">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">Votre Parcours Actuel</span>
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                      {roadmap.map((item, idx) => {
                        const isResumable = resumableSession;
                        const currentGlobalStep = isResumable ? resumableSession.currentStep : 0;
                        
                        // Calculer si l'anime est complété
                        let accumulated = 0;
                        let isCompleted = false;
                        let isCurrent = false;
                        
                        for (let i = 0; i < idx; i++) accumulated += roadmap[i].questionCount;
                        if (currentGlobalStep >= accumulated + roadmap[idx].questionCount) isCompleted = true;
                        if (currentGlobalStep >= accumulated && currentGlobalStep < accumulated + roadmap[idx].questionCount) isCurrent = true;

                        return (
                          <div key={idx} className="flex items-center gap-3 shrink-0">
                            <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-3 transition-all ${isCompleted ? 'bg-green-500/10 border-green-500/50 text-green-500' : (isCurrent ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 text-slate-500')}`}>
                              {isCompleted ? <CheckCircle className="size-3.5" /> : <div className="size-2 rounded-full bg-current opacity-50" />}
                              <span className="text-[10px] font-black uppercase italic tracking-wider whitespace-nowrap">{item.title}</span>
                            </div>
                            {idx < roadmap.length - 1 && <div className="w-4 h-px bg-white/10" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 bg-white/5 p-8 md:p-10 rounded-[40px] border border-white/10 backdrop-blur-sm w-full md:w-auto">
              <div className="size-16 md:size-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-xl border border-primary/20">
                <Trophy className="size-8 md:size-10 fill-primary" />
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">XP Bonus Défi</span>
                <span className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter">+500 XP</span>
              </div>
            </div>
          </motion.div>

          {/* Global Challenge Roadmap is now the only way to play */}
          <div className="mt-20">
            {/* Si on veut rajouter des infos ou des stats ici plus tard */}
          </div>
        </div>
      </div>

      {/* Quiz Player Modal */}
      <AnimatePresence>
        {activeSession && (
          <QuizPlayer 
            sessionData={activeSession} 
            user={user} 
            initialStep={activeSession.initialStep || 0}
            initialScore={activeSession.initialScore || 0}
            onClose={() => {
              setActiveSession(null);
              // Actualiser pour voir si une session a été mise en pause
              const saved = localStorage.getItem("otaku_quiz_progress");
              if (saved) setResumableSession(JSON.parse(saved));
              else setResumableSession(null);
            }} 
            onComplete={() => {
              setActiveSession(null);
              setResumableSession(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizPlayer({ sessionData, user, onClose, onComplete, initialStep = 0, initialScore = 0 }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [score, setScore] = useState(initialScore);
  const accumulatedScore = useRef(initialScore);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [xpGained, setXpGained] = useState(0);

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(idx);
    const correct = idx === sessionData.questions[currentStep].answer;
    setIsCorrect(correct);
    
    let currentScoreAfterAnswer = accumulatedScore.current;
    if (correct) {
      accumulatedScore.current += 1;
      currentScoreAfterAnswer = accumulatedScore.current;
      setScore(accumulatedScore.current);
    }

    setTimeout(() => {
      const nextStep = currentStep + 1;
      const isLastStep = currentStep === sessionData.questions.length - 1;

      if (!isLastStep) {
        setCurrentStep(nextStep);
        setSelectedAnswer(null);
        setIsCorrect(null);
        
        // Sauvegarder la progression
        localStorage.setItem("otaku_quiz_progress", JSON.stringify({
          userId: user.id || user.username,
          sessionData,
          currentStep: nextStep,
          score: currentScoreAfterAnswer,
          lastUpdated: Date.now()
        }));
      } else {
        localStorage.removeItem("otaku_quiz_progress");
        submitResult(currentScoreAfterAnswer);
      }
    }, 1200);
  };

  const submitResult = async (finalRawScore) => {
    setIsFinished(true);
    // On s'assure d'utiliser le score passé en paramètre qui est le plus frais
    const finalScore = Math.round((finalRawScore / (sessionData?.questions?.length || 1)) * 100);
    
    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id || user.username, // Fallback si ID absent
          quizId: sessionData.id,
          score: finalScore
        })
      });
      const data = await res.json();
      setXpGained(data.xpGained);
      // onComplete a été déplacé vers le bouton de fermeture pour laisser l'utilisateur voir son score
    } catch (e) {
      console.error("Failed to submit score", e);
    }
  };

  if (!sessionData || !sessionData.questions) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto"
    >
      <div className="max-w-2xl w-full glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-12 relative border-white/10 shadow-3xl my-auto">
        <button 
          onClick={() => {
             // On ne supprime PLUS le progrès ici. 
             // On permet de quitter et de revenir plus tard.
             onClose();
          }} 
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="text-[10px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Conserver & Quitter</span>
          <X className="size-6" />
        </button>

        {!isFinished ? (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em]">
              <div className="text-primary flex items-center gap-2">
                <Brain className="size-4" /> Question {currentStep + 1} / {sessionData.questions.length}
              </div>
              {sessionData.questions[currentStep].animeTitle && (
                <div className="text-white bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 italic flex items-center gap-2 max-w-full sm:max-w-[250px] truncate">
                  <Zap className="size-3 fill-primary" /> {sessionData.questions[currentStep].animeTitle}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black text-white italic tracking-tight leading-tight">
                {sessionData.questions[currentStep].question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sessionData.questions[currentStep].options.map((opt, i) => (
                <button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(i)}
                  className={`group p-6 rounded-2xl border transition-all text-left font-bold text-sm flex items-center justify-between ${
                    selectedAnswer === i 
                      ? (isCorrect ? 'bg-green-500/20 border-green-500 text-green-500 shadow-lg shadow-green-500/10' : 'bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/10')
                      : (selectedAnswer !== null && i === sessionData.questions[currentStep].answer ? 'bg-green-500/10 border-green-500/50 text-green-500/50' : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 text-white/50 hover:text-white')
                  }`}
                >
                  {opt}
                  {selectedAnswer === i && (
                    isCorrect ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 space-y-10">
            <div className="size-24 bg-primary/20 rounded-[32px] flex items-center justify-center text-primary mx-auto shadow-2xl shadow-primary/20 border border-primary/20">
              <Trophy className="size-12 fill-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Défi Terminé !</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Tes résultats sont enregistrés dans l&apos;Arène</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="flex flex-col gap-1">
                <div className="text-4xl md:text-5xl font-black text-white italic">{score} / {sessionData.questions.length}</div>
                <div className="text-primary font-black uppercase tracking-[0.2em] text-[8px]">Bonnes Réponses</div>
              </div>
              <div className="hidden sm:block size-px h-12 bg-white/10"></div>
              <div className="flex flex-col gap-1">
                <div className="text-4xl md:text-5xl font-black text-primary italic">+{xpGained}</div>
                <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-[8px]">XP Gagnés</div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="bg-primary hover:bg-primary/90 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-primary/20 transition-all italic uppercase text-xs tracking-[0.2em] hover:scale-105 active:scale-95 w-full flex items-center justify-center gap-3"
            >
              RETOURNER AU HUB <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
