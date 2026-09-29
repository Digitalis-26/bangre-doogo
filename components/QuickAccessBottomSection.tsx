'use client';

import React from 'react';
import Image from 'next/image';
import { useSchool } from '@/context/SchoolContext';
import {
  Bell,
  Clock,
  GraduationCap,
  MessageSquare,
  Search,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Sparkles,
} from 'lucide-react';

interface QuickAccessBottomSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenSmsSimulator?: () => void;
  onOpenAiAssistant?: () => void;
}

export function QuickAccessBottomSection({
  onNavigateTab,
  onOpenSmsSimulator,
  onOpenAiAssistant,
}: QuickAccessBottomSectionProps) {
  const { currentRole, currentSchool, announcements, attendance } = useSchool();

  const unreadAnnouncementsCount = announcements.filter((a) => !a.readByCurrentParent).length;
  const pendingAttendanceCount = attendance.filter((a) => (a.status === 'absent' || a.status === 'late') && !a.isJustified).length;

  const handleCardClick = (target: string) => {
    if (target === 'sms') {
      if (onOpenSmsSimulator) {
        onOpenSmsSimulator();
      } else {
        onNavigateTab('announcements');
      }
      return;
    }

    if (target === 'classes') {
      if (currentRole === 'parent' || currentRole === 'student') {
        onNavigateTab('dashboard');
      } else {
        onNavigateTab('classes');
      }
      return;
    }

    onNavigateTab(target);
  };

  const quickAccessItems = [
    {
      id: 'announcements',
      title: 'Communiqués',
      subtitle: 'Circulaires officielles, notes de service & informations de rentrée',
      icon: Bell,
      badge: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} nouveau${unreadAnnouncementsCount > 1 ? 'x' : ''}` : undefined,
      badgeColor: 'bg-amber-400 text-amber-950',
      actionLabel: 'Consulter',
      target: 'announcements',
    },
    {
      id: 'attendance',
      title: 'Absences & Retards',
      subtitle: 'Déclarer un retard, justifier une absence ou vérifier l’appel du jour',
      icon: Clock,
      badge: pendingAttendanceCount > 0 ? `${pendingAttendanceCount} en attente` : undefined,
      badgeColor: 'bg-red-400 text-red-950',
      actionLabel: 'Signaler',
      target: 'attendance',
    },
    {
      id: 'classes',
      title: currentRole === 'parent' ? 'Suivi & Scolarité' : 'Classes & Élèves',
      subtitle: currentRole === 'parent' ? 'Carnet scolaire, enfants rattachés & cours' : 'Registre d’appel, effectifs des divisions & emplois du temps',
      icon: GraduationCap,
      actionLabel: 'Accéder',
      target: 'classes',
    },
    {
      id: 'liaison',
      title: 'Cahier de Liaison',
      subtitle: 'Messagerie directe parents-enseignants & demandes de rendez-vous',
      icon: MessageSquare,
      actionLabel: 'Échanger',
      target: 'liaison',
    },
    {
      id: 'school_search',
      title: 'Trouver une École',
      subtitle: 'Annuaire national, inscriptions, cycles d’études et bourses scolaires',
      icon: Search,
      badge: 'Nouveau',
      badgeColor: 'bg-emerald-400 text-emerald-950',
      actionLabel: 'Rechercher',
      target: 'school_search',
    },
    {
      id: 'sms',
      title: 'Simulateur SMS & Alertes',
      subtitle: 'Diffusion d’urgences par SMS sans réseau internet ni data mobile',
      icon: Smartphone,
      actionLabel: 'Tester',
      target: 'sms',
    },
  ];

  return (
    <section className="mt-14 mb-8">
      {/* Outer Card with subtle golden / ochre warm frame & texture */}
      <div className="relative rounded-3xl bg-gradient-to-b from-amber-50/90 via-amber-50/50 to-orange-50/30 p-5 sm:p-8 lg:p-10 border border-amber-200/90 shadow-md overflow-hidden">
        {/* Decorative Golden / Ochre Traditional Accent Bar at Top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Ambient Warm Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section: Accès rapide with green bold title & decorative star line */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#154734] tracking-tight uppercase">
            Accès rapide
          </h2>

          {/* Decorative line with central star */}
          <div className="flex items-center justify-center gap-3 my-3">
            <span className="h-[2px] w-16 sm:w-28 bg-[#154734]" />
            <span className="text-amber-500 text-lg sm:text-xl font-bold leading-none select-none">★</span>
            <span className="h-[2px] w-16 sm:w-28 bg-[#154734]" />
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-medium">
            Accédez en un clic aux services essentiels de votre portail scolaire
          </p>
        </div>

        {/* Main Content Layout: Left welcoming woman portrait + Right White Card with 6 Dark Green Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
          {/* Left Column: Welcoming Educator Portrait */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-900 group min-h-[340px] sm:min-h-[400px]">
              {/* Image component */}
              <Image
                src="/acces_rapide_woman.jpg"
                alt="Éducatrice et conseillère ÉcoleConnect"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
                referrerPolicy="no-referrer"
                priority
              />

              {/* Gradient Dark Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#154734]/90 text-amber-300 backdrop-blur-md border border-emerald-500/30 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Portail Officiel</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md">
                  {currentSchool.name}
                </span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Accompagnement continu des familles</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                  À votre écoute pour une scolarité sereine
                </h3>
                <p className="text-[11px] text-slate-200/90 leading-relaxed line-clamp-2">
                  Recevez immédiatement les circulaires par SMS et WhatsApp sans coût d’impression.
                </p>

                {/* Direct quick action buttons */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {onOpenSmsSimulator && (
                    <button
                      onClick={onOpenSmsSimulator}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Tester SMS</span>
                    </button>
                  )}
                  {onOpenAiAssistant && (
                    <button
                      onClick={onOpenAiAssistant}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Assistant IA</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: White Card containing Grid of 6 Dark Green Cards */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-sm border border-amber-200/60 flex flex-col justify-between h-full">
              {/* Card Subhead */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Sélectionnez une rubrique rapide
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Redirection immédiate
                </span>
              </div>

              {/* Grid of 6 Dark Green Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {quickAccessItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleCardClick(item.target)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCardClick(item.target);
                        }
                      }}
                      className="group bg-[#154734] hover:bg-[#0e3525] active:scale-[0.98] text-white rounded-xl p-4 flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer border border-emerald-800/40 relative overflow-hidden"
                    >
                      {/* Subtle Ambient Hover Glow */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl group-hover:bg-amber-400/10 transition-colors pointer-events-none" />

                      {/* Top Row: Icon + Badge */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>

                          {item.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                          {item.title}
                        </h4>

                        {/* Subtitle */}
                        <p className="mt-1 text-[11px] text-emerald-100/75 leading-snug line-clamp-2">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Bottom Action Button Bar */}
                      <div className="mt-4 pt-2.5 border-t border-emerald-700/40 flex items-center justify-between text-[11px] font-bold text-amber-300 group-hover:text-amber-200">
                        <span>{item.actionLabel}</span>
                        <div className="w-5 h-5 rounded-full bg-emerald-800/60 group-hover:bg-amber-400 group-hover:text-slate-950 text-amber-300 flex items-center justify-center transition-all">
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Reassurance Banner */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Synchronisation temps réel avec le secrétariat et les enseignants</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>Support d'assistance actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
