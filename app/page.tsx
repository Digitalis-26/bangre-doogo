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
import { TuitionView } from '@/components/TuitionView';
import { MapPin, ShieldAlert, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/lib/types';

// Strict Role-Based Access Control matrix
const ALLOWED_TABS_BY_ROLE: Record<UserRole, string[]> = {
  parent: ['dashboard', 'announcements', 'attendance', 'liaison', 'scolarite', 'school_search', 'quick_access'],
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
    'scolarite',
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
    'scolarite',
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
    'scolarite',
    'school_search',
    'quick_access',
  ],
  student: ['dashboard', 'announcements', 'school_search', 'quick_access'],
};

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Accueil',
  quick_access: 'Hub Accès Rapide',
  scolarite: 'Frais & Scolarité',
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

function MainAppContent() {
  const {
    currentRole,
    currentSchool,
    isAuthenticated,
    isMobileDeviceView,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // If user is not authenticated, show the authentication screen
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Check RBAC permission for the active tab
  const allowedTabs = ALLOWED_TABS_BY_ROLE[currentRole] || ['dashboard'];
  const hasAccess = allowedTabs.includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MobileSimulatorFrame activeTab={activeTab} setActiveTab={setActiveTab}>
          {!hasAccess ? (
            <div className="bg-white rounded-3xl border border-rose-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Accès Restreint</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Votre profil actuel (<strong>{ROLE_NAMES[currentRole]}</strong>) n&apos;est pas autorisé à accéder à la section &ldquo;<strong>{TAB_TITLES[activeTab] || activeTab}</strong>&rdquo;.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-6 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
              </button>
            </div>
          ) : (
            <>
              {/* TAB ROUTING */}
              {activeTab === 'dashboard' && (
                <>
                  <HeroSection
                    onNavigateTab={setActiveTab}
                    onOpenPricing={() => setIsPricingModalOpen(true)}
                    onOpenAiAssistant={() => setIsAiModalOpen(true)}
                    onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                  />
                  {currentRole === 'parent' && (
                    <ParentPortal
                      onNavigateTab={setActiveTab}
                      onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                    />
                  )}
                  {currentRole === 'teacher' && (
                    <TeacherPortal onOpenAiAssistant={() => setIsAiModalOpen(true)} />
                  )}
                  {(currentRole === 'director' || currentRole === 'secretary') && (
                    <DirectorPortal
                      onOpenAiAssistant={() => setIsAiModalOpen(true)}
                      onOpenPricing={() => setIsPricingModalOpen(true)}
                    />
                  )}
                  {currentRole === 'super_admin' && <SuperAdminPortal />}
                  {currentRole === 'student' && (
                    <ParentPortal
                      onNavigateTab={setActiveTab}
                      onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                    />
                  )}
                </>
              )}

              {/* ONGLET SCOLARITÉ : Paiements locaux, suivi des impayés, relances & quittances */}
              {activeTab === 'scolarite' && <TuitionView />}

              {activeTab === 'quick_access' && (
                <QuickAccessView onNavigateTab={setActiveTab} />
              )}

              {activeTab === 'announcements' && (
                <AnnouncementsView
                  onOpenAiAssistant={() => setIsAiModalOpen(true)}
                  onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
                />
              )}

              {activeTab === 'attendance' && <AttendanceView />}

              {activeTab === 'liaison' && <LiaisonView />}

              {activeTab === 'classes' && <ClassesView />}

              {activeTab === 'students' && <StudentsView />}

              {activeTab === 'teachers' && <TeachersView />}

              {activeTab === 'school_config' && <SchoolConfigView />}

              {activeTab === 'school_search' && <SchoolSearchView />}

              {activeTab === 'users_admin' && <UsersAdminView />}
            </>
          )}
        </MobileSimulatorFrame>
      </main>

      {/* Regional Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ÉcoleConnect</span>
            <span>&bull;</span>
            <span>Système National Intégré de Suivi Pédagogique & Scolarité</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {currentSchool.city} ({currentSchool.country})
            </span>
          </div>

          <div className="text-slate-400 text-center md:text-right">
            Conforme aux normes MENAPLN &bull; Protection des données scolaires
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AiAnnouncementModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      <SmsSimulatorModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
      />

      <SubscriptionModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}

export default function RootPage() {
  return (
    <SchoolProvider>
      <MainAppContent />
    </SchoolProvider>
  );
}
