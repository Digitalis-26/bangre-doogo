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
    currentUser,
    currentSchool,
    isMobileDeviceView,
    setIsMobileDeviceView,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    logout,
    activeAcademicYear,
  } = useSchool();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  // Build the strict navigation items according to currentRole ONLY
  const getNavLinks = () => {
    switch (currentRole) {
      case 'parent':
        return [
          { id: 'dashboard', label: 'Espace Famille', icon: Heart },
          { id: 'announcements', label: 'Circulaires & Devoirs', icon: FileText },
          { id: 'attendance', label: 'Absences de mes enfants', icon: Clock },
          { id: 'liaison', label: 'Associer un enfant', icon: UserCheck },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Espace Enseignant', icon: BookOpen },
          { id: 'attendance', label: "Feuille d'Appel", icon: CheckCircle2 },
          { id: 'students', label: 'Mes Élèves', icon: Users },
          { id: 'announcements', label: 'Devoirs & Annonces', icon: FileText },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Mon Espace', icon: GraduationCap },
          { id: 'announcements', label: 'Devoirs & Circulaires', icon: FileText },
        ];
      case 'super_admin':
        return [
          { id: 'dashboard', label: 'Super Admin', icon: Shield },
          { id: 'school_config', label: 'Établissements & Forfaits', icon: Building2 },
          { id: 'users_admin', label: 'Utilisateurs & Rôles', icon: Users },
        ];
      case 'director':
      case 'secretary':
      default:
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Building2 },
          { id: 'announcements', label: 'Circulaires', icon: FileText },
          { id: 'attendance', label: 'Absences', icon: Clock },
          { id: 'classes', label: 'Classes', icon: Layers },
          { id: 'students', label: 'Élèves', icon: Users },
          { id: 'teachers', label: 'Enseignants', icon: BookOpen },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner indicating School context and active user role */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-white">ÉcoleConnect 🇧🇫</span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-slate-300 truncate max-w-xs sm:max-w-md">
            {currentSchool.name} ({currentSchool.city})
          </span>
          <span className="text-slate-400 hidden sm:inline">·</span>
          <span className="text-emerald-400 font-mono text-[11px] uppercase tracking-wide">
            Année {activeAcademicYear.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Role Indicator (Strict, no switcher) */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-800 text-[11px] text-slate-200 border border-slate-700">
            <RoleIcon className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-400">Rôle :</span>
            <span className="font-semibold text-white">{roleLabels[currentRole]?.label}</span>
          </div>

          {/* Toggle Mobile Simulator */}
          <button
            onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-800 px-2 py-0.5 rounded-sm"
            title="Basculez entre vue Bureau et émulateur smartphone PWA"
          >
            {isMobileDeviceView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Vue Bureau</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Simulateur Mobile</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-slate-300 hover:text-white transition-colors text-[11px] flex items-center gap-1 cursor-pointer bg-slate-800/80 hover:bg-red-950/60 px-2 py-0.5 rounded-sm border border-transparent hover:border-red-800"
              title="Se déconnecter pour changer d'utilisateur"
            >
              <LogOut className="w-3 h-3 text-red-400" />
              <span>Déconnexion</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] flex items-center gap-1 cursor-pointer bg-slate-800 px-2 py-0.5 rounded-sm font-semibold"
            >
              <LogIn className="w-3 h-3" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left cursor-pointer group"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
              ÉcoleConnect
            </span>
            <span className="block text-[11px] text-slate-500 font-normal leading-tight">
              {currentRole === 'parent'
                ? 'Mon Espace Famille Sécurisé'
                : currentRole === 'teacher'
                ? 'Espace Pédagogique Enseignant'
                : 'La communication scolaire, simplement.'}
            </span>
          </button>
        </div>

        {/* Text navigation links strictly restricted to the user's role */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`cursor-pointer transition-colors py-1 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* Administration dropdown ONLY visible to Director, Secretary, or SuperAdmin */}
          {(currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin') && (
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className={`flex items-center gap-1 cursor-pointer transition-colors py-1 ${
                  ['school_config', 'users_admin', 'liaison'].includes(activeTab)
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>Administration</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showAdminMenu && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                  onMouseLeave={() => setShowAdminMenu(false)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('school_config');
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Établissement & Années</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('liaison');
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Validation Liaisons Parents</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('users_admin');
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Utilisateurs & Rôles</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Actions & Role Profile Display (Strictly no role switching!) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Announcement Trigger (Only for staff: Director, Teacher, Secretary) */}
          {(currentRole === 'director' || currentRole === 'teacher' || currentRole === 'secretary') && (
            <button
              onClick={onOpenAiAssistant}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rédiger avec IA</span>
            </button>
          )}

          {/* SMS simulation button */}
          <button
            onClick={onOpenSmsSimulator}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Aperçu des alertes transmises par SMS et WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden lg:inline">Simulateur SMS</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Centre de notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono tabular-nums">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
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

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Aucune notification pour le moment.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3 text-xs cursor-pointer transition-colors ${
                          notif.isRead ? 'bg-white opacity-70' : 'bg-emerald-50/40 font-medium'
                        } hover:bg-slate-50`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="font-semibold text-emerald-800 uppercase tracking-wider">
                            {notif.type}
                          </span>
                          <span>{formatTime(notif.createdAt)}</span>
                        </div>
                        <div className="text-slate-900 font-semibold mb-0.5">{notif.title}</div>
                        <div className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Card (STRICT ISOLATION: displays current user identity, NO role switching menu) */}
          <div className="relative">
            <button
              onClick={() => setShowProfileCard(!showProfileCard)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Voir mon profil"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold leading-tight text-slate-900 truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium truncate max-w-[130px]">
                  {roleLabels[currentRole]?.label}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Profile Popover with strictly informative content and logout */}
            {showProfileCard && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                onMouseLeave={() => setShowProfileCard(false)}
              >
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {currentUser.email}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleLabels[currentRole]?.badgeClass}`}>
                          {roleLabels[currentRole]?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 text-xs text-slate-600 space-y-1.5 border-b border-slate-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Établissement :</span>
                    <span className="font-medium text-slate-800 truncate max-w-[150px]">{currentSchool.name}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Téléphone :</span>
                    <span className="font-medium text-slate-800">{currentUser.phone}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Accès :</span>
                    <span className="font-medium text-emerald-700">Strictement cloisonné</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 flex items-center justify-between">
                  <p className="text-[10px] text-slate-500 italic">
                    Pour changer de profil, déconnectez-vous.
                  </p>
                  <button
                    onClick={() => {
                      setShowProfileCard(false);
                      logout();
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
