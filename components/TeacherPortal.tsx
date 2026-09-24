'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Send,
  AlertTriangle,
  Users,
  FileCheck,
  Search,
  Check,
} from 'lucide-react';

interface TeacherPortalProps {
  onOpenAiAssistant: () => void;
}

export function TeacherPortal({ onOpenAiAssistant }: TeacherPortalProps) {
  const {
    currentUser,
    currentSchool,
    classes,
    students,
    attendance,
    recordAttendance,
    announcements,
    publishAnnouncement,
  } = useSchool();

  // Active class for this teacher (default to CM2 A)
  const teacherClass =
    classes.find((c) => c.teacherId === currentUser.id) ||
    classes.find((c) => c.id === 'class-cm2a') ||
    classes[0];

  const classStudents = students.filter((s) => s.classId === teacherClass.id);

  // States for Daily Roll Call
  const [session, setSession] = useState<'Matin' | 'Après-midi'>('Matin');
  const [selectedStudentStatus, setSelectedStudentStatus] = useState<
    Record<string, { status: 'present' | 'absent' | 'late'; reason?: string; duration?: number }>
  >({});
  const [callSubmittedMessage, setCallSubmittedMessage] = useState<string | null>(null);

  // States for Class Announcement Creation
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'urgent'>('important');
  const [annCategory, setAnnCategory] = useState<'pedagogy' | 'event' | 'discipline' | 'general'>('pedagogy');
  const [annSms, setAnnSms] = useState('');
  const [annSuccessMsg, setAnnSuccessMsg] = useState<string | null>(null);

  // Filter announcements published by this teacher or for this class
  const classAnnouncements = announcements.filter(
    (a) => a.targetClassId === teacherClass.id || a.authorId === currentUser.id
  );

  const handleSetStudentStatus = (
    studentId: string,
    status: 'present' | 'absent' | 'late',
    reason?: string,
    duration?: number
  ) => {
    setSelectedStudentStatus((prev) => ({
      ...prev,
      [studentId]: {
        status,
        reason: reason || (status === 'absent' ? 'Absence constatée à l\'appel' : undefined),
        duration: duration || (status === 'late' ? 15 : undefined),
      },
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: 'present' | 'absent' | 'late' }> = {};
    classStudents.forEach((st) => {
      updated[st.id] = { status: 'present' };
    });
    setSelectedStudentStatus(updated);
  };

  const handleSubmitRollCall = () => {
    let recordedCount = 0;
    classStudents.forEach((st) => {
      const entry = selectedStudentStatus[st.id] || { status: 'present' };
      recordAttendance(teacherClass.id, st.id, entry.status, session, {
        reason: entry.reason,
        durationMinutes: entry.duration,
      });
      recordedCount++;
    });

    setCallSubmittedMessage(
      `Appel de la session ${session} validé pour ${recordedCount} élèves. Les parents des élèves absents ou en retard ont été notifiés instantanément.`
    );
    setTimeout(() => setCallSubmittedMessage(null), 5000);
  };

  const handlePublishClassAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    publishAnnouncement({
      schoolId: currentSchool.id,
      targetType: 'class',
      targetClassId: teacherClass.id,
      targetClassName: teacherClass.name,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: 'Enseignant',
      title: annTitle,
      content: annContent,
      smsVersion: annSms || `[${teacherClass.name}] ${annTitle}`,
      priority: annPriority,
      category: annCategory,
      totalTargets: classStudents.length,
    });

    setAnnSuccessMsg(`Annonce publiée avec succès pour la classe ${teacherClass.name}.`);
    setAnnTitle('');
    setAnnContent('');
    setAnnSms('');
    setTimeout(() => setAnnSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Top Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Espace Enseignant Pédagogique
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {currentUser.name} · {teacherClass.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentSchool.name} · Effectif : {classStudents.length} élèves inscrits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Assistant IA Rédaction</span>
          </button>
        </div>
      </div>

      {/* Grid: Left = Roll Call (Appel) / Right = Publish Class Announcement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Section 1: Roll Call (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Registre d'Appel Express</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Pointez les présences et informez les familles en 1 clic
                </p>
              </div>

              {/* Session toggle */}
              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSession('Matin')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    session === 'Matin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Matin (07h30)
                </button>
                <button
                  type="button"
                  onClick={() => setSession('Après-midi')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    session === 'Après-midi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Après-midi (14h00)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60">
              <span className="text-xs text-slate-600 font-medium">
                {classStudents.length} élèves dans la liste
              </span>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold hover:underline cursor-pointer"
              >
                ✓ Tout marquer Présent
              </button>
            </div>
          </div>

          {callSubmittedMessage && (
            <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{callSubmittedMessage}</span>
            </div>
          )}

          {/* Student roll list */}
          <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
            {classStudents.map((student, idx) => {
              const currentStatus = selectedStudentStatus[student.id]?.status || 'present';
              const currentReason = selectedStudentStatus[student.id]?.reason || '';

              return (
                <div key={student.id} className="p-3 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400 w-5">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {student.matricule} · Contact : {student.guardianPhone}
                      </div>
                    </div>
                  </div>

                  {/* Quick status buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleSetStudentStatus(student.id, 'present')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'present'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Présent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStudentStatus(student.id, 'late', 'Retard signalé à l\'entrée', 15)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'late'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>Retard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetStudentStatus(student.id, 'absent', 'Non présent à l\'appel')}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                        currentStatus === 'absent'
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Notification automatique par SMS / App pour chaque absence ou retard
            </span>
            <button
              type="button"
              onClick={handleSubmitRollCall}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Valider l'appel de {session}
            </button>
          </div>
        </div>

        {/* Section 2: Publish Class Announcement (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Nouvelle annonce de classe
                </h3>
                <p className="text-xs text-slate-500">
                  Ciblée pour : {teacherClass.name}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAiAssistant}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rédiger avec IA</span>
              </button>
            </div>

            {annSuccessMsg && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                {annSuccessMsg}
              </div>
            )}

            <form onSubmit={handlePublishClassAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre de l'annonce / Devoir
                </label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Ex: Devoir surveillé d'histoire-géographie"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={annPriority}
                    onChange={(e: any) => setAnnPriority(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={annCategory}
                    onChange={(e: any) => setAnnCategory(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="pedagogy">Pédagogie / Devoir</option>
                    <option value="event">Événement</option>
                    <option value="discipline">Discipline</option>
                    <option value="general">Général</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contenu détaillé pour les parents
                </label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Expliquez les consignes, les pages du livre à réviser ou le matériel..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Version courte pour SMS (Optionnel, max 160 car.)
                </label>
                <input
                  type="text"
                  maxLength={160}
                  value={annSms}
                  onChange={(e) => setAnnSms(e.target.value)}
                  placeholder="[CM2 A] Devoir Histoire ce vendredi. Réviser chap. 3..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publier et transmettre aux {classStudents.length} familles</span>
              </button>
            </form>
          </div>

          {/* Class Annoncements Tracker */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Taux de lecture des annonces de la classe
            </h3>
            <div className="space-y-3">
              {classAnnouncements.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-4">
                  Aucune annonce publiée pour l'instant.
                </div>
              ) : (
                classAnnouncements.map((ann) => {
                  const percent = Math.round((ann.readCount / Math.max(1, ann.totalTargets)) * 100);
                  return (
                    <div key={ann.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                          {ann.title}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-700 font-bold">
                          {ann.readCount}/{ann.totalTargets} lu ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
