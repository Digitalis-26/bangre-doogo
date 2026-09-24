'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate } from '@/lib/utils';
import {
  Building2,
  Calendar,
  Save,
  CheckCircle,
  Plus,
  Play,
  Archive,
  Clock,
  Shield,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

export function SchoolConfigView() {
  const {
    currentSchool,
    updateSchoolConfig,
    academicYears,
    activeAcademicYear,
    createAcademicYear,
    activateAcademicYear,
    closeAcademicYear,
    classes,
    students,
  } = useSchool();

  // School config state
  const [name, setName] = useState(currentSchool.name);
  const [address, setAddress] = useState(currentSchool.address || '');
  const [city, setCity] = useState(currentSchool.city);
  const [phone, setPhone] = useState(currentSchool.phone);
  const [email, setEmail] = useState(currentSchool.email);
  const [code, setCode] = useState(currentSchool.code);
  const [configFeedback, setConfigFeedback] = useState<string | null>(null);

  // New Academic Year form state
  const [showYearModal, setShowYearModal] = useState(false);
  const [newYearName, setNewYearName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolConfig(currentSchool.id, {
      name,
      address,
      city,
      phone,
      email,
      code,
    });
    setConfigFeedback("Configuration de l'établissement enregistrée avec succès.");
    setTimeout(() => setConfigFeedback(null), 3500);
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearName.trim()) return;
    createAcademicYear(
      newYearName,
      startDate || '2026-10-01',
      endDate || '2027-06-30'
    );
    setShowYearModal(false);
    setNewYearName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          Établissement & Années Scolaires
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Paramètres officiels et gestion des années académiques
        </p>
      </div>

      {configFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{configFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module 1: Configuration de l'école (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Fiche d'Identité de l'Établissement
              </h2>
              <p className="text-xs text-slate-500">
                Informations figurant sur les circulaires et notifications officielles
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom officiel de l'école <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code Établissement (Clé SMS) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ville / Commune <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse physique du campus / Secteur
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Avenue, Quartier, Secteur..."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone du secrétariat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email administratif
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer les modifications</span>
              </button>
            </div>
          </form>
        </div>

        {/* Module 2: Années Scolaires (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Cycle des Années Scolaires
                  </h2>
                  <p className="text-xs text-slate-500">
                    Création, activation et clôture
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowYearModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvelle année</span>
              </button>
            </div>

            {/* List of academic years */}
            <div className="space-y-3">
              {academicYears.map((year) => {
                const isActive = year.status === 'active';
                const isClosed = year.status === 'closed';
                const isUpcoming = year.status === 'upcoming';

                return (
                  <div
                    key={year.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-50'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          Année {year.name}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                            Active (En cours)
                          </span>
                        )}
                        {isClosed && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-mono">
                            Clôturée
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono">
                            En préparation
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between mb-3">
                      <span>Du {formatDate(year.startDate)}</span>
                      <span>au {formatDate(year.endDate)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                      {!isActive && !isClosed && (
                        <button
                          onClick={() => activateAcademicYear(year.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-md cursor-pointer transition-colors"
                        >
                          <Play className="w-3 h-3" />
                          <span>Activer cette année</span>
                        </button>
                      )}

                      {isActive && (
                        <button
                          onClick={() => closeAcademicYear(year.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer transition-colors"
                        >
                          <Archive className="w-3 h-3" />
                          <span>Clôturer l'année</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Academic Year */}
      {showYearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Créer une nouvelle année scolaire
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Préparez la session à venir pour les nouvelles inscriptions
            </p>

            <form onSubmit={handleCreateYear} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Libellé de l'année (Ex: 2026-2027)
                </label>
                <input
                  type="text"
                  value={newYearName}
                  onChange={(e) => setNewYearName(e.target.value)}
                  placeholder="2026-2027"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date de rentrée
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date de fin d'année
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowYearModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Créer l'année
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
