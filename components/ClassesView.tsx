'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  Layers,
  Plus,
  Users,
  Search,
  BookOpen,
  CheckCircle,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

export function ClassesView() {
  const {
    currentSchool,
    classes,
    addClass,
    updateClass,
    users,
    activeAcademicYear,
    students,
  } = useSchool();

  const [selectedCycle, setSelectedCycle] = useState<'all' | 'primaire' | 'secondaire'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new class
  const [gradeLevel, setGradeLevel] = useState('CM2');
  const [division, setDivision] = useState('A');
  const [customName, setCustomName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [room, setRoom] = useState('');

  const teachers = users.filter((u) => u.role === 'teacher');

  const filteredClasses = classes.filter((c) => {
    if (selectedCycle === 'primaire') {
      return ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'].includes(c.gradeLevel);
    }
    if (selectedCycle === 'secondaire') {
      return ['6e', '5e', '4e', '3e', '2nde', '1ère', 'Tle'].includes(c.gradeLevel);
    }
    return true;
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const className = customName.trim() || `${gradeLevel} ${division}`;

    addClass({
      gradeLevel,
      division,
      name: className,
      teacherId: teacherId || undefined,
      room: room || 'Salle standard',
    });

    setShowAddModal(false);
    setCustomName('');
    setTeacherId('');
    setRoom('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Gestion des Classes & Divisions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisation pédagogique du Primaire (CP1 au CM2) et Secondaire (6e à Terminale) · Année {activeAcademicYear.name}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ouvrir une nouvelle division</span>
        </button>
      </div>

      {/* Cycle Filter tabs */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedCycle('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              selectedCycle === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Toutes les classes ({classes.length})
          </button>
          <button
            onClick={() => setSelectedCycle('primaire')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              selectedCycle === 'primaire' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Primaire (CP1 - CM2)
          </button>
          <button
            onClick={() => setSelectedCycle('secondaire')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              selectedCycle === 'secondaire' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Secondaire (6e - Tle)
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Total inscrits : <strong className="text-slate-900 font-mono">{students.length} élèves</strong>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const classStudentsCount = students.filter((s) => s.classId === cls.id).length;
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    Niveau : {cls.gradeLevel} · Div. {cls.division}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {cls.name}
                  </h3>
                </div>

                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Enseignant titulaire :</span>
                  <span className="font-semibold text-slate-800">{cls.teacherName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Effectif de la classe :</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {classStudentsCount} élèves
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Local / Salle :</span>
                  <span className="text-slate-700">{cls.room || 'Salle A'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Année : {activeAcademicYear.name}</span>
                <span className="text-emerald-700 font-semibold font-mono">Ouverte</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Class */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Créer une classe ou division
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ajout au programme officiel de l'établissement
            </p>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Niveau scolaire
                  </label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <optgroup label="Primaire">
                      <option value="CP1">CP1</option>
                      <option value="CP2">CP2</option>
                      <option value="CE1">CE1</option>
                      <option value="CE2">CE2</option>
                      <option value="CM1">CM1</option>
                      <option value="CM2">CM2</option>
                    </optgroup>
                    <optgroup label="Secondaire">
                      <option value="6e">6ème</option>
                      <option value="5e">5ème</option>
                      <option value="4e">4ème</option>
                      <option value="3e">3ème</option>
                      <option value="2nde">Seconde</option>
                      <option value="1ère">Première</option>
                      <option value="Tle">Terminale</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Division (A, B, C...)
                  </label>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    placeholder="Ex: A, B, Bleue..."
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom d'affichage (Optionnel)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={`Ex: ${gradeLevel} ${division} (Examen)`}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enseignant titulaire / Responsable
                </label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">Sélectionner un enseignant...</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Local / Bâtiment
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Ex: Bâtiment B - Salle 05"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg"
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
                  Créer la classe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
