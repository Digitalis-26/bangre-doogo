'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate, formatDateNice, formatTime } from '@/lib/utils';
import {
  UserCheck,
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  CheckCircle2,
  FileText,
  Phone,
  ShieldAlert,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface ParentPortalProps {
  onOpenSmsSimulator: () => void;
}

export function ParentPortal({ onOpenSmsSimulator }: ParentPortalProps) {
  const {
    currentUser,
    currentSchool,
    myChildren,
    selectedChildId,
    setSelectedChildId,
    announcements,
    markAnnouncementAsRead,
    attendance,
    requestParentChildLink,
    submitAbsenceJustification,
    relations,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'announcements' | 'attendance' | 'liaison'>('announcements');
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [linkMatricule, setLinkMatricule] = useState('');
  const [linkCode, setLinkCode] = useState('');
  const [linkRelation, setLinkRelation] = useState<'Père' | 'Mère' | 'Tuteur légal' | 'Autre'>('Père');
  const [linkFeedback, setLinkFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Parent Justification state
  const [selectedRecordToJustify, setSelectedRecordToJustify] = useState<any | null>(null);
  const [justificationReasonInput, setJustificationReasonInput] = useState('');
  const [justificationSentSuccess, setJustificationSentSuccess] = useState(false);

  // Active child
  const activeChild = myChildren.find((c) => c.id === selectedChildId) || myChildren[0];

  // Filter announcements for the active child's class or whole school
  const relevantAnnouncements = announcements.filter((ann) => {
    if (ann.targetType === 'all') return true;
    if (activeChild && ann.targetClassId === activeChild.classId) return true;
    return false;
  });

  // Filter attendance for the active child
  const childAttendance = attendance.filter((att) => {
    if (!activeChild) return false;
    return att.studentId === activeChild.id;
  });

  const totalAbsences = childAttendance.filter((a) => a.status === 'absent').length;
  const totalLates = childAttendance.filter((a) => a.status === 'late').length;

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkMatricule || !linkCode) return;
    const res = requestParentChildLink(linkMatricule, linkCode, linkRelation);
    setLinkFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setShowAddChildModal(false);
        setLinkFeedback(null);
        setLinkMatricule('');
        setLinkCode('');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Parent Welcome Bar with Children Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Espace Famille Sécurisé
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Bienvenue, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivi scolaire en direct · {currentSchool.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddChildModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Associer un enfant</span>
            </button>
          </div>
        </div>

        {/* Children selector tabs */}
        <div className="pt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Enfant suivi :
          </label>

          {myChildren.length === 0 ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              Aucun enfant n'est encore associé à votre compte. Cliquez sur "Associer un enfant" avec le code secret remis par l'école.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {myChildren.map((child) => {
                const isSelected = child.id === activeChild?.id;
                return (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChildId(child.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-white text-emerald-900' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {child.firstName.charAt(0)}
                      {child.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-tight">
                        {child.firstName} {child.lastName}
                      </div>
                      <div className={`text-[11px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {child.className} · {child.matricule}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {activeChild && (
        <>
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Annonces ({relevantAnnouncements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Présences ({childAttendance.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('liaison')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'liaison'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Cahier de liaison</span>
            </button>
          </div>

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              {relevantAnnouncements.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                  Aucune annonce récente pour cette classe.
                </div>
              ) : (
                <div className="space-y-3">
                  {relevantAnnouncements.map((ann) => {
                    const isRead = ann.readByCurrentParent;
                    return (
                      <div
                        key={ann.id}
                        className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                          isRead ? 'border-slate-200' : 'border-emerald-300 ring-2 ring-emerald-50'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            {ann.priority === 'urgent' && (
                              <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                Urgent
                              </span>
                            )}
                            {ann.priority === 'important' && (
                              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                Important
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-600">
                              {ann.authorName} ({ann.authorRole})
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-xs text-slate-500">
                              {ann.targetType === 'all' ? 'Tout l\'établissement' : ann.targetClassName}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                            {formatDateNice(ann.createdAt)} · {formatTime(ann.createdAt)}
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-2">
                          {ann.title}
                        </h3>

                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                          {ann.content}
                        </p>

                        {/* Read Acknowledgment button */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                          <div className="text-xs text-slate-500 flex items-center gap-1.5">
                            {isRead ? (
                              <span className="text-emerald-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Accusé de lecture confirmé par vous
                              </span>
                            ) : (
                              <span className="text-amber-700 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                En attente de votre confirmation de lecture
                              </span>
                            )}
                          </div>

                          {!isRead && (
                            <button
                              onClick={() => markAnnouncementAsRead(ann.id)}
                              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>J'ai pris connaissance de cette annonce</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Absences enregistrées</div>
                  <div className="text-2xl font-bold text-red-600 font-mono tabular-nums mt-1">
                    {totalAbsences}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Ce trimestre</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Retards signalés</div>
                  <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
                    {totalLates}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Total cumulé</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Taux d'assiduité estimé</div>
                  <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
                    {totalAbsences === 0 ? '100%' : `${Math.round(100 - totalAbsences * 2.5)}%`}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Régulier</div>
                </div>
              </div>

              {/* Records List */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Historique des pointages & justifications
                  </span>
                  <span className="text-xs text-slate-500">
                    Transmis en direct par l'enseignant
                  </span>
                </div>

                {childAttendance.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Aucune absence ni retard n'a été signalé pour cet élève. Assiduité exemplaire !
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {childAttendance.map((rec) => (
                      <div key={rec.id} className="p-4 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                rec.status === 'absent'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {rec.status === 'absent' ? 'Absence' : `Retard de ${rec.durationMinutes || 15} min`}
                            </span>
                            <span className="text-xs font-semibold text-slate-800">
                              Session {rec.session}
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-xs text-slate-500">
                              Pointé par {rec.recordedBy}
                            </span>
                          </div>

                          {rec.reason && (
                            <p className="text-xs text-slate-700">
                              <strong>Motif :</strong> {rec.reason}
                            </p>
                          )}

                          <div className="text-[11px] text-slate-400">
                            {rec.isJustified ? (
                              <span className="text-emerald-700 font-medium">✓ Absence justifiée</span>
                            ) : rec.justificationStatus === 'pending' ? (
                              <span className="text-blue-700 font-medium">⌛ Justificatif transmis à l'école (en cours d'examen)</span>
                            ) : (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-red-600 font-medium">⚠ Non justifiée</span>
                                <button
                                  onClick={() => {
                                    setSelectedRecordToJustify(rec);
                                    setJustificationReasonInput('');
                                    setJustificationSentSuccess(false);
                                  }}
                                  className="px-2 py-0.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer transition-colors"
                                >
                                  Fournir un justificatif
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-mono font-bold text-slate-800">
                            {formatDateNice(rec.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Liaison tab */}
          {activeTab === 'liaison' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dossier de l'élève & Référents</span>
                </h3>

                <div className="text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Nom & Prénom :</span>
                    <span className="font-semibold">{activeChild.firstName} {activeChild.lastName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Matricule Scolaire :</span>
                    <span className="font-mono font-semibold">{activeChild.matricule}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Classe :</span>
                    <span className="font-semibold">{activeChild.className}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Parent déclarant :</span>
                    <span className="font-semibold">{currentUser.name} ({currentUser.phone})</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Contacts Rapides Établissement</span>
                </h3>

                <div className="text-xs space-y-2.5 text-slate-700">
                  <p className="text-slate-600">
                    Pour toute urgence concernant {activeChild.firstName}, contactez directement le secrétariat ou la vie scolaire :
                  </p>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">{currentSchool.name}</div>
                    <div className="text-slate-600">{currentSchool.phone} · {currentSchool.email}</div>
                    <div className="text-[11px] text-slate-500">{currentSchool.city}</div>
                  </div>
                  <button
                    onClick={onOpenSmsSimulator}
                    className="w-full py-2 px-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Tester la réception SMS sur mon numéro
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal: Link child via code */}
      {showAddChildModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Associer un élève à votre compte
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Pour des raisons de stricte confidentialité des mineurs, munissez-vous du matricule et du code secret figurant sur le bulletin officiel de l'élève.
            </p>

            <form onSubmit={handleLinkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matricule de l'élève <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={linkMatricule}
                  onChange={(e) => setLinkMatricule(e.target.value)}
                  placeholder="Ex: HORIZ-2026-088"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Exemples de démo : HORIZ-2026-088 ou HORIZ-2026-015
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code secret de liaison <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value)}
                  placeholder="Ex: LINK-8841"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <span className="text-[10px] text-slate-400">
                  Exemples de démo : LINK-8841 ou LINK-7720
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lien de parenté
                </label>
                <select
                  value={linkRelation}
                  onChange={(e: any) => setLinkRelation(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Tuteur légal">Tuteur légal</option>
                  <option value="Autre">Autre représentant</option>
                </select>
              </div>

              {linkFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    linkFeedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {linkFeedback.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChildModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Vérifier & Associer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Submit Absence Justification */}
      {selectedRecordToJustify && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Justifier l'absence de {activeChild?.firstName}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Date : {formatDate(selectedRecordToJustify.date)} ({selectedRecordToJustify.session})
            </p>

            {justificationSentSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Justificatif transmis à l'administration de l'école avec succès !</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!justificationReasonInput.trim()) return;
                  submitAbsenceJustification(
                    selectedRecordToJustify.id,
                    justificationReasonInput.trim(),
                    currentUser.name
                  );
                  setJustificationSentSuccess(true);
                  setTimeout(() => {
                    setSelectedRecordToJustify(null);
                    setJustificationSentSuccess(false);
                  }, 2000);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Motif ou explication des parents <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={justificationReasonInput}
                    onChange={(e) => setJustificationReasonInput(e.target.value)}
                    rows={3}
                    placeholder="Ex: Mon enfant a souffert d'un épisode fébrile (paludisme). Certificat médical joint ce matin au maître."
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRecordToJustify(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                  >
                    Transmettre à l'école
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
