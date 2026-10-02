'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { UserRole } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import {
  Bell,
  Smartphone,
  Monitor,
  GraduationCap,
  Shield,
  BookOpen,
  UserCheck,
  Building2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Users,
  Layers,
  Calendar,
  ShieldCheck,
  LogIn,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Heart,
  Clock,
  FileText,
  Search,
  Megaphone,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  CreditCard,
  Receipt,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  onOpenSmsSimulator: () => void;
  onOpenPricing: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  onOpenSmsSimulator,
  onOpenPricing,
}: NavbarProps) {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    currentSchool,
    isMobileDeviceView,
    setIsMobileDeviceView,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    announcements,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    logout,
    activeAcademicYear,
  } = useSchool();

  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [quickSearchTerm, setQuickSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'Français' | 'Mooré' | 'Dioula'>('Français');
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Active dropdown menu for hover/click
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Latest announcement for the green "ANNONCES" ticker
  const latestAnnouncement = announcements[0] || {
    id: 'ann-welcome',
    title: 'Circulaire N°03 : Réunion générale des parents d\'élèves et bilan du 1er trimestre',
    content: 'Retrouvez toutes les informations sur la scolarité et les devoirs.',
  };

  const roleLabels: Record<UserRole, { label: string; badgeClass: string; icon: any }> = {
    parent: {
      label: "Parent d'élève",
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: UserCheck,
    },
    teacher: {
      label: 'Enseignant',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: BookOpen,
    },
    director: {
      label: "Direction d'école",
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Building2,
    },
    secretary: {
      label: 'Secrétariat',
      badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: GraduationCap,
    },
    super_admin: {
      label: 'Super Admin SaaS',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Shield,
    },
    student: {
      label: 'Élève Consultatif',
      badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: GraduationCap,
    },
  };

  const RoleIcon = roleLabels[currentRole]?.icon || UserCheck;

  // Handle quick search submit
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchTerm.trim()) return;
    setShowQuickSearch(false);
    setActiveTab('announcements');
  };

  return (
    <header className="sticky top-0 z-40 shadow-md">
      {/* 1. TOP UTILITY STRIP (Context, Year, Role & View Toggles) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white tracking-wide">ÉcoleConnect 🇧🇫</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 truncate max-w-xs sm:max-w-md font-medium">
            {currentSchool.name} ({currentSchool.city})
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-amber-400 font-mono text-[11px] font-semibold tracking-wide">
            Année {activeAcademicYear.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Authenticated User Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-200 border border-slate-700 shadow-2xs">
            <RoleIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-xs">{currentUser.name}</span>
            <span className="text-slate-400 text-[10px]">({roleLabels[currentUser.role || currentRole]?.label})</span>
          </div>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-slate-300 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer bg-red-950/60 hover:bg-red-900/90 text-red-200 px-2.5 py-1 rounded-md border border-red-800/80 shadow-2xs"
              title="Se déconnecter de votre compte"
            >
              <LogOut className="w-3.5 h-3.5 text-red-300" />
              <span>Déconnexion</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="text-amber-300 hover:text-amber-200 transition-colors text-[11px] flex items-center gap-1 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-md font-semibold border border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN HEADLINE BANNER (Model: Crimson Red Bar with Golden Yellow "Accueil" Button & White Menus) */}
      <div className="bg-[#A6192E] text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-stretch justify-between h-12">
          {/* Navigation Links Group */}
          <nav className="flex items-stretch overflow-x-auto no-scrollbar text-xs font-medium">
            {/* Primary Yellow "Accueil" Button (Matching Model Screenshot) */}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setActiveDropdown(null);
              }}
              className={`px-4 sm:px-5 flex items-center justify-center font-bold text-slate-950 transition-colors cursor-pointer select-none shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-[#FFCC00] shadow-inner'
                  : 'bg-[#FFCC00]/95 hover:bg-[#FFD633]'
              }`}
            >
              <span>Accueil</span>
            </button>

            {/* Accès Rapide Autonomous Tab (Visible for all roles) */}
            <button
              onClick={() => {
                setActiveTab('quick_access');
                setActiveDropdown(null);
              }}
              className={`px-3 sm:px-4 flex items-center gap-1.5 transition-colors cursor-pointer select-none whitespace-nowrap shrink-0 border-r border-white/20 ${
                activeTab === 'quick_access'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-inner'
                  : 'text-amber-200 hover:bg-black/20 hover:text-white font-semibold'
              }`}
              title="Hub autonome Accès Rapide"
            >
              <span className="text-amber-300 text-sm">★</span>
              <span>Accès Rapide</span>
            </button>

            {/* Role-Specific Institutional Tabs styled according to Model */}

            {/* PARENT TABS */}
            {currentRole === 'parent' && (
              <>
                {/* Circulaires & Textes ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('parent_ann')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('announcements');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'announcements' ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Consulter les circulaires et devoirs"
                  >
                    <span>Circulaires & Textes</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'parent_ann' ? null : 'parent_ann');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'parent_ann' && (
                    <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={() => {
                          setActiveTab('announcements');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Circulaires de l'école</span>
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('announcements');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Devoirs & Travail maison</span>
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          onOpenSmsSimulator();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 border-t border-slate-100 cursor-pointer"
                      >
                        <span>Passerelle SMS & Alertes Directes</span>
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mes Enfants & Assiduité ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('parent_child')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('attendance');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'attendance' ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Suivi des présences et absences"
                  >
                    <span>Dossier Élèves</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'parent_child' ? null : 'parent_child');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'parent_child' && (
                    <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={() => {
                          setActiveTab('attendance');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Absences & Retards</span>
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('attendance');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Justifier une absence</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('liaison');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 border-t border-slate-100 cursor-pointer"
                      >
                        <span>Associer un enfant (Matricule)</span>
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Liaison Famille direct link */}
                <button
                  onClick={() => {
                    setActiveTab('liaison');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'liaison' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Gestion du rattachement de vos enfants"
                >
                  <span>Liaison Famille</span>
                </button>

                {/* Scolarité & Paiements en ligne */}
                <button
                  onClick={() => {
                    setActiveTab('scolarite');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'scolarite' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Payer la scolarité et obtenir les quittances"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  <span>Scolarité</span>
                </button>

                {/* Établissements & Recherche ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('parent_school')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('school_search');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'school_search' ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Trouver un nouvel établissement scolaire"
                  >
                    <span>Trouver une École</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'parent_school' ? null : 'parent_school');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'parent_school' && (
                    <div className="absolute left-0 top-full w-60 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <button
                        onClick={() => {
                          setActiveTab('school_search');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Rechercher un nouvel établissement</span>
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('school_search');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 border-t border-slate-100 cursor-pointer"
                      >
                        <span>Mes candidatures & contacts</span>
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TEACHER TABS */}
            {currentRole === 'teacher' && (
              <>
                {/* Feuille d'Appel (Direct access) */}
                <button
                  onClick={() => {
                    setActiveTab('attendance');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'attendance' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Effectuer l'appel du jour"
                >
                  <span>Feuille d'Appel</span>
                </button>

                {/* Mes Élèves (Direct access) */}
                <button
                  onClick={() => {
                    setActiveTab('students');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'students' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Liste des élèves de ma classe"
                >
                  <span>Mes Élèves</span>
                </button>

                {/* Pédagogie & Devoirs ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('teacher_ped')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('announcements');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'announcements' ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Devoirs et circulaires"
                  >
                    <span>Pédagogie & Devoirs</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'teacher_ped' ? null : 'teacher_ped');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'teacher_ped' && (
                    <div className="absolute left-0 top-full w-52 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50">
                      <button
                        onClick={() => {
                          setActiveTab('announcements');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Devoirs & Annonces</span>
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          onOpenAiAssistant();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 border-t border-slate-100 cursor-pointer"
                      >
                        <span>Rédiger avec IA</span>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveTab('school_search');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'school_search' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Trouver un établissement partenaire"
                >
                  <span>Trouver une École</span>
                </button>
              </>
            )}

            {/* DIRECTION & SECRÉTARIAT TABS */}
            {(currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin') && (
              <>
                {/* Communiqués ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('dir_com')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('announcements');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'announcements' ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Circulaires et annonces officielles"
                  >
                    <span>Communiqués</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'dir_com' ? null : 'dir_com');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'dir_com' && (
                    <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50">
                      <button
                        onClick={() => {
                          setActiveTab('announcements');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Circulaires & Diffusion</span>
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          onOpenAiAssistant();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 border-t border-slate-100 cursor-pointer"
                      >
                        <span>Rédiger avec IA</span>
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Assiduité ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('dir_att')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('attendance');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'attendance' ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Registre des absences et justificatifs"
                  >
                    <span>Assiduité</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'dir_att' ? null : 'dir_att');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'dir_att' && (
                    <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50">
                      <button
                        onClick={() => {
                          setActiveTab('attendance');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Registre des Absences</span>
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('attendance');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Validation Justificatifs</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Structure ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('dir_struct')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('classes');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      ['classes', 'students', 'teachers'].includes(activeTab) ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Classes, élèves et enseignants"
                  >
                    <span>Structure</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'dir_struct' ? null : 'dir_struct');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'dir_struct' && (
                    <div className="absolute left-0 top-full w-52 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50">
                      <button
                        onClick={() => {
                          setActiveTab('classes');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Classes & Divisions</span>
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('students');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Registre des Élèves</span>
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('teachers');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Corps Enseignant</span>
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Scolarité & Comptabilité */}
                <button
                  onClick={() => {
                    setActiveTab('scolarite');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'scolarite' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Suivi des frais de scolarité, relances des impayés et quittances"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  <span>Scolarité</span>
                </button>

                {/* Administration ▾ */}
                <div
                  className="relative flex items-stretch group"
                  onMouseEnter={() => setActiveDropdown('dir_admin')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('school_config');
                      setActiveDropdown(null);
                    }}
                    className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                      ['school_config', 'liaison', 'users_admin'].includes(activeTab) ? 'bg-black/25 font-bold text-amber-200' : ''
                    }`}
                    title="Paramétrage et liaisons parents"
                  >
                    <span>Administration</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === 'dir_admin' ? null : 'dir_admin');
                      }}
                      className="text-[10px] opacity-80 hover:text-amber-300 p-0.5"
                    >
                      ▾
                    </span>
                  </button>

                  {activeDropdown === 'dir_admin' && (
                    <div className="absolute left-0 top-full w-60 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-1.5 z-50">
                      <button
                        onClick={() => {
                          setActiveTab('school_config');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Établissement & Années</span>
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('liaison');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Validation Liaisons Parents</span>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('users_admin');
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 cursor-pointer"
                      >
                        <span>Utilisateurs & Rôles</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => {
                          onOpenPricing();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium flex items-center justify-between text-slate-700 border-t border-slate-100 cursor-pointer"
                      >
                        <span>Abonnement SaaS & Forfait SMS</span>
                        <span className="text-[10px] text-amber-600 font-bold">Pro</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Réseau d'Écoles */}
                <button
                  onClick={() => {
                    setActiveTab('school_search');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'school_search' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Annuaire et recherche d'établissements"
                >
                  <span>Trouver une École</span>
                </button>
              </>
            )}

            {/* STUDENT TABS */}
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => {
                    setActiveTab('announcements');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'announcements' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Devoirs et circulaires pédagogiques"
                >
                  <span>Devoirs & Circulaires</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('school_search');
                    setActiveDropdown(null);
                  }}
                  className={`px-3 sm:px-3.5 flex items-center gap-1 text-white hover:bg-black/15 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'school_search' ? 'bg-black/25 font-bold text-amber-200' : ''
                  }`}
                  title="Rechercher un lycée ou nouvel établissement"
                >
                  <span>Trouver un Établissement</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Controls: Search, Language selector, Notification Bell, User Card (Matching Model Screenshot) */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 shrink-0">
            {/* Search Icon (White magnifying glass) */}
            <div className="relative">
              <button
                onClick={() => setShowQuickSearch(!showQuickSearch)}
                className="p-1.5 text-white hover:text-amber-300 transition-colors cursor-pointer"
                title="Rechercher une école ou circulaire"
                aria-label="Recherche"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Quick Search Popover */}
              {showQuickSearch && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-50 text-slate-800">
                  <form onSubmit={handleQuickSearchSubmit} className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Recherche rapide
                    </div>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={quickSearchTerm}
                        onChange={(e) => setQuickSearchTerm(e.target.value)}
                        placeholder="Rechercher une circulaire, école, élève..."
                        className="w-full text-xs pl-8 pr-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowQuickSearch(false)}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Fermer
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Rechercher
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Language Dropdown (Matching Model Screenshot white box with chevron) */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="bg-white text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-sm flex items-center gap-1.5 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{selectedLanguage}</span>
                <span className="text-[10px]">▾</span>
              </button>

              {showLangMenu && (
                <div
                  className="absolute right-0 mt-1 w-32 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs"
                  onMouseLeave={() => setShowLangMenu(false)}
                >
                  <button
                    onClick={() => {
                      setSelectedLanguage('Français');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                      selectedLanguage === 'Français' ? 'font-bold text-emerald-700' : ''
                    }`}
                  >
                    <span>Français</span>
                    {selectedLanguage === 'Français' && <span className="text-[10px]">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLanguage('Mooré');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                      selectedLanguage === 'Mooré' ? 'font-bold text-emerald-700' : ''
                    }`}
                  >
                    <span>Mooré</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLanguage('Dioula');
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                      selectedLanguage === 'Dioula' ? 'font-bold text-emerald-700' : ''
                    }`}
                  >
                    <span>Dioula</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 text-white hover:text-amber-300 transition-colors cursor-pointer"
                aria-label="Centre de notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-slate-800">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Notifications ({unreadCount} non lues)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-emerald-700 hover:underline font-medium cursor-pointer"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">Aucune notification.</div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3 cursor-pointer ${notif.isRead ? 'bg-white opacity-70' : 'bg-emerald-50/50 font-medium'}`}
                        >
                          <div className="text-[10px] text-slate-400 mb-0.5">{formatTime(notif.createdAt)}</div>
                          <div className="text-slate-900 font-semibold">{notif.title}</div>
                          <div className="text-slate-600 text-[11px] line-clamp-2">{notif.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Mini-badge */}
            <div className="relative">
              <button
                onClick={() => setShowProfileCard(!showProfileCard)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/40 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                title={currentUser.name}
              >
                {currentUser.name.charAt(0)}
              </button>

              {/* Profile Card Popover */}
              {showProfileCard && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-slate-800"
                  onMouseLeave={() => setShowProfileCard(false)}
                >
                  <div className="p-3 bg-slate-50 border-b border-slate-200">
                    <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {roleLabels[currentRole]?.label}
                    </span>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileCard(false);
                        logout();
                      }}
                      className="w-full py-1.5 px-3 text-xs text-red-700 hover:bg-red-50 font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUB-HEADLINE TICKER (Model: Green "ANNONCES" Badge + News Marquee Text) */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-stretch overflow-hidden text-xs">
          {/* Green ANNONCES block matching exactly the model screenshot */}
          <button
            onClick={() => setActiveTab('announcements')}
            className="bg-[#008751] hover:bg-[#007043] text-white font-black text-xs uppercase px-4 sm:px-6 py-2 tracking-wider flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer select-none"
            title="Consulter toutes les annonces et circulaires"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>ANNONCES</span>
          </button>

          {/* Marquee ticker text */}
          <div
            onClick={() => setActiveTab('announcements')}
            className="flex-1 px-3 sm:px-4 py-2 text-xs truncate flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden"
          >
            <span className="text-slate-600 shrink-0 font-medium">
              Bienvenue sur le portail {currentSchool.name} /
            </span>
            <span className="text-[#A6192E] font-semibold truncate hover:underline">
              {latestAnnouncement.title}
            </span>
            <span className="text-slate-400 hidden lg:inline">
              · Cliquez pour consulter le document officiel
            </span>
          </div>

          {/* Right action button inside ticker */}
          <button
            onClick={() => setActiveTab('announcements')}
            className="hidden sm:flex items-center gap-1 px-3 text-[11px] text-slate-500 hover:text-slate-800 font-semibold shrink-0 cursor-pointer border-l border-slate-100"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
}
