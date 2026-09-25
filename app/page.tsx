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
import { ShieldCheck, MapPin, Heart, Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/lib/types';

// Strict Role-Based Access Control matrix
const ALLOWED_TABS_BY_ROLE: Record<UserRole, string[]> = {
  parent: ['dashboard', 'announcements', 'attendance', 'liaison'],
  teacher: ['dashboard', 'attendance', 'students', 'announcements'],
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
  ],
  secretary: [
    'dashboard',
    'announcements',
    'attendance',
    'classes',
    'students',
    'teachers',
    'liaison',
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
  ],
  student: ['dashboard', 'announcements'],
};

const TAB_TITLES: Record<string, string> = {
  dashboard: 'Accueil',
  announcements: 'Circulaires & Annonces',
  attendance: 'Absences & Justificatifs',
  classes: 'Gestion des Classes',
  students: 'Registre des Élèves',
  teachers: 'Corps Enseignant',
  school_config: 'Configuration Établissement',
  liaison: 'Liaisons Parents',
  users_admin: 'Administration Utilisateurs',
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
    setActiveTab('announcements');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar strictly tailored to current user role */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
        onOpenPricing={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Role-tailored Hero Section displayed on Dashboard tab */}
        {activeTab === 'dashboard' && (
          <HeroSection
            onNavigateTab={setActiveTab}
            onOpenPricing={() => setIsSubscriptionModalOpen(true)}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
            onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
          />
        )}

        {/* Dynamic content wrapped in Mobile Simulator frame when toggled */}
        <MobileSimulatorFrame activeTab={activeTab} setActiveTab={setActiveTab}>
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
                  onClick={() => setActiveTab('dashboard')}
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
                    <ParentPortal onOpenSmsSimulator={() => setIsSmsModalOpen(true)} />
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
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                      <h3 className="text-lg font-bold text-slate-900">Espace Élève Consultatif</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Accès simplifié aux devoirs et calendrier scolaire validé par vos parents et l'équipe pédagogique.
                      </p>
                      <button
                        onClick={() => setActiveTab('announcements')}
                        className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Consulter les devoirs & circulaires
                      </button>
                    </div>
                  )}
                </>
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

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSmsModalOpen(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Simulateur SMS
            </button>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cloisonnement strict des données</span>
            </div>
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
