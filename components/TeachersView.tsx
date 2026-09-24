'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  GraduationCap,
  Plus,
  Layers,
  Phone,
  Mail,
  CheckCircle2,
  UserCheck,
  Search,
} from 'lucide-react';

export function TeachersView() {
  const {
    users,
    classes,
    assignTeacherToClass,
    createUser,
    currentSchool,
  } = useSchool();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTeacherForAssign, setSelectedTeacherForAssign] = useState<any | null>(null);
  const [targetClassId, setTargetClassId] = useState(classes[0]?.id || '');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('Professeur des Écoles');

  const teachers = users.filter((u) => u.role === 'teacher');

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    createUser({
      name,
      email,
      phone,
      role: 'teacher',
      schoolId: currentSchool.id,
      title,
      status: 'active',
      assignedClassIds: [],
    });

    setFeedback(`Compte enseignant créé avec succès pour ${name}.`);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForAssign || !targetClassId) return;

    const cls = classes.find((c) => c.id === targetClassId);
    assignTeacherToClass(selectedTeacherForAssign.id, targetClassId);

    setFeedback(`${selectedTeacherForAssign.name} a été affecté(e) avec succès à la classe ${cls?.name}.`);
    setSelectedTeacherForAssign(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Corps Enseignant & Affectations aux Classes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gestion des enseignants titulaires, professeurs principaux et attributions pédagogiques
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un enseignant</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((teacher) => {
          const assignedClasses = classes.filter((c) => c.teacherId === teacher.id);

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    {teacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {teacher.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {teacher.title || 'Enseignant'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                    teacher.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {teacher.status === 'active' ? 'Actif' : 'Suspendu'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.email}</span>
                </div>
              </div>

              {/* Assigned Classes */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Classes prises en charge ({assignedClasses.length}) :
                </span>
                {assignedClasses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune classe assignée</p>
                ) : (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {assignedClasses.map((cls) => (
                      <span
                        key={cls.id}
                        className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded"
                      >
                        {cls.name} ({cls.studentsCount} él.)
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedTeacherForAssign(teacher);
                    setTargetClassId(classes[0]?.id || '');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                >
                  Affecter à une classe
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Créer un compte enseignant
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              L'enseignant recevra ses accès pour pointer les présences et publier des devoirs
            </p>

            <form onSubmit={handleCreateTeacher} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom & Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: M. Jean-Baptiste Sawadogo"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email professionnel <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="j.sawadogo@ecole.bf"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone (SMS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+226 70 12 34 56"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre / Matière enseignée
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Professeur Titulaire CM1 ou Professeur de Français"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
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
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Teacher to Class */}
      {selectedTeacherForAssign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Affectation de classe
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Attribuer une classe à <strong>{selectedTeacherForAssign.name}</strong>
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classe à confier
                </label>
                <select
                  value={targetClassId}
                  onChange={(e) => setTargetClassId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} (Titulaire actuel : {cls.teacherName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeacherForAssign(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Confirmer l'affectation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
