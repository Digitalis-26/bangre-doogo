'use client';

import React, { useState } from 'react';
import { SchoolProvider, useSchool } from '@/context/SchoolContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ParentPortal } from '@/components/ParentPortal';
import { TeacherPortal } from '@/components/TeacherPortal';
import { DirectorPortal } from '@/components/DirectorPortal';
import { SuperAdminPortal } from '@/components/SuperAdminPortal';
import { AnnouncementsView } from '@/components/AnnouncementsView';
import { AttendanceView } from '@/components/AttendanceView';
import { LiaisonView } from '@/components/LiaisonView';
import { SchoolSearchView } from '@/components/SchoolSearchView';
import { PricingSection } from '@/components/PricingSection';
import { ClassesView } from '@/components/ClassesView';
import { StudentsView } from '@/components/StudentsView';
import { TeachersView } from '@/components/TeachersView';
import { SchoolConfigView } from '@/components/SchoolConfigView';
import { UsersAdminView } from '@/components/UsersAdminView';
import { AuthScreen } from '@/components/AuthScreen';
import { AiAnnouncementModal } from '@/components/AiAnnouncementModal';
import { SmsSimulatorModal } from '@/components/SmsSimulatorModal';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import { MobileSimulatorFrame } from '@/components/MobileSimulatorFrame';
import { QuickAccessView } from '@/components/QuickAccessView';
import { MapPin, ShieldAlert, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/lib/types';

// Strict Role-Based Access Control matrix
const ALLOWED_TABS_BY_ROLE: Record<UserRole, string[]> = {
  parent: ['dashboard', 'announcements', 'attendance', 'liaison', 'school_search', 'quick_access'],
  teacher: ['dashboard', 'attendance', 'students', 'announcements', 'school_search', 'quick_access'],
  director: [
    'dashboard',
    'announcements',
    'attendance',
    'classes',
    'students',
    'teachers',
    'school_config',
    'liaison',
    'users_admin',
    'school_search',
    'quick_access',
  ],
  secretary: [
    'dashboard',
    'announcements',
    'attendance',
    'classes',
    'students',
    'teachers',
    'liaison',
    'school_search',
    'quick_access',
  ],
  super_admin: [
    'dashboard',
    'school_config',
    'users_admin',
    'announcements',
    'classes',
    'students',
    'teachers',
    'attendance',
    'liaison',
    'school_search',
    'quick_access',
  ],
  student: ['dashboard', 'announcements', 'school_search', 'quick_access'],
};

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Accueil',
  quick_access: 'Hub Accès Rapide',
  announcements: 'Circulaires & Annonces',
  attendance: 'Absences & Justificatifs',
  classes: 'Gestion des Classes',
  students: 'Registre des Élèves',
  teachers: 'Corps Enseignant',
  school_config: 'Configuration Établissement',
  liaison: 'Liaisons Parents',
  users_admin: 'Administration Utilisateurs',
  school_search: 'Trouver un Établissement',
};

const ROLE_NAMES: Record<UserRole, string> = {
  parent: "Parent d'élève",
  teacher: 'Enseignant',
  director: "Direction d'école",
  secretary: 'Secrétariat',
  super_admin: 'Super Administrateur',
  student: 'Élève',
};

