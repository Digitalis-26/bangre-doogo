'use client';

import React from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  GraduationCap,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HeroSectionProps {
  onExploreRole: (role: 'director' | 'teacher' | 'parent') => void;
  onOpenPricing: () => void;
  onOpenAiAssistant: () => void;
}

export function HeroSection({ onExploreRole, onOpenPricing, onOpenAiAssistant }: HeroSectionProps) {
  const { currentRole, currentSchool } = useSchool();

  return (
    <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden mb-8 border border-emerald-900/40">
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
          <span>SaaS Éducatif Déployable au Burkina Faso & Afrique de l'Ouest</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          La communication école-parents, simplifiée.
        </h1>

        {/* Subtitle concise */}
        <p className="text-sm sm:text-base text-slate-300 max-w-xl">
          Circulaires avec accusé de réception, pointage direct des absences et notifications instantanées pour les familles.
        </p>

        {/* CTA Button Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            onClick={() => onExploreRole('parent')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              currentRole === 'parent'
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Espace Parent</span>
          </button>

          <button
            onClick={() => onExploreRole('teacher')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              currentRole === 'teacher'
                ? 'bg-white text-slate-950 ring-2 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <span>Espace Enseignant</span>
          </button>

          <button
            onClick={() => onExploreRole('director')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              currentRole === 'director'
                ? 'bg-white text-slate-950 ring-2 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
            }`}
          >
            <span>Direction</span>
          </button>

          <button
            onClick={onOpenPricing}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Tarifs B2B</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Proof / Value Metrics Row */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
              0 FCFA
            </div>
            <div className="text-slate-400 text-[11px]">
              Offre Découverte
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono tabular-nums">
              100%
            </div>
            <div className="text-slate-400 text-[11px]">
              Gratuit pour les parents
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tabular-nums">
              -70%
            </div>
            <div className="text-slate-400 text-[11px]">
              Frais de papier & tirages
            </div>
          </div>

          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tabular-nums">
              Instantané
            </div>
            <div className="text-slate-400 text-[11px]">
              Alertes SMS & notifications
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
