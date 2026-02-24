"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Zap, Play, Trophy, Brain, X, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [resumableSession, setResumableSession] = useState(null);
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
        }
      } catch (e) {
        localStorage.removeItem("otaku_quiz_progress");
      }
    }
  }, [user]);

  const startGlobalChallenge = async () => {
    if (!user) {
      openLogin();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quizzes/session");
      const data = await res.json();
      setActiveSession(data);
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
            className="glass-card p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-12 border-white/5 shadow-2xl relative overflow-hidden"
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
                  onClick={startGlobalChallenge}
                  className="bg-primary hover:bg-primary/90 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-primary/40 transition-all flex items-center gap-4 italic uppercase text-sm tracking-[0.2em] hover:scale-105 active:scale-95"
                >
                  Lancer le Défi (30 Questions) <Play className="size-5 fill-white" />
                </button>
                {resumableSession && (
                  <button 
                    onClick={() => {
                      setActiveSession({
                        ...resumableSession.sessionData,
                        initialStep: resumableSession.currentStep,
                        initialScore: resumableSession.score
                      });
                      setResumableSession(null);
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-orange-500/40 transition-all flex items-center gap-4 italic uppercase text-sm tracking-[0.2em] hover:scale-105 active:scale-95 border border-orange-400/30"
                  >
                    Reprendre ({resumableSession.currentStep + 1}/{resumableSession.sessionData.questions.length}) <ChevronRight className="size-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4 bg-white/5 p-10 rounded-[40px] border border-white/10 backdrop-blur-sm">
              <div className="size-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-xl border border-primary/20">
                <Trophy className="size-10 fill-primary" />
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">XP Bonus Défi</span>
                <span className="text-3xl font-black text-white italic uppercase tracking-tighter">+500 XP</span>
              </div>
            </div>
          </motion.div>

          {/* Individual Quizzes Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-widest flex items-center gap-4">
              <Brain className="size-6 text-primary" /> Entraînement par Franchise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" className="col-span-full py-20 text-center flex flex-col items-center gap-6">
                    <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </motion.div>
                ) : (
                  quizzes.slice(0, 16).map((quiz, idx) => (
                    <motion.div 
                      key={quiz.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group glass-card rounded-3xl p-6 border-white/5 hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between"
                      onClick={() => startIndividualQuiz(quiz.id)}
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <h3 className="text-sm font-black text-white truncate uppercase italic tracking-tight">{quiz.title}</h3>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                          {quiz.difficulty} • +{quiz.xpReward} XP
                        </span>
                      </div>
                      <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all">
                        <Play className="size-3 fill-current" />
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
    >
      <div className="max-w-2xl w-full glass-card rounded-[40px] p-8 md:p-12 relative border-white/10 shadow-3xl">
        <button 
          onClick={async () => {
             if (score > 0 && !isFinished) {
               // Sauvegarder ce qu'on a fait avant de partir
               await submitResult(accumulatedScore.current);
             }
             localStorage.removeItem("otaku_quiz_progress");
             onClose();
          }} 
          className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="text-[10px] uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Quitter</span>
          <X className="size-6" />
        </button>

        {!isFinished ? (
          <div className="space-y-12">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em]">
              <div className="text-primary flex items-center gap-2">
                <Brain className="size-3" /> Question {currentStep + 1} / {sessionData.questions.length}
              </div>
              {sessionData.questions[currentStep].animeTitle && (
                <div className="text-slate-500 italic max-w-[200px] truncate text-right">
                  Catégorie: {sessionData.questions[currentStep].animeTitle}
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
            
            <div className="flex items-center justify-center gap-12">
              <div className="flex flex-col gap-1">
                <div className="text-5xl font-black text-white italic">{score} / {sessionData.questions.length}</div>
                <div className="text-primary font-black uppercase tracking-[0.2em] text-[8px]">Bonnes Réponses</div>
              </div>
              <div className="size-px h-12 bg-white/10"></div>
              <div className="flex flex-col gap-1">
                <div className="text-5xl font-black text-primary italic">+{xpGained}</div>
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
