'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate } from '@/lib/utils';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Key,
  FileCheck,
  Search,
  AlertTriangle,
  Heart,
  Phone,
} from 'lucide-react';

export function LiaisonView() {
  const {
    currentSchool,
    students,
    relations,
    updateRelationStatus,
    requestParentChildLink,
    currentUser,
    currentRole,
    classes,
  } = useSchool();

  const isParent = currentRole === 'parent';
  const isTeacher = currentRole === 'teacher';
  const isStaff = currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin';

  // Teacher class
  const teacherClass = classes.find((c) => c.teacherId === currentUser.id) || classes[0];

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [matricule, setMatricule] = useState('');
  const [code, setCode] = useState('');
  const [relationType, setRelationType] = useState<'Père' | 'Mère' | 'Tuteur légal' | 'Autre'>('Père');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Filtered relations based on role
  const displayRelations = relations.filter((r) => {
    if (isParent) {
      // Parent ONLY sees their own requests
      return r.parentId === currentUser.id;
    }
    if (isTeacher) {
      // Teacher ONLY sees relations for students in their assigned class
      const st = students.find((s) => s.id === r.studentId);
      return st && st.classId === teacherClass?.id;
    }
    // Staff: can filter by status
    if (activeFilter !== 'all' && r.status !== activeFilter) return false;
    return true;
  });

  const pendingCount = relations.filter((r) => r.status === 'pending').length;
  const approvedCount = relations.filter((r) => r.status === 'approved').length;

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestParentChildLink(matricule.trim(), code.trim(), relationType);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setShowAddModal(false);
        setFeedback(null);
        setMatricule('');
        setCode('');
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {isParent ? 'Espace Famille' : isTeacher ? 'Espace Enseignant' : 'Gestion Administrative'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {isParent
              ? 'Rattachement de vos Enfants'
              : isTeacher
              ? `Contacts Parents & Tuteurs · ${teacherClass?.name || 'Classe'}`
              : 'Liaisons Parents - Enfants'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isParent
              ? 'Associez la fiche scolaire de votre enfant avec le numéro matricule et le code secret remis par l\'école.'
              : isTeacher
              ? 'Coordonnées certifiées des parents d\'élèves de votre classe pour appels et notifications.'
              : 'Validation et sécurisation des demandes de rattachement familial.'}
          </p>
        </div>

        {/* Association trigger button */}
        {(isParent || isStaff) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isParent ? 'Associer un autre enfant' : 'Ajouter un lien parent-enfant'}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 font-medium border ${
            feedback.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.success ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{feedback.message}</span>
        </div>
      )}

      {/* Parent Experience: Direct linking form right on page if they have none or want to add */}
      {isParent && (
        <div className="bg-gradient-to-br from-emerald-50 to-slate-50 border border-emerald-200 rounded-2xl p-5 shadow-xs">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1">
              <Key className="w-4 h-4 text-emerald-700" />
              <span>Comment fonctionne le rattachement sécurisé ?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Pour protéger la vie privée des élèves, chaque enfant possède un <strong>Matricule officiel</strong> et un <strong>Code de liaison secret</strong> figurant sur son certificat d'inscription ou bulletin. Dès saisie, votre demande est transmise à l'école.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Saisir le matricule & code secret de votre enfant</span>
            </button>
          </div>
        </div>
      )}

      {/* Staff KPI Cards */}
      {isStaff && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Liaisons validées</div>
            <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
              {approvedCount}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">Accès certifiés actifs</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Demandes en attente</div>
            <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
              {pendingCount}
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">À vérifier par la direction</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-500 font-medium">Isolation & Sécurité</div>
            <div className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Conforme Protection Données</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Cloisonnement strict par famille</div>
          </div>
        </div>
      )}

      {/* Staff filter tabs */}
      {isStaff && (
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Toutes ({relations.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            En attente ({pendingCount})
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Validées ({approvedCount})
          </button>
        </div>
      )}

      {/* Relations Cards Grid */}
      <div>
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">
          {isParent
            ? 'Vos enfants rattachés & demandes'
            : isTeacher
            ? `Tuteurs des élèves de ${teacherClass?.name || 'la classe'}`
            : 'Dossiers de rattachement'}
        </h2>

        {displayRelations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">
              {isParent
                ? 'Aucun enfant n\'est encore rattaché à votre compte.'
                : 'Aucune relation trouvée avec ces critères.'}
            </p>
            {isParent && (
              <p className="max-w-md mx-auto text-slate-500">
                Cliquez sur "Associer un autre enfant" ci-dessus en vous munissant du matricule et du code secret.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayRelations.map((rel) => {
              const isPending = rel.status === 'pending';
              const isApproved = rel.status === 'approved';

              return (
                <div
                  key={rel.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        {isParent ? 'Parent responsable' : 'Parent déclarant'}
                      </span>
                      <div className="font-bold text-sm text-slate-900">
                        {rel.parentName}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {rel.parentPhone} · Lien : {rel.relationType}
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPending
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isApproved ? 'Accès Validé' : isPending ? 'En cours de validation' : 'Rejeté'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">
                      Dossier élève associé
                    </span>
                    <div className="font-bold text-slate-900 text-sm">
                      {rel.studentName}
                    </div>
                    <div className="text-slate-600">
                      Classe : <strong>{rel.className}</strong>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      Matricule : {rel.studentMatricule}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Demandé le {formatDate(rel.requestedAt)}
                    </span>

                    {/* Staff validation actions (Strictly hidden from parents and teachers) */}
                    {isStaff && isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateRelationStatus(rel.id, 'rejected')}
                          className="px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          Rejeter
                        </button>
                        <button
                          onClick={() => updateRelationStatus(rel.id, 'approved')}
                          className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Valider l'accès</span>
                        </button>
                      </div>
                    )}

                    {isParent && isApproved && (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accès complet au dossier</span>
                      </span>
                    )}

                    {isParent && isPending && (
                      <span className="text-xs text-amber-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>En attente validation école</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {isParent ? 'Associer mon enfant' : 'Nouvelle association Parent - Élève'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Indiquez le matricule et le code secret fournis par l'école (sur le bulletin ou reçu)
            </p>

            <form onSubmit={handleLink} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matricule de l'élève
                </label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="Ex: HORIZ-2026-015"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code secret de validation
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: LINK-7720"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lien de parenté
                </label>
                <select
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Tuteur légal">Tuteur légal</option>
                  <option value="Autre">Autre représentant</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Cette procédure garantit qu'aucun tiers ne peut consulter les notes, absences ou informations de votre enfant sans autorisation.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Valider la liaison
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
