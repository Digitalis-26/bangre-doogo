'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { X, Smartphone, MessageSquare, Send, CheckCheck, Signal, Wifi, Battery } from 'lucide-react';

interface SmsSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmsSimulatorModal({ isOpen, onClose }: SmsSimulatorModalProps) {
  const { currentSchool, announcements, attendance } = useSchool();
  const [operator, setOperator] = useState<'orange' | 'moov' | 'whatsapp'>('whatsapp');
  const [selectedAnnouncementIndex, setSelectedAnnouncementIndex] = useState(0);

  if (!isOpen) return null;

  const currentAnn = announcements[selectedAnnouncementIndex] || announcements[0];
  const latestAbsence = attendance.find((a) => a.status === 'absent' || a.status === 'late');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Aperçu SMS & WhatsApp
            </h2>
            <p className="text-xs text-slate-500">
              Rendu des messages envoyés aux familles (Orange, Moov, WhatsApp)
            </p>
          </div>
        </div>

        {/* Operator selector */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setOperator('whatsapp')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              operator === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            WhatsApp (Smartphone)
          </button>
          <button
            onClick={() => setOperator('orange')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              operator === 'orange' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            SMS Orange BF (2G/3G)
          </button>
          <button
            onClick={() => setOperator('moov')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              operator === 'moov' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            SMS Moov Africa
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Controls & message selector */}
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Sélectionner l'annonce à simuler
              </label>
              <select
                value={selectedAnnouncementIndex}
                onChange={(e) => setSelectedAnnouncementIndex(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
              >
                {announcements.map((ann, idx) => (
                  <option key={ann.id} value={idx}>
                    {ann.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-900">Pourquoi cette double passerelle ?</div>
              <p className="text-slate-600 leading-relaxed">
                Au Burkina Faso et dans la sous-région, environ 30% des parents n'ont pas de connexion internet mobile permanente.
              </p>
              <p className="text-slate-600 leading-relaxed">
                ÉcoleConnect permet donc de diffuser gratuitement via l'application web pour les parents connectés, tout en conservant une passerelle SMS pour les alertes d'absences le matin même et les convocations urgentes.
              </p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div className="font-semibold text-emerald-900 mb-1">Impact sur le budget de l'école</div>
              <p className="text-emerald-800 leading-relaxed">
                Dans le forfait découverte (0 FCFA), l'envoi in-app est illimité. Les SMS optionnels peuvent être activés ultérieurement avec un pack prépayé à coût réel sans abonnement supplémentaire.
              </p>
            </div>
          </div>

          {/* Smartphone mockup */}
          <div className="flex justify-center">
            <div className="w-[300px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800">
              {/* Phone speaker & notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Phone Screen */}
              <div
                className={`rounded-[24px] overflow-hidden min-h-[460px] flex flex-col ${
                  operator === 'whatsapp' ? 'bg-[#efeae2]' : 'bg-slate-100'
                }`}
              >
                {/* Status Bar */}
                <div
                  className={`px-4 py-1.5 flex items-center justify-between text-[10px] font-mono ${
                    operator === 'whatsapp' ? 'bg-[#008069] text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>08:42</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Header */}
                <div
                  className={`px-3 py-2 border-b flex items-center gap-2 ${
                    operator === 'whatsapp'
                      ? 'bg-[#008069] text-white border-[#006e5a]'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs">
                    GS
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs truncate">
                      {currentSchool.name.replace('Groupe Scolaire ', 'GS ')}
                    </div>
                    <div className="text-[10px] opacity-80">
                      {operator === 'whatsapp' ? 'Compte vérifié officiel' : operator === 'orange' ? 'Orange BF (+226)' : 'Moov Africa (+226)'}
                    </div>
                  </div>
                </div>

                {/* Message Flow */}
                <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                  {/* Date badge */}
                  <div className="text-center">
                    <span className="text-[10px] bg-black/10 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                      Aujourd'hui
                    </span>
                  </div>

                  {/* Absence alert bubble */}
                  {latestAbsence && (
                    <div className="bg-red-50 border border-red-200 text-red-950 p-2.5 rounded-xl shadow-2xs max-w-[90%]">
                      <div className="font-bold text-[11px] text-red-700 flex items-center gap-1 mb-0.5">
                        <span>ALERTE ÉCOLE</span>
                      </div>
                      <p className="text-[11px] leading-snug">
                        {latestAbsence.studentName} a été signalé{' '}
                        {latestAbsence.status === 'absent' ? 'absent(e)' : `en retard (${latestAbsence.durationMinutes}m)`}{' '}
                        ce matin en {latestAbsence.className}.
                      </p>
                      <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-red-600">
                        <span>08:15</span>
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                      </div>
                    </div>
                  )}

                  {/* Announcement bubble */}
                  <div
                    className={`p-2.5 rounded-xl shadow-2xs max-w-[90%] ${
                      operator === 'whatsapp'
                        ? 'bg-white text-slate-900 border border-slate-200'
                        : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-emerald-800 mb-0.5">
                      {currentAnn?.title}
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-800">
                      {currentAnn?.smsVersion || currentAnn?.content.slice(0, 140) + '...'}
                    </p>
                    <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-slate-400">
                      <span>08:30</span>
                      <CheckCheck className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                </div>

                {/* Bottom Input simulator */}
                <div className="p-2 bg-white border-t border-slate-200 flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full px-3 py-1 text-[11px] text-slate-400">
                    Répondre à la vie scolaire...
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
          >
            Fermer le simulateur
          </button>
        </div>
      </div>
    </div>
  );
}
