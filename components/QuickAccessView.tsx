'use client';

import React, { useState } from 'react';
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
  ArrowLeft,
  BookOpen,
  Users,
  Building2,
  FileText,
  Compass,
  CalendarCheck,
  Send,
  Zap,
} from 'lucide-react';

interface QuickAccessViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenSmsSimulator?: () => void;
  onOpenAiAssistant?: () => void;
}

export function QuickAccessView({
  onNavigateTab,
  onOpenSmsSimulator,
  onOpenAiAssistant,
}: QuickAccessViewProps) {
  const {
    currentRole,
    currentSchool,
    announcements,
    attendance,
    classes,
    students,
    activeAcademicYear,
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'communication' | 'attendance' | 'schooling' | 'orientation'>('all');

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

  // The 6 main cards from the reference model
  const coreQuickAccessItems = [
    {
      id: 'announcements',
      title: 'Communiqués',
      subtitle: 'Circulaires officielles, notes de service & informations de rentrée',
      icon: Bell,
      badge: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount} nouveau${unreadAnnouncementsCount > 1 ? 'x' : ''}` : undefined,
      badgeColor: 'bg-amber-400 text-amber-950',
      actionLabel: 'Ouvrir la page',
      pageName: 'Circulaires & Devoirs',
      target: 'announcements',
      category: 'communication',
    },
    {
      id: 'attendance',
      title: 'Absences & Retards',
      subtitle: 'Déclarer un retard, justifier une absence ou vérifier l’appel du jour',
      icon: Clock,
      badge: pendingAttendanceCount > 0 ? `${pendingAttendanceCount} à traiter` : undefined,
      badgeColor: 'bg-red-400 text-red-950',
      actionLabel: 'Ouvrir la page',
      pageName: 'Assiduité & Justificatifs',
      target: 'attendance',
      category: 'attendance',
    },
    {
      id: 'classes',
      title: currentRole === 'parent' ? 'Suivi & Scolarité' : 'Classes & Élèves',
      subtitle: currentRole === 'parent' ? 'Carnet scolaire, enfants rattachés & cours' : 'Registre d’appel, effectifs des divisions & emplois du temps',
      icon: GraduationCap,
      actionLabel: 'Ouvrir la page',
      pageName: currentRole === 'parent' ? 'Espace Famille' : 'Gestion des Classes',
      target: 'classes',
      category: 'schooling',
    },
    {
      id: 'liaison',
      title: 'Cahier de Liaison',
      subtitle: 'Messagerie directe parents-enseignants & demandes de rendez-vous',
      icon: MessageSquare,
      actionLabel: 'Ouvrir la page',
      pageName: 'Liaison & Échanges',
      target: 'liaison',
      category: 'communication',
    },
    {
      id: 'school_search',
      title: 'Trouver une École',
      subtitle: 'Annuaire national, inscriptions, cycles d’études et bourses scolaires',
      icon: Search,
      badge: 'Nouveau',
      badgeColor: 'bg-emerald-400 text-emerald-950',
      actionLabel: 'Ouvrir la page',
      pageName: 'Annuaire & Orientation',
      target: 'school_search',
      category: 'orientation',
    },
    {
      id: 'sms',
      title: 'Simulateur SMS & Alertes',
      subtitle: 'Diffusion d’urgences par SMS sans réseau internet ni data mobile',
      icon: Smartphone,
      actionLabel: 'Lancer le test',
      pageName: 'Simulateur Télécom SMS',
      target: 'sms',
      category: 'communication',
    },
  ];

  // Extended catalog for autonomous discovery
  const additionalShortcuts = [
    {
      id: 'ext_ai',
      title: 'Assistant Pédagogique IA',
      desc: 'Rédaction assistée de circulaires et devoirs en français conforme aux programmes',
      icon: Sparkles,
      iconBg: 'bg-amber-100 text-amber-800',
      action: () => onOpenAiAssistant?.(),
      allowed: currentRole === 'teacher' || currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin',
    },
    {
      id: 'ext_teachers',
      title: 'Corps Enseignant',
      desc: 'Répartition pédagogique, coordonnées et affectations par classe',
      icon: Users,
      iconBg: 'bg-blue-100 text-blue-800',
      action: () => onNavigateTab('teachers'),
      allowed: currentRole === 'director' || currentRole === 'super_admin' || currentRole === 'secretary',
    },
    {
      id: 'ext_config',
      title: 'Configuration Établissement',
      desc: 'Année scolaire en cours, paramètres SMS et identifiants officiels',
      icon: Building2,
      iconBg: 'bg-purple-100 text-purple-800',
      action: () => onNavigateTab('school_config'),
      allowed: currentRole === 'director' || currentRole === 'super_admin',
    },
    {
      id: 'ext_students',
      title: 'Registre Matricules & Élèves',
      desc: 'Fiches administratives des élèves, contacts d’urgence des tuteurs légaux',
      icon: FileText,
      iconBg: 'bg-emerald-100 text-emerald-800',
      action: () => onNavigateTab('students'),
      allowed: currentRole === 'teacher' || currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin',
    },
  ].filter((s) => s.allowed);

  const filteredItems = coreQuickAccessItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pageName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Autonomous Page Header with Breadcrumbs & Back Navigation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          {/* Breadcrumb navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigateTab('dashboard')}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Portail Autonome Accès Rapide</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center font-black">
              ★
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hub Accès Rapide
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Chaque module est indépendant et vous redirige instantanément vers la page de votre choix.
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">{currentSchool.name}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
            <span className="font-semibold">Année : {activeAcademicYear.name}</span>
          </div>
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour Accueil</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un service ou une page..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50/50"
            />
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: 'Tous les modules' },
              { id: 'communication', label: 'Communiqués & SMS' },
              { id: 'attendance', label: 'Absences & Retards' },
              { id: 'schooling', label: 'Scolarité & Classes' },
              { id: 'orientation', label: 'Orientation' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#154734] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THE CORE REQUESTED STRUCTURE (Autonomous & Directing to Pages) */}
      <div className="relative rounded-3xl bg-gradient-to-b from-amber-50/90 via-amber-50/50 to-orange-50/30 p-5 sm:p-8 lg:p-10 border border-amber-200/90 shadow-lg overflow-hidden">
        {/* Decorative Golden / Ochre Traditional Accent Bar at Top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

        {/* Ambient Glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header: ACCÈS RAPIDE with Green Title & Star Line Divider */}
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
            Cliquez sur un service ci-dessous pour être redirigé immédiatement vers la page correspondante
          </p>
        </div>

        {/* Grid Layout: Left welcoming woman portrait + Right White Card with 6 Dark Green Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
          {/* Left Column: Welcoming Educator Portrait */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative flex-1 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-900 group min-h-[350px] sm:min-h-[420px]">
              <Image
                src="/acces_rapide_woman.jpg"
                alt="Éducatrice et conseillère ÉcoleConnect"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
                referrerPolicy="no-referrer"
                priority
              />

              {/* Dark Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/35 to-transparent" />

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
                  Chaque rubrique est reliée en direct aux données du secrétariat et des professeurs.
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

          {/* Right Column: White Card containing the 6 Dark Green Cards */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-sm border border-amber-200/60 flex flex-col justify-between h-full">
              {/* Header row inside white container */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Sélectionnez un service ({filteredItems.length} disponible{filteredItems.length > 1 ? 's' : ''})
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 hidden sm:inline">
                  Redirection instantanée vers la page
                </span>
              </div>

              {/* Grid of 6 Dark Green Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {filteredItems.map((item) => {
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

                      {/* Top Row: Icon + Target Page Pill */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>

                          {item.badge ? (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-emerald-300/80 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                              Page
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

                        <div className="mt-2 text-[10px] text-emerald-300/90 font-medium">
                          ➜ Redirige vers : <strong className="text-white">{item.pageName}</strong>
                        </div>
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
                  <span>Accès en un clic avec synchronisation immédiate</span>
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

      {/* 4. Additional Autonomous Shortcuts Section */}
      {additionalShortcuts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Raccourcis additionnels pour votre profil</span>
            </h3>
            <span className="text-xs text-slate-500">Redirections directes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalShortcuts.map((s) => {
              const SIcon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={s.action}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      s.action();
                    }
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-600/50 hover:shadow-md transition-all cursor-pointer group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                      <SIcon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                    <span>Ouvrir</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
