'use client';

import React from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  ShieldCheck,
  Building2,
  Users,
  CreditCard,
  Server,
  Layers,
  Database,
  ArrowUpRight,
  CheckCircle,
  FileCode,
} from 'lucide-react';

export function SuperAdminPortal() {
  const { schools, updateSchoolPlan, saasPlans } = useSchool();

  const totalMRR = schools.reduce((acc, s) => acc + (s.monthlyFee || 0), 0);
  const totalStudents = schools.reduce((acc, s) => acc + (s.studentsCount || 0), 0);
  const totalParents = schools.reduce((acc, s) => acc + (s.parentsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Console Super Administrateur SaaS B2B</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gestionnaire Multi-Établissements ÉcoleConnect
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Supervisez les établissements pilotes, la facturation mensuelle B2B en FCFA et l'intégrité de la séparation des données scolaires.
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 text-right">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Revenu Récurrent Mensuel (MRR)
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {totalMRR.toLocaleString('fr-FR')} FCFA
            </div>
            <span className="text-[10px] text-slate-400">
              Sur {schools.length} écoles en service
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Établissements partenaires</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {schools.length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            1 pilote gratuit + 2 abonnés actifs
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Élèves scolarisés gérés</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Burkina Faso (Ouaga, Bobo, Koudougou)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Parents connectés actifs</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {totalParents}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Couverture foyer ~92%
          </div>
        </div>
      </div>

      {/* Schools Directory & Subscriptions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Annuaire des Établissements & Gestion des Forfaits
            </h2>
            <p className="text-xs text-slate-500">
              Chaque établissement dispose d'un espace isolé et d'une clé de partition multi-tenancy
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {schools.length} écoles répertoriées
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {schools.map((school) => (
            <div key={school.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{school.name}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600">{school.city}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                      school.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {school.status === 'active' ? 'Abonnement Actif' : 'Pilote Découverte'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Contact : {school.phone}</span>
                  <span>·</span>
                  <span>Code École : <strong className="font-mono text-slate-700">{school.code}</strong></span>
                  <span>·</span>
                  <span>{school.studentsCount} élèves · {school.classesCount} classes</span>
                </div>
              </div>

              {/* Plan Switcher */}
              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    {school.monthlyFee.toLocaleString('fr-FR')} FCFA / mois
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">
                    Forfait {school.plan}
                  </div>
                </div>

                <select
                  value={school.plan}
                  onChange={(e: any) => updateSchoolPlan(school.id, e.target.value)}
                  className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 cursor-pointer"
                >
                  <option value="free">Découverte (0 FCFA)</option>
                  <option value="main">Principal (10 000 FCFA/m)</option>
                  <option value="advanced">Avancé (25 000 FCFA/m)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Écoles & Synthèse SaaS */}
    </div>
  );
}
