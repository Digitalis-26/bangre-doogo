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
  Sparkles,
  FileText,
  UserCheck,
  Building2,
  MessageSquare,
  Clock,
  CreditCard,
} from 'lucide-react';

interface HeroSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenPricing: () => void;
  onOpenAiAssistant: () => void;
  onOpenSmsSimulator: () => void;
}

export function HeroSection({
  onNavigateTab,
  onOpenPricing,
  onOpenAiAssistant,
  onOpenSmsSimulator,
}: HeroSectionProps) {
  const { currentRole, currentSchool, currentUser, myChildren, relations, classes } = useSchool();

  // Teacher class
  const teacherClass = classes.find((c) => c.teacherId === currentUser.id) || classes[0];
  const pendingRelationsCount = relations.filter((r) => r.status === 'pending').length;

  return (
    <div className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden mb-8 border border-emerald-900/40">
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl space-y-6">
        {/* Role Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {currentRole === 'parent' && 'Espace Famille Sécurisé'}
            {currentRole === 'teacher' && 'Espace Pédagogique Enseignant'}
            {(currentRole === 'director' || currentRole === 'secretary') && "Direction de l'Établissement"}
            {currentRole === 'super_admin' && 'Console Super Admin SaaS'}
            {currentRole === 'student' && 'Espace Élève Consultatif'}
          </span>
          <span className="text-emerald-500/60">·</span>
          <span className="text-white font-medium">{currentUser.name}</span>
        </div>

        {/* Dynamic Role Headline & Subtitle */}
        {currentRole === 'parent' && (
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Suivi scolaire en direct pour votre famille.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consultez les devoirs, signez les circulaires officielles avec accusé de réception et justifiez les absences de vos enfants sans déplacement.
            </p>
            {myChildren.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400">Enfants rattachés :</span>
                {myChildren.map((c) => (
                  <span key={c.id} className="px-2.5 py-0.5 rounded-md bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 font-medium">
                    {c.firstName} ({classes.find((cl) => cl.id === c.classId)?.name || 'Classe'})
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {currentRole === 'teacher' && (
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Gestion simplifiée de votre classe {teacherClass?.name || ''}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Effectuez l'appel en un clic, publiez les devoirs et communiquez instantanément avec les parents de vos élèves par SMS et notifications.
            </p>
          </div>
        )}

        {(currentRole === 'director' || currentRole === 'secretary') && (
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Pilotage & communication de {currentSchool.name}.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Supervisez les effectifs, diffusez les circulaires officielles sans frais d'impression et validez les demandes de liaison familiale.
            </p>
          </div>
        )}

        {currentRole === 'super_admin' && (
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Console Super Administrateur SaaS ÉcoleConnect.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Supervision des écoles partenaires, forfaits souscrits, distribution SMS et configuration globale.
            </p>
          </div>
        )}

        {currentRole === 'student' && (
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Espace Élève & Orientation Scolaire.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Consultez vos devoirs, le calendrier scolaire et explorez les établissements partenaires pour votre future orientation (lycées d'excellence, filières bilingues et techniques).
            </p>
          </div>
        )}

        {/* Role-Specific Action Buttons (Strictly isolated, NO role-switching) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {currentRole === 'parent' && (
            <>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Voir les devoirs & circulaires</span>
              </button>

              <button
                onClick={() => onNavigateTab('school_search')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Trouver un nouvel établissement</span>
              </button>

              <button
                onClick={() => onNavigateTab('attendance')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Absences & Justificatifs</span>
              </button>

              <button
                onClick={() => onNavigateTab('liaison')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Associer un autre enfant</span>
              </button>

              <button
                onClick={() => onNavigateTab('scolarite')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Payer la Scolarité & Quittances</span>
              </button>
            </>
          )}

          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Consulter mes devoirs</span>
              </button>

              <button
                onClick={() => onNavigateTab('school_search')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Trouver un nouvel établissement</span>
              </button>
            </>
          )}

          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Faire l'appel du jour</span>
              </button>

              <button
                onClick={onOpenAiAssistant}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Rédiger un devoir (IA)</span>
              </button>

              <button
                onClick={() => onNavigateTab('students')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Liste de mes élèves</span>
              </button>
            </>
          )}

          {(currentRole === 'director' || currentRole === 'secretary') && (
            <>
              <button
                onClick={() => onNavigateTab('scolarite')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm"
              >
                <CreditCard className="w-4 h-4 text-slate-950" />
                <span>Suivi Scolarité & Relances Impayés</span>
              </button>

              <button
                onClick={onOpenAiAssistant}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Rédiger une circulaire officielle</span>
              </button>

              <button
                onClick={() => onNavigateTab('liaison')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Valider les liaisons ({pendingRelationsCount})</span>
              </button>

              <button
                onClick={onOpenPricing}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <span>Abonnement & Forfait SMS</span>
              </button>
            </>
          )}

          {currentRole === 'super_admin' && (
            <>
              <button
                onClick={() => onNavigateTab('school_config')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
              >
                <Building2 className="w-4 h-4" />
                <span>Gestion des Établissements</span>
              </button>

              <button
                onClick={() => onNavigateTab('users_admin')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Comptes Utilisateurs</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
