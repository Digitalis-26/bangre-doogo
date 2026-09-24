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
import { AuthModal } from '@/components/AuthModal';
import { AiAnnouncementModal } from '@/components/AiAnnouncementModal';
import { SmsSimulatorModal } from '@/components/SmsSimulatorModal';
import { MobileSimulatorFrame } from '@/components/MobileSimulatorFrame';
import { ShieldCheck, MapPin, Heart, Sparkles } from 'lucide-react';

function AppContent() {
  const { currentRole, setCurrentRole, publishAnnouncement, currentSchool, currentUser } = useSchool();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

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

  const handleExploreRole = (role: 'director' | 'teacher' | 'parent') => {
    setCurrentRole(role);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenSmsSimulator={() => setIsSmsModalOpen(true)}
        onOpenPricing={() => setActiveTab('pricing')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section displayed on Dashboard tab */}
        {activeTab === 'dashboard' && (
          <HeroSection
            onExploreRole={handleExploreRole}
            onOpenPricing={() => setActiveTab('pricing')}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {/* Dynamic content wrapped optionally in Mobile Simulator */}
        <MobileSimulatorFrame activeTab={activeTab} setActiveTab={setActiveTab}>
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
                  onOpenPricing={() => setActiveTab('pricing')}
                />
              )}
              {currentRole === 'super_admin' && <SuperAdminPortal />}
              {currentRole === 'student' && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">Espace Élève Consultatif</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Accès simplifié aux annonces de devoirs et calendrier scolaire validé par vos parents et l'équipe pédagogique.
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

          {activeTab === 'pricing' && <PricingSection />}
        </MobileSimulatorFrame>
      </main>

      {/* Global Interactive Modals */}
      <AuthModal />

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
              onClick={() => setActiveTab('pricing')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Tarifs B2B
            </button>
            <button
              onClick={() => setIsSmsModalOpen(true)}
              className="hover:text-slate-900 cursor-pointer"
            >
              Simulateur SMS
            </button>
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Données protégées</span>
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
