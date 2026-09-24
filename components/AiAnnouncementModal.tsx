'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Sparkles, X, Check, Copy, AlertCircle, Loader2 } from 'lucide-react';

interface AiAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (draft: { title: string; content: string; smsVersion: string }) => void;
}

const FREQUENT_TOPICS = [
  {
    label: 'Réunion des parents d\'élèves (APE)',
    topic: 'Assemblée générale et rencontre parents-enseignants trimestrielle',
    tone: 'Bienveillant et mobilisateur',
  },
  {
    label: 'Évaluation & Devoir surveillé',
    topic: 'Devoir de synthèse et consignes de révisions strictes',
    tone: 'Pédagogique et structuré',
  },
  {
    label: 'Fermeture / Pluie ou intempérie',
    topic: 'Suspension temporaire des cours pour intempéries ou jour férié officiel',
    tone: 'Urgent et clair',
  },
  {
    label: 'Campagne de santé & vaccins',
    topic: 'Passage des agents de santé pour bilan médical et vaccination',
    tone: 'Informatif et rassurant',
  },
  {
    label: 'Rappel de scolarité / Cantine',
    topic: 'Rappel courtois des échéances de scolarité et cantine scolaire',
    tone: 'Courtois, ferme et professionnel',
  },
];

export function AiAnnouncementModal({ isOpen, onClose, onApplyDraft }: AiAnnouncementModalProps) {
  const { currentSchool, classes } = useSchool();

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Bienveillant et professionnel');
  const [audience, setAudience] = useState('Tous les parents d\'élèves');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDraft, setGeneratedDraft] = useState<{
    title: string;
    content: string;
    smsVersion: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Veuillez préciser le sujet de l\'annonce.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/app/api/gemini/assist-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone,
          audience,
          schoolName: currentSchool.name,
          details,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la génération assistée.');
      }

      const data = await res.json();
      setGeneratedDraft({
        title: data.title || topic,
        content: data.content || '',
        smsVersion: data.smsVersion || '',
      });
    } catch (err: any) {
      console.error(err);
      setError('Impossible de joindre le service IA. Utilisation du modèle de secours local.');
      // Local fallback
      setGeneratedDraft({
        title: `Communication officielle : ${topic}`,
        content: `Chers parents d'élèves,\n\nNous vous prions de bien vouloir noter l'information suivante concernant ${topic}.\n\n${details ? `Précisions : ${details}\n\n` : ''}Nous vous remercions pour votre collaboration habituelle.\n\nLa Direction de ${currentSchool.name}.`,
        smsVersion: `[${currentSchool.code || 'ECOLE'}] Info : ${topic}. Détails sur ÉcoleConnect.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopySms = () => {
    if (generatedDraft?.smsVersion) {
      navigator.clipboard.writeText(generatedDraft.smsVersion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Assistant de Rédaction d'Annonces Scolaires
            </h2>
            <p className="text-xs text-slate-500">
              Rédigez des circulaires soignées et leur version SMS en quelques secondes avec Gemini
            </p>
          </div>
        </div>

        {/* Quick topic buttons */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Sujets fréquents prêts à l'emploi
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FREQUENT_TOPICS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  setTopic(t.topic);
                  setTone(t.tone);
                }}
                className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 rounded-md transition-colors text-slate-700 cursor-pointer"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sujet de l'annonce <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Réunion de rentrée des parents de CM2 ce samedi matin"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destinataires ciblés
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Tous les parents d'élèves de l'établissement">
                  Tous les parents (Tout l'établissement)
                </option>
                {classes.map((c) => (
                  <option key={c.id} value={`Parents des élèves de la classe de ${c.name}`}>
                    {c.name} ({c.gradeLevel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ton de communication
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Bienveillant, respectueux et encourageant">Bienveillant & Chaleureux</option>
                <option value="Formel, officiel et structuré">Officiel & Protocolaire</option>
                <option value="Urgent, clair et direct">Urgent & Concret</option>
                <option value="Pédagogique avec consignes précises">Pédagogique (Devoirs / Examens)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Détails complémentaires (Optionnel : heure, lieu, matériel à apporter...)
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Ex: Samedi à 09h00 précises dans la cour d'honneur. Prévoir un carnet de notes."
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rédaction en cours par l'IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Générer l'annonce et le SMS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Preview */}
        {generatedDraft && (
          <div className="mt-5 pt-4 border-t border-slate-200 space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Titre généré
              </div>
              <div className="text-sm font-bold text-slate-900">{generatedDraft.title}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Texte complet pour l'application
              </div>
              <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                {generatedDraft.content}
              </div>
            </div>

            {generatedDraft.smsVersion && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                    Version SMS / WhatsApp ultra-condensée ({generatedDraft.smsVersion.length} caractères)
                  </div>
                  <button
                    onClick={handleCopySms}
                    className="flex items-center gap-1 text-[11px] text-amber-900 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <div className="text-xs text-slate-900 font-mono bg-white/70 p-2 rounded border border-amber-200/60">
                  {generatedDraft.smsVersion}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyDraft(generatedDraft);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Insérer dans le formulaire d'annonce</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
