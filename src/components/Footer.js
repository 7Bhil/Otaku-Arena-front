import React from "react";
import Link from "next/link";
import { Zap, Twitter, Disc as Discord, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-20 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="size-8 bg-primary rounded flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <Zap className="size-4 fill-white" />
              </div>
              <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
                Otaku <span className="text-primary">Mash</span>
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              L&apos;arène ultime pour les fans d&apos;anime pour exprimer leur passion à travers le vote et les défis de connaissances.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-primary transition-all hover:scale-110">
                <Twitter className="size-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-primary transition-all hover:scale-110">
                <Discord className="size-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-primary transition-all hover:scale-110">
                <Github className="size-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 italic uppercase tracking-widest text-xs">Plateforme</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="/battle" className="hover:text-primary transition-colors">Voter</Link></li>
              <li><Link href="/quizzes" className="hover:text-primary transition-colors">Quiz</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Classement</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 italic uppercase tracking-widest text-xs">Communauté</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Twitter</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Directives</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Événements</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2">
            <h4 className="text-white font-bold mb-6 italic uppercase tracking-widest text-xs">Rester informé</h4>
            <p className="text-slate-500 text-sm mb-4">Rejoignez notre newsletter pour les mises à jour de saison.</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-600" />
                <input 
                  type="email" 
                  placeholder="Adresse email" 
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-primary focus:border-primary outline-none text-white placeholder:text-slate-600"
                />
              </div>
              <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                S&apos;abonner
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
          <p>© 2024 Otaku Mash Arena. Tous les personnages sont la propriété de leurs studios respectifs.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions d&apos;utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
