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
  } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'absent' | 'late'>('all');
  const [searchStudent, setSearchStudent] = useState('');

  // Quick Absence Recording state
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [attStatus, setAttStatus] = useState<'absent' | 'late'>('absent');
  const [session, setSession] = useState<'Matin' | 'Après-midi'>('Matin');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(15);
  const [isJustified, setIsJustified] = useState(false);

  // Justification Review Modal state
  const [selectedRecordForJustify, setSelectedRecordForJustify] = useState<any | null>(null);
  const [customJustificationText, setCustomJustificationText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter attendance
  const filteredRecords = attendance.filter((rec) => {
    if (selectedClassId !== 'all' && rec.classId !== selectedClassId) return false;
    if (selectedStatusFilter !== 'all' && rec.status !== selectedStatusFilter) return false;
    if (searchStudent && !rec.studentName.toLowerCase().includes(searchStudent.toLowerCase())) return false;
    return true;
  });

  const totalAbsents = attendance.filter((a) => a.status === 'absent').length;
  const totalLates = attendance.filter((a) => a.status === 'late').length;
  const pendingJustifications = attendance.filter((a) => a.justificationStatus === 'pending').length;

  const handleManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === targetStudentId);
    if (!st) return;

    recordAttendance(st.classId, st.id, attStatus, session, {
      reason,
      durationMinutes: attStatus === 'late' ? duration : undefined,
      isJustified,
    });

    setFeedback(`Pointage enregistré pour ${st.firstName} ${st.lastName}. Notification envoyée aux parents.`);
    setShowAddModal(false);
    setReason('');
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

  const handleAddDirectJustification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForJustify || !customJustificationText) return;
    submitAbsenceJustification(selectedRecordForJustify.id, customJustificationText, currentUser.name);
    reviewAbsenceJustification(selectedRecordForJustify.id, 'accepted');
    setFeedback(`Motif de justification enregistré pour ${selectedRecordForJustify.studentName}.`);
    setSelectedRecordForJustify(null);
    setCustomJustificationText('');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Registre des Absences, Retards & Justifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enregistrement quotidien, traitement des justificatifs et notification automatique aux familles
          </p>
        </div>

        {(currentRole === 'director' || currentRole === 'teacher' || currentRole === 'secretary') && (
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Absences enregistrées</div>
          <div className="text-2xl font-bold text-red-600 font-mono tabular-nums mt-1">
            {totalAbsents}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Alertes parents transmises</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Retards signalés</div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
            {totalLates}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Moyenne : 18 min</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Justificatifs en attente</div>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums mt-1">
            {pendingJustifications}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">À valider par la direction</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
                <th className="py-3 px-4">Motif & Justification</th>
                <th className="py-3 px-4">Enregistré par</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Aucun incident d'assiduité ne correspond à vos critères.
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
                      <div>
                        {formatDateNice(rec.date)}
                      </div>
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
                      <div className="text-slate-800">{rec.reason || 'Aucun motif renseigné'}</div>
                      <div className="mt-1 flex items-center gap-1.5">
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
                          <span className="text-[11px] text-slate-500 italic truncate block">
                            "{rec.justificationReason}"
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {rec.recordedBy}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRecordForJustify(rec);
                          setCustomJustificationText(rec.justificationReason || '');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-slate-200"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Justification</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Recording Modal */}
      {showAddModal && (
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
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.className})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={attStatus}
                    onChange={(e: any) => setAttStatus(e.target.value)}
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
                    onChange={(e: any) => setSession(e.target.value)}
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
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={5}
                    max={120}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Motif ou circonstance
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Maladie, embouteillage, panne de véhicule..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="direct-justified"
                  checked={isJustified}
                  onChange={(e) => setIsJustified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="direct-justified" className="text-xs text-slate-700 cursor-pointer">
                  L'élève a fourni un justificatif recevable dès l'arrivée
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enregistrer & Notifier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Justification Review Modal */}
      {selectedRecordForJustify && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Justification d'absence / retard
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pour <strong>{selectedRecordForJustify.studentName}</strong> ({selectedRecordForJustify.className}) le {formatDate(selectedRecordForJustify.date)}
            </p>

            {selectedRecordForJustify.justificationReason && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-blue-900">Justificatif soumis par la famille :</span>
                <p className="text-blue-800 italic">"{selectedRecordForJustify.justificationReason}"</p>
                {selectedRecordForJustify.justificationSubmittedBy && (
                  <p className="text-[11px] text-blue-600">
                    Transmis par : {selectedRecordForJustify.justificationSubmittedBy}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleApproveJustification(selectedRecordForJustify.id)}
                    className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accepter</span>
                  </button>
                  <button
                    onClick={() => handleRejectJustification(selectedRecordForJustify.id)}
                    className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Rejeter</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleAddDirectJustification} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ajouter ou modifier le motif officiel de justification
                </label>
                <textarea
                  value={customJustificationText}
                  onChange={(e) => setCustomJustificationText(e.target.value)}
                  rows={3}
                  placeholder="Ex: Certificat médical présenté à la rentrée / Mot d'excuse écrit des parents..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForJustify(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Enregistrer comme justifiée
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
