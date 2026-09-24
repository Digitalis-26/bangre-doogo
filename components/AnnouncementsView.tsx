'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDateNice, formatTime } from '@/lib/utils';
import {
  FileText,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  MessageSquare,
  Users,
} from 'lucide-react';

interface AnnouncementsViewProps {
  onOpenAiAssistant: () => void;
  onOpenSmsSimulator: () => void;
}

export function AnnouncementsView({ onOpenAiAssistant, onOpenSmsSimulator }: AnnouncementsViewProps) {
  const {
    currentRole,
    currentUser,
    currentSchool,
    classes,
    announcements,
    markAnnouncementAsRead,
    publishAnnouncement,
  } = useSchool();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [targetType, setTargetType] = useState<'all' | 'class'>('all');
  const [targetClassId, setTargetClassId] = useState(classes[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');
  const [category, setCategory] = useState<'general' | 'pedagogy' | 'event' | 'discipline' | 'finance'>('general');
  const [smsVersion, setSmsVersion] = useState('');

  const canPublish =
    currentRole === 'director' ||
    currentRole === 'teacher' ||
    currentRole === 'secretary' ||
    currentRole === 'super_admin';

  // Filtered announcements
  const filtered = announcements.filter((ann) => {
    if (filterCategory !== 'all' && ann.category !== filterCategory) return false;
    if (
      searchQuery &&
      !ann.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ann.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const selectedCls = classes.find((c) => c.id === targetClassId);

    publishAnnouncement({
      schoolId: currentSchool.id,
      targetType,
      targetClassId: targetType === 'class' ? targetClassId : undefined,
      targetClassName: targetType === 'class' ? selectedCls?.name : undefined,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentRole === 'director' ? 'Direction' : 'Enseignant',
      title,
      content,
      smsVersion: smsVersion || `[${currentSchool.code}] ${title}`,
      priority,
      category,
      totalTargets: targetType === 'all' ? currentSchool.parentsCount : (selectedCls?.studentsCount || 35),
    });

    setShowCreateModal(false);
    setTitle('');
    setContent('');
    setSmsVersion('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Annonces Scolaires & Circulaires
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Canal officiel certifié pour l'ensemble des parents et enseignants
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canPublish && (
            <>
              <button
                onClick={onOpenAiAssistant}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rédiger avec IA</span>
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvelle Annonce</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Toutes ({announcements.length})
          </button>
          <button
            onClick={() => setFilterCategory('event')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterCategory === 'event' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Réunions & Événements
          </button>
          <button
            onClick={() => setFilterCategory('pedagogy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterCategory === 'pedagogy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pédagogie & Devoirs
          </button>
          <button
            onClick={() => setFilterCategory('general')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterCategory === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vie scolaire
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une circulaire..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
            Aucune annonce trouvée correspondant à vos critères.
          </div>
        ) : (
          filtered.map((ann) => {
            const readPercentage = Math.round((ann.readCount / Math.max(1, ann.totalTargets)) * 100);
            const isRead = ann.readByCurrentParent;

            return (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs transition-all hover:border-slate-300"
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
                    <span className="text-xs font-bold text-slate-800">
                      {ann.authorName} ({ann.authorRole})
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {ann.targetType === 'all' ? 'Tout l\'établissement' : ann.targetClassName}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {formatDateNice(ann.createdAt)} · {formatTime(ann.createdAt)}
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {ann.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4 font-sans">
                  {ann.content}
                </p>

                {/* SMS Version Banner if available */}
                {ann.smsVersion && (
                  <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-500">
                        Format SMS / Alerte 2G transmise :
                      </span>
                      <p className="font-mono text-[11px] text-slate-700 mt-0.5">
                        {ann.smsVersion}
                      </p>
                    </div>
                  </div>
                )}

                {/* Bottom stats and action */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Accusé de réception : <strong className="text-slate-900 font-mono">{ann.readCount} / {ann.totalTargets}</strong> parents ({readPercentage}%)
                      </span>
                    </div>

                    <div className="w-24 sm:w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full"
                        style={{ width: `${readPercentage}%` }}
                      />
                    </div>
                  </div>

                  {currentRole === 'parent' && (
                    <div>
                      {isRead ? (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Lu et certifié</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => markAnnouncementAsRead(ann.id)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Confirmer la lecture
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Create Announcement */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Rédiger une nouvelle annonce scolaire
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentSchool.name} · Diffusion certifiée
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cible de diffusion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('all')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      targetType === 'all'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Tout l'établissement
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('class')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      targetType === 'class'
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    Une classe spécifique
                  </button>
                </div>
              </div>

              {targetType === 'class' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sélectionner la classe
                  </label>
                  <select
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.teacherName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre / Objet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Calendrier des examens blancs du CEP"
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
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
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
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="general">Général</option>
                    <option value="event">Événement & Réunion</option>
                    <option value="pedagogy">Pédagogie & Devoirs</option>
                    <option value="discipline">Discipline & Horaires</option>
                    <option value="finance">Scolarité</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Texte de l'annonce <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Rédigez le contenu complet..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                  value={smsVersion}
                  onChange={(e) => setSmsVersion(e.target.value)}
                  placeholder="[GS HORIZON] Calendrier CEP disponible. Merci de vérifier le sac de l'élève."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Publier l'annonce
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