function AppContent() {
  const {
    currentRole,
    publishAnnouncement,
    currentSchool,
    currentUser,
    isAuthenticated,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Synchronize activeTab with URL query parameter for autonomous addressable pages
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      if (tabFromUrl && ALLOWED_TABS_BY_ROLE[currentRole]?.includes(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }

      const handlePopState = () => {
        const p = new URLSearchParams(window.location.search);
        const t = p.get('tab') || 'dashboard';
        if (ALLOWED_TABS_BY_ROLE[currentRole]?.includes(t)) {
          setActiveTab(t);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [currentRole]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'dashboard') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // If user is not authenticated, render ONLY the authentication interface
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Check if current tab is allowed for current role
  const isTabAllowed = ALLOWED_TABS_BY_ROLE[currentRole]?.includes(activeTab);

  const handleApplyAiDraft = (draft: { title: string; content: string; smsVersion: string }) => {
    publishAnnouncement({
      schoolId: currentSchool.id,
      targetType: 'all',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentRole === 'teacher' ? 'Enseignant' : 'Direction',
      title: draft.title,
      content: draft.content,
      smsVersion: draft.smsVersion,
      priority: 'important',
      category: 'general',
      totalTargets: currentSchool.parentsCount,
    });
    handleTabChange('announcements');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar strictly tailored to current user role */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
        onOpenPricing={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role-tailored Hero Section displayed on Dashboard tab */}
        {activeTab === 'dashboard' && (
          <HeroSection
            onNavigateTab={handleTabChange}
            onOpenPricing={() => setIsSubscriptionModalOpen(true)}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
          />
        )}

        {/* Dynamic content wrapped in Mobile Simulator frame when toggled */}
        <MobileSimulatorFrame activeTab={activeTab} setActiveTab={handleTabChange}>
          {/* If the active tab is not allowed for this role, show strict Access Denied */}
          {!isTabAllowed ? (
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-red-200 text-center space-y-4 max-w-lg mx-auto shadow-sm my-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Accès Restreint
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                L'interface <strong>{TAB_TITLES[activeTab] || activeTab}</strong> n'est pas accessible avec votre profil <strong>{ROLE_NAMES[currentRole]}</strong>.
                Chaque utilisateur accède uniquement aux fonctionnalités qui le concernent directement.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleTabChange('dashboard')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retourner à mon Espace {ROLE_NAMES[currentRole]}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <>
                  {currentRole === 'parent' && (
                    <ParentPortal
                      onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                      onNavigateToSchoolSearch={() => handleTabChange('school_search')}
                    />
                  )}
                  {currentRole === 'teacher' && (
                    <TeacherPortal onOpenAiAssistant={() => setIsAiModalOpen(true)} />
                  )}
                  {(currentRole === 'director' || currentRole === 'secretary') && (
                    <DirectorPortal
                      onOpenAiAssistant={() => setIsAiModalOpen(true)}
                      onOpenPricing={() => setIsSubscriptionModalOpen(true)}
                    />
                  )}
                  {currentRole === 'super_admin' && <SuperAdminPortal />}
                  {currentRole === 'student' && (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold text-lg">
                        🎓
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Espace Élève & Orientation</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Accès simplifié aux devoirs et circulaires validés par l'équipe pédagogique, ainsi qu'à l'annuaire des établissements pour votre poursuite d'études.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => handleTabChange('announcements')}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors"
                        >
                          Consulter les devoirs & circulaires
                        </button>
                        <button
                          onClick={() => handleTabChange('school_search')}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                        >
                          🔍 Trouver un nouvel établissement
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Page Autonome : Hub Accès Rapide */}
              {activeTab === 'quick_access' && (
                <QuickAccessView
                  onNavigateTab={handleTabChange}
                  onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                  onOpenAiAssistant={() => setIsAiModalOpen(true)}
                />
              )}

              {activeTab === 'announcements' && (
                <AnnouncementsView
                  onOpenAiAssistant={() => setIsAiModalOpen(true)}
                  onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                />
              )}

              {activeTab === 'attendance' && <AttendanceView />}

              {activeTab === 'classes' && <ClassesView />}

              {activeTab === 'students' && <StudentsView />}

              {activeTab === 'teachers' && <TeachersView />}

              {activeTab === 'school_config' && <SchoolConfigView />}

              {activeTab === 'liaison' && <LiaisonView />}

              {activeTab === 'school_search' && <SchoolSearchView />}

              {activeTab === 'users_admin' && <UsersAdminView />}
            </>
          )}
        </MobileSimulatorFrame>
      </main>

      {/* Global Interactive Modals */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      <AiAnnouncementModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyDraft={handleApplyAiDraft}
      />

      <SmsSimulatorModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />

      {/* Clean Regional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm">ÉcoleConnect</span>
            <span>·</span>
            <span>La communication scolaire, simplement.</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-600">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>Burkina Faso & Afrique de l'Ouest</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
