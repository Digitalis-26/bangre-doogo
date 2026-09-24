'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate, formatTime } from '@/lib/utils';
import {
  Building2,
  Users,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  Sparkles,
  Send,
  UserCheck,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';

interface DirectorPortalProps {
  onOpenAiAssistant: () => void;
  onOpenPricing: () => void;
}

export function DirectorPortal({ onOpenAiAssistant, onOpenPricing }: DirectorPortalProps) {
  const {
    currentUser,
    currentSchool,
    classes,
    students,
    relations,
    updateRelationStatus,
    announcements,
    publishAnnouncement,
    attendance,
  } = useSchool();

  // Stats
  const pendingRelations = relations.filter((r) => r.status === 'pending');
  const approvedRelations = relations.filter((r) => r.status === 'approved');
  const today = new Date().toISOString().split('T')[0];
  const todayAbsences = attendance.filter((a) => a.date === today && a.status === 'absent');
  const todayLates = attendance.filter((a) => a.date === today && a.status === 'late');

  // Form states for School-wide announcement
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'important' | 'urgent'>('urgent');
  const [annCategory, setAnnCategory] = useState<'general' | 'event' | 'discipline' | 'finance'>('general');
  const [annSms, setAnnSms] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePublishSchoolAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    publishAnnouncement({
      schoolId: currentSchool.id,
      targetType: 'all',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: 'Direction',
      title: annTitle,
      content: annContent,
      smsVersion: annSms || `[${currentSchool.code}] ${annTitle}. Détails sur ÉcoleConnect.`,
      priority: annPriority,
      category: annCategory,
      totalTargets: currentSchool.parentsCount,
    });

    setSuccessMsg('Circulaire officielle publiée pour l\'ensemble de l\'établissement.');
    setAnnTitle('');
    setAnnContent('');
    setAnnSms('');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Direction & Administration Scolaire
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {currentSchool.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentSchool.city} · {currentSchool.phone} · Forfait :{' '}
            <span className="font-semibold text-emerald-700 capitalize">
              {currentSchool.plan === 'free' ? 'Découverte (0 FCFA)' : currentSchool.plan === 'main' ? 'Principal (10 000 FCFA/mois)' : 'Avancé'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPricing}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Gérer l'abonnement SaaS
          </button>
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rédiger avec IA</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Élèves enregistrés</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {currentSchool.studentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Sur {classes.length} classes ouvertes
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Parents connectés</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {approvedRelations.length + 280}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            ~91% des foyers couverts
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Liaisons en attente</div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
            {pendingRelations.length}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            Validation direction requise
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Absences du jour</div>
          <div className="text-2xl font-bold text-slate-800 font-mono tabular-nums mt-1">
            {todayAbsences.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            + {todayLates.length} retards signalés
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Parent-Child Link Validation Queue (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>File d'Approbation des Liaisons Parents-Élèves</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Garantit la stricte confidentialité des mineurs conformément aux exigences légales
                </p>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                {pendingRelations.length} à valider
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingRelations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Toutes les liaisons parents-élèves sont à jour.
                </div>
              ) : (
                pendingRelations.map((rel) => (
                  <div key={rel.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {rel.parentName} ({rel.relationType})
                        </div>
                        <div className="text-xs text-slate-600 font-mono">
                          Téléphone : {rel.parentPhone}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTime(rel.requestedAt)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="text-slate-500 text-[11px]">Élève concerné :</div>
                      <div className="font-semibold text-slate-900">
                        {rel.studentName} · {rel.className}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Matricule : {rel.studentMatricule}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => updateRelationStatus(rel.id, 'rejected')}
                        className="px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Rejeter
                      </button>
                      <button
                        onClick={() => updateRelationStatus(rel.id, 'approved')}
                        className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Valider la liaison</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {approvedRelations.length > 0 && (
              <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                <span>Dernière liaison validée : {approvedRelations[0].studentName}</span>
                <span className="text-emerald-700 font-semibold font-mono">Actif</span>
              </div>
            )}
          </div>

          {/* Classes Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Classes et Responsables Pédagogiques</span>
            </h3>

            <div className="space-y-2">
              {classes.map((cls) => (
                <div key={cls.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{cls.name}</div>
                    <div className="text-slate-500">{cls.teacherName} · {cls.room}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-800">{cls.studentsCount} élèves</div>
                    <div className="text-[11px] text-emerald-700">Appel à jour</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Publish Official School Announcement (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Diffuser une circulaire officielle
                </h3>
                <p className="text-xs text-slate-500">
                  Transmise à tous les parents de l'établissement
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

            {successMsg && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium">
                {successMsg}
              </div>
            )}

            <form onSubmit={handlePublishSchoolAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Objet de la circulaire <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Ex: Assemblée générale des parents d'élèves ce samedi"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Niveau d'urgence
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
                    <option value="general">Général & Institutionnel</option>
                    <option value="event">Événement & Réunion</option>
                    <option value="discipline">Règlement & Horaires</option>
                    <option value="finance">Scolarité & Frais</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Corps du message officiel <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Rédigez l'avis ou utilisez l'assistant IA pour le générer automatiquement..."
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
                  placeholder="[GS HORIZON] AG des parents ce samedi à 09h00..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publier pour les {currentSchool.parentsCount} parents</span>
              </button>
            </form>
          </div>

          {/* School Communications History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Dernières circulaires publiées
            </h3>
            <div className="space-y-3">
              {announcements
                .filter((a) => a.targetType === 'all')
                .slice(0, 3)
                .map((ann) => {
                  const rate = Math.round((ann.readCount / Math.max(1, ann.totalTargets)) * 100);
                  return (
                    <div key={ann.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                        <span className="truncate max-w-[240px]">{ann.title}</span>
                        <span className="text-emerald-700 font-mono font-bold">{rate}% lu</span>
                      </div>
                      <p className="text-slate-500 line-clamp-2 text-[11px] mb-2">{ann.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Publié le {formatDate(ann.createdAt)}</span>
                        <span>{ann.readCount} accusés reçus</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
