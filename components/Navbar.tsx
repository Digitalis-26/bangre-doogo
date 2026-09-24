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
    schools,
    setCurrentSchoolId,
    isMobileDeviceView,
    setIsMobileDeviceView,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetDemoData,
    isAuthenticated,
    setAuthModalOpen,
    setAuthModalMode,
    logout,
    activeAcademicYear,
  } = useSchool();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; sub: string; icon: any }> = {
    director: {
      label: 'Directeur d\'école',
      sub: 'M. Salif Ouédraogo (GS Horizon)',
      icon: Building2,
    },
    teacher: {
      label: 'Enseignant',
      sub: 'Mme Fatou Traoré (CM2 A)',
      icon: BookOpen,
    },
    parent: {
      label: 'Parent d\'élève',
      sub: 'M. Ousmane Sawadogo (2 enfants)',
      icon: UserCheck,
    },
    secretary: {
      label: 'Secrétariat',
      sub: 'Mme Mariam Kaboré',
      icon: GraduationCap,
    },
    super_admin: {
      label: 'Super Admin SaaS',
      sub: 'Gestion multi-écoles & forfaits',
      icon: Shield,
    },
    student: {
      label: 'Élève (Consultatif)',
      sub: 'Espace simplifié',
      icon: GraduationCap,
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner indicating the Sahel / Francophone African Context and Active Role */}
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
          <button
            onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-800 px-2 py-0.5 rounded-sm"
            title="Basculez entre vue Bureau et émulateur smartphone PWA"
          >
            {isMobileDeviceView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vue Bureau standard</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulateur Smartphone PWA</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-slate-300 hover:text-white transition-colors text-[11px] flex items-center gap-1 cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded-sm"
              title="Se déconnecter"
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
              <span>Connexion / Inscription</span>
            </button>
          )}

          <button
            onClick={resetDemoData}
            className="text-slate-400 hover:text-slate-200 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
            title="Réinitialiser la démonstration"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Démo</span>
          </button>
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
              La communication scolaire, simplement.
            </span>
          </button>
        </div>

        {/* Text navigation links covering the 10 V1 MVP Modules */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Accueil
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'announcements'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Annonces
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'attendance'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Absences
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'classes'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Classes
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'students'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Élèves
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'teachers'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Enseignants
          </button>

          {/* Administration & Configuration Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAdminMenu(!showAdminMenu)}
              className={`flex items-center gap-1 cursor-pointer transition-colors py-1 ${
                ['school_config', 'users_admin', 'liaison'].includes(activeTab)
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
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
                  <span>Rattachement Parents</span>
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

          <button
            onClick={onOpenPricing}
            className={`cursor-pointer transition-colors py-1 ${
              activeTab === 'pricing'
                ? 'text-emerald-700 border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            Tarifs B2B
          </button>
        </nav>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick AI Announcement Trigger */}
          {(currentRole === 'director' || currentRole === 'teacher' || currentRole === 'secretary') && (
            <button
              onClick={onOpenAiAssistant}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rédiger avec IA</span>
            </button>
          )}

          {/* SMS / WhatsApp simulation button */}
          <button
            onClick={onOpenSmsSimulator}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Aperçu des alertes transmises par SMS et WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">Simulateur SMS</span>
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
                    Notifications récentes ({unreadCount} non lues)
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
                          <span>
                            {formatTime(notif.createdAt)}
                          </span>
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

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-semibold leading-tight text-slate-900 truncate max-w-[120px]">
                  {roleLabels[currentRole].label}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Changer d'espace & de rôle
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Testez la plateforme sous chaque profil utilisateur
                  </div>
                </div>

                <div className="p-1 divide-y divide-slate-100">
                  {(Object.keys(roleLabels) as UserRole[]).map((roleKey) => {
                    const info = roleLabels[roleKey];
                    const Icon = info.icon;
                    const isActive = currentRole === roleKey;

                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setCurrentRole(roleKey);
                          setShowRoleMenu(false);
                          setActiveTab('dashboard');
                        }}
                        className={`w-full text-left p-2.5 flex items-start gap-2.5 rounded-lg transition-colors cursor-pointer ${
                          isActive ? 'bg-emerald-50 text-emerald-950 font-medium' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-md mt-0.5 ${
                            isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{info.label}</span>
                            {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{info.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100">
                  <label className="block text-[10px] text-slate-500 mb-1 font-semibold uppercase">
                    Établissement actif (Multi-tenancy)
                  </label>
                  <select
                    value={currentSchool.id}
                    onChange={(e) => setCurrentSchoolId(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-md font-medium text-slate-800"
                  >
                    {schools.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.name} ({sch.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
