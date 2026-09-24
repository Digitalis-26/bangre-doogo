'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate } from '@/lib/utils';
import {
  UserCheck,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Key,
  FileCheck,
  Search,
  AlertTriangle,
} from 'lucide-react';

export function LiaisonView() {
  const {
    currentSchool,
    students,
    relations,
    updateRelationStatus,
    requestParentChildLink,
    currentUser,
    currentRole,
  } = useSchool();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [matricule, setMatricule] = useState('');
  const [code, setCode] = useState('');
  const [relationType, setRelationType] = useState<'Père' | 'Mère' | 'Tuteur légal' | 'Autre'>('Père');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const filteredRelations = relations.filter((r) => {
    if (activeFilter !== 'all' && r.status !== activeFilter) return false;
    return true;
  });

  const pendingCount = relations.filter((r) => r.status === 'pending').length;
  const approvedCount = relations.filter((r) => r.status === 'approved').length;

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    const res = requestParentChildLink(matricule, code, relationType);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setShowAddModal(false);
        setFeedback(null);
        setMatricule('');
        setCode('');
      }, 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Liaisons Parents - Enfants
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation des demandes de rattachement familial
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Associer un enfant</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Liaisons validées</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {approvedCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Accès certifiés actifs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Demandes en attente</div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">À vérifier par la direction</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Isolation & Sécurité</div>
          <div className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Conforme RGPD / Sahel</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Zéro fuite entre familles</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Toutes ({relations.length})
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          En attente ({pendingCount})
        </button>
        <button
          onClick={() => setActiveFilter('approved')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
          }`}
        >
          Validées ({approvedCount})
        </button>
      </div>

      {/* Relations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRelations.map((rel) => {
          const isPending = rel.status === 'pending';
          const isApproved = rel.status === 'approved';

          return (
            <div
              key={rel.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Parent déclarant
                  </span>
                  <div className="font-bold text-sm text-slate-900">
                    {rel.parentName}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {rel.parentPhone} · Lien : {rel.relationType}
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800'
                      : isPending
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isApproved ? 'Accès Validé' : isPending ? 'En attente' : 'Rejeté'}
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <span className="text-slate-400 font-semibold text-[10px] uppercase">
                  Dossier élève associé
                </span>
                <div className="font-bold text-slate-900 text-sm">
                  {rel.studentName}
                </div>
                <div className="text-slate-600">
                  Classe : <strong>{rel.className}</strong>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Matricule : {rel.studentMatricule}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Demandé le {formatDate(rel.requestedAt)}
                </span>

                {/* Director actions */}
                {(currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin') && isPending && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateRelationStatus(rel.id, 'rejected')}
                      className="px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => updateRelationStatus(rel.id, 'approved')}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Valider l'accès</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Nouvelle association Parent - Élève
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Code fourni sur le bulletin scolaire officiel
            </p>

            <form onSubmit={handleLink} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matricule de l'élève
                </label>
                <input
                  type="text"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="Ex: HORIZ-2026-015"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Code secret de validation
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Ex: LINK-7720"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qualité du représentant
                </label>
                <select
                  value={relationType}
                  onChange={(e: any) => setRelationType(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Tuteur légal">Tuteur légal</option>
                  <option value="Autre">Autre représentant</option>
                </select>
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs ${
                    feedback.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Vérifier & Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
