'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate, formatDateNice } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  UserCheck,
  Send,
  FileCheck,
  Check,
  X,
  ShieldCheck,
  Heart,
  Plus,
} from 'lucide-react';

export function AttendanceView() {
  const {
    currentSchool,
    classes,
    students,
    attendance,
    recordAttendance,
    submitAbsenceJustification,
    reviewAbsenceJustification,
    currentUser,
    currentRole,
    myChildren,
  } = useSchool();

  // Role permissions
  const isParent = currentRole === 'parent';
  const isTeacher = currentRole === 'teacher';
  const isDirector = currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin';

  // Teacher assigned class
  const teacherClass = classes.find((c) => c.teacherId === currentUser.id) || classes[0];

  const [selectedClassId, setSelectedClassId] = useState<string>(
    isTeacher ? teacherClass?.id || 'all' : 'all'
  );
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'absent' | 'late'>('all');
  const [searchStudent, setSearchStudent] = useState('');

  // Quick Absence Recording state (Staff only)
  const [showAddModal, setShowAddModal] = useState(false);
  const staffSelectableStudents = isTeacher
    ? students.filter((s) => s.classId === teacherClass?.id)
    : students;
  const [targetStudentId, setTargetStudentId] = useState(staffSelectableStudents[0]?.id || '');
  const [attStatus, setAttStatus] = useState<'absent' | 'late'>('absent');
  const [session, setSession] = useState<'Matin' | 'Après-midi'>('Matin');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(15);
  const [isJustified, setIsJustified] = useState(false);

  // Justification Modal states
  const [selectedRecordForJustify, setSelectedRecordForJustify] = useState<any | null>(null);
  const [customJustificationText, setCustomJustificationText] = useState('');
  const [justificationPreset, setJustificationPreset] = useState('Maladie / Paludisme');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter attendance records based strictly on role
  const filteredRecords = attendance.filter((rec) => {
    // Parent restriction: ONLY records of the parent's children
    if (isParent) {
      const isMyChild = myChildren.some((c) => c.id === rec.studentId);
      if (!isMyChild) return false;
    }

    // Teacher restriction: ONLY records of their class
    if (isTeacher) {
      if (rec.classId !== teacherClass?.id) return false;
    }

    // Director / General filters
    if (!isParent && !isTeacher && selectedClassId !== 'all' && rec.classId !== selectedClassId) {
      return false;
    }

    if (selectedStatusFilter !== 'all' && rec.status !== selectedStatusFilter) return false;
    if (searchStudent && !rec.studentName.toLowerCase().includes(searchStudent.toLowerCase())) return false;
    return true;
  });

  const totalAbsents = filteredRecords.filter((a) => a.status === 'absent').length;
  const totalLates = filteredRecords.filter((a) => a.status === 'late').length;
  const justifiedCount = filteredRecords.filter((a) => a.isJustified).length;
  const pendingJustifications = filteredRecords.filter((a) => a.justificationStatus === 'pending').length;

  const handleManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const st = staffSelectableStudents.find((s) => s.id === targetStudentId);
    if (!st) return;

    recordAttendance(st.classId, st.id, attStatus, session, {
      reason,
      durationMinutes: attStatus === 'late' ? duration : undefined,
      isJustified,
    });

    setFeedback(`Pointage enregistré pour ${st.firstName} ${st.lastName}. Notification SMS d'urgence transmise à la famille.`);
    setShowAddModal(false);
    setReason('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleParentSubmitJustification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForJustify) return;
    const finalReason = customJustificationText.trim()
      ? `${justificationPreset} : ${customJustificationText.trim()}`
      : justificationPreset;

    submitAbsenceJustification(selectedRecordForJustify.id, finalReason, currentUser.name);
    setFeedback(`Justificatif d'absence soumis avec succès pour ${selectedRecordForJustify.studentName}. Il sera validé par l'école.`);
    setSelectedRecordForJustify(null);
    setCustomJustificationText('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleApproveJustification = (recordId: string) => {
    reviewAbsenceJustification(recordId, 'accepted');
    setFeedback("Justificatif accepté. L'absence est désormais comptabilisée comme justifiée.");
    setSelectedRecordForJustify(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRejectJustification = (recordId: string) => {
    reviewAbsenceJustification(recordId, 'rejected');
    setFeedback("Justificatif rejeté. Notification transmise à la famille.");
    setSelectedRecordForJustify(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {isParent ? 'Espace Famille' : isTeacher ? 'Espace Enseignant' : 'Registre Direction'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {isParent
              ? 'Absences & Justificatifs de vos Enfants'
              : isTeacher
              ? `Feuille d'Appel & Absences · ${teacherClass?.name || 'Classe'}`
              : 'Registre des Absences, Retards & Justifications'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isParent
              ? 'Consultez les manquements d\'assiduité enregistrés par les enseignants et déposez vos justificatifs en ligne.'
              : isTeacher
              ? 'Suivi de l\'assiduité de votre classe et vérification des justificatifs transmis par les parents.'
              : 'Enregistrement quotidien, traitement des justificatifs et notification automatique aux familles.'}
          </p>
        </div>

        {/* Staff action: Record absence (Only for teachers / direction) */}
        {!isParent && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Signaler une absence / retard</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* KPI Cards adapted to role */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {isParent ? 'Absences de vos enfants' : 'Absences enregistrées'}
          </div>
          <div className="text-2xl font-bold text-red-600 font-mono tabular-nums mt-1">
            {totalAbsents}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isParent ? 'Total cumulé' : 'Alertes SMS transmises'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            {isParent ? 'Absences justifiées' : 'Retards signalés'}
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {isParent ? justifiedCount : totalLates}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isParent ? 'Validées par l\'école' : 'Moyenne : 15 min'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Justificatifs en attente</div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
            {pendingJustifications}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {isParent ? 'En cours d\'examen par la direction' : 'À valider par la direction'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class filter only for Direction */}
          {isDirector && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
              >
                <option value="all">Toutes les classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isParent && (
            <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <Heart className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Suivi pour : {myChildren.map((c) => c.firstName).join(', ') || 'Vos enfants'}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedStatusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setSelectedStatusFilter('absent')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedStatusFilter === 'absent'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Absences
            </button>
            <button
              onClick={() => setSelectedStatusFilter('late')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedStatusFilter === 'late'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600'
              }`}
            >
              Retards
            </button>
          </div>
        </div>

        {!isParent && (
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Rechercher par élève..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Élève & Classe</th>
                <th className="py-3 px-4">Date & Session</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Statut & Motif</th>
                <th className="py-3 px-4">Signalé par</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    {isParent
                      ? 'Excellente nouvelle ! Aucun retard ni absence non justifiée pour vos enfants.'
                      : 'Aucun enregistrement d\'absence ne correspond à vos filtres.'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{rec.studentName}</div>
                      <div className="text-[11px] text-slate-500">{rec.className}</div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div>{formatDateNice(rec.date)}</div>
                      <div className="text-[11px] text-slate-500">{rec.session}</div>
                    </td>

                    <td className="py-3 px-4">
                      {rec.status === 'absent' ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                          <XCircle className="w-3 h-3 text-red-600" />
                          <span>Absence</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Retard ({rec.durationMinutes || 15}m)</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-800 font-medium">
                        {rec.reason || "Motif d'absence"}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {rec.isJustified ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            ✓ Justifiée
                          </span>
                        ) : rec.justificationStatus === 'pending' ? (
                          <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            ⌛ Justificatif en attente
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                            ⚠ Non justifiée
                          </span>
                        )}
                        {rec.justificationReason && (
                          <span className="text-[11px] text-slate-600 italic block">
                            "{rec.justificationReason}"
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {rec.recordedBy}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {isParent ? (
                        rec.isJustified ? (
                          <span className="text-[11px] text-emerald-700 font-semibold">Validé</span>
                        ) : rec.justificationStatus === 'pending' ? (
                          <span className="text-[11px] text-blue-600 font-semibold">Examen en cours</span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedRecordForJustify(rec);
                              setCustomJustificationText('');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Justifier en ligne</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedRecordForJustify(rec);
                            setCustomJustificationText(rec.justificationReason || '');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-slate-200"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Examiner / Justifier</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parent Justification Modal */}
      {selectedRecordForJustify && isParent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Justifier l'absence de {selectedRecordForJustify.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Date : {formatDateNice(selectedRecordForJustify.date)} ({selectedRecordForJustify.session})
            </p>

            <form onSubmit={handleParentSubmitJustification} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motif principal
                </label>
                <select
                  value={justificationPreset}
                  onChange={(e) => setJustificationPreset(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Maladie / Paludisme">Maladie / Paludisme</option>
                  <option value="Consultation médicale ou hospitalisation">Consultation médicale ou hospitalisation</option>
                  <option value="Cas de force majeure / Famille">Cas de force majeure / Événement familial</option>
                  <option value="Panne de transport / Pluie torrentielle">Panne de transport / Intempéries</option>
                  <option value="Autre motif">Autre motif</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Précisions complémentaires ou message à la direction
                </label>
                <textarea
                  rows={3}
                  value={customJustificationText}
                  onChange={(e) => setCustomJustificationText(e.target.value)}
                  placeholder="Ex : Kadiatou a eu une forte fièvre ce matin, elle a été emmenée au dispensaire..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Signé électroniquement par {currentUser.name} ({currentUser.phone})</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForJustify(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Transmettre le justificatif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Review / Justification Modal */}
      {selectedRecordForJustify && !isParent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Traitement d'assiduité : {selectedRecordForJustify.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Classe : {selectedRecordForJustify.className} · Date : {formatDateNice(selectedRecordForJustify.date)}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-4">
              <div className="text-slate-500">Motif initial : <span className="font-semibold text-slate-800">{selectedRecordForJustify.reason || 'Non renseigné'}</span></div>
              {selectedRecordForJustify.justificationReason && (
                <div className="mt-1 text-slate-700">
                  <span className="font-semibold text-emerald-800">Justificatif famille :</span> {selectedRecordForJustify.justificationReason}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleApproveJustification(selectedRecordForJustify.id)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Valider comme Justifiée</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRejectJustification(selectedRecordForJustify.id)}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Rejeter</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForJustify(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Recording Modal (Staff only) */}
      {showAddModal && !isParent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Signaler une absence ou un retard
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enregistre le pointage et prévient immédiatement le parent responsable
            </p>

            <form onSubmit={handleManualRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Élève concerné
                </label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  {staffSelectableStudents.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Incident
                  </label>
                  <select
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="absent">Absence</option>
                    <option value="late">Retard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Session
                  </label>
                  <select
                    value={session}
                    onChange={(e) => setSession(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Matin">Matin</option>
                    <option value="Après-midi">Après-midi</option>
                  </select>
                </div>
              </div>

              {attStatus === 'late' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Durée du retard (minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={120}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motif ou observation
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex : Non présent à la première heure de cours"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="justifiedCheck"
                  checked={isJustified}
                  onChange={(e) => setIsJustified(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <label htmlFor="justifiedCheck" className="text-xs text-slate-700 cursor-pointer">
                  Marquer comme justifiée d'office (accord direction)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                  Enregistrer & Notifier SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
