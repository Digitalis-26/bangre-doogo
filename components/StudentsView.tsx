'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Plus,
  ArrowRightLeft,
  Search,
  Key,
  Phone,
  CheckCircle2,
  Calendar,
  Filter,
  ShieldAlert,
} from 'lucide-react';

export function StudentsView() {
  const {
    students,
    classes,
    enrollStudent,
    transferStudentClass,
    activeAcademicYear,
    currentRole,
    currentUser,
  } = useSchool();

  const isTeacher = currentRole === 'teacher';
  const isStaff = currentRole === 'director' || currentRole === 'secretary' || currentRole === 'super_admin';

  // Teacher assigned class
  const teacherClass = classes.find((c) => c.teacherId === currentUser.id) || classes[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState(
    isTeacher ? teacherClass?.id || 'all' : 'all'
  );
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [transferTargetStudent, setTransferTargetStudent] = useState<any | null>(null);
  const [newClassId, setNewClassId] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Enroll form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [birthDate, setBirthDate] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianName, setGuardianName] = useState('');

  // Parent guard
  if (currentRole === 'parent') {
    return (
      <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Accès Restreint</h2>
        <p className="text-xs text-slate-600">
          L'annuaire général des élèves est strictement réservé au personnel enseignant et administratif.
          Pour consulter le dossier de vos enfants, rendez-vous dans l'<strong>Espace Famille</strong>.
        </p>
      </div>
    );
  }

  const filteredStudents = students.filter((st) => {
    if (isTeacher && st.classId !== teacherClass?.id) return false;
    if (!isTeacher && selectedClassFilter !== 'all' && st.classId !== selectedClassFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        st.firstName.toLowerCase().includes(q) ||
        st.lastName.toLowerCase().includes(q) ||
        st.matricule.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !guardianPhone) return;

    const created = enrollStudent({
      firstName,
      lastName,
      gender,
      birthDate,
      classId,
      guardianPhone,
      guardianName,
    });

    setFeedback(`Inscription confirmée pour ${created.firstName} ${created.lastName} (Matricule : ${created.matricule}, Code de liaison : ${created.verificationCode}).`);
    setShowEnrollModal(false);
    setFirstName('');
    setLastName('');
    setGuardianPhone('');
    setGuardianName('');
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetStudent || !newClassId) return;

    const targetCls = classes.find((c) => c.id === newClassId);
    transferStudentClass(transferTargetStudent.id, newClassId);
    setFeedback(`Mutation validée : ${transferTargetStudent.firstName} ${transferTargetStudent.lastName} est désormais affecté(e) en ${targetCls?.name}.`);
    setTransferTargetStudent(null);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {isTeacher ? 'Espace Enseignant' : 'Gestion Administrative'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {isTeacher
              ? `Élèves de ma classe (${teacherClass?.name || 'Classe'})`
              : 'Registre des Élèves & Inscriptions'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher
              ? `Consultation des ${filteredStudents.length} élèves inscrits dans votre classe et coordonnées des tuteurs légaux.`
              : `Gestion des matricules officiels, codes secrets bulletins et mutations de classe · Année ${activeAcademicYear.name}`}
          </p>
        </div>

        {isStaff && (
          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Inscrire un nouvel élève</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isStaff ? (
            <>
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
              >
                <option value="all">Toutes les classes ({students.length} élèves)</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Classe : {teacherClass?.name} ({filteredStudents.length} élèves)
            </div>
          )}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom ou matricule..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Élève & Genre</th>
                <th className="py-3 px-4">Classe</th>
                <th className="py-3 px-4">Matricule Officiel</th>
                <th className="py-3 px-4">Code Bulletin</th>
                <th className="py-3 px-4">Tuteur & Téléphone</th>
                {isStaff && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isStaff ? 6 : 5} className="py-8 text-center text-slate-500">
                    Aucun élève trouvé.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {st.firstName} {st.lastName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${st.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                          {st.gender === 'F' ? 'Fille' : 'Garçon'}
                        </span>
                        {st.birthDate && <span>Né(e) le {st.birthDate}</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {st.className}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {st.matricule}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                        {st.verificationCode}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{st.guardianName || 'Tuteur légal'}</div>
                      <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{st.guardianPhone}</span>
                      </div>
                    </td>

                    {isStaff && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setTransferTargetStudent(st);
                            setNewClassId(st.classId);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-slate-200"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                          <span>Changer de classe</span>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Enroll New Student (Staff only) */}
      {showEnrollModal && isStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-8">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Inscription d'un nouvel élève
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Génère le matricule officiel et le code secret d'accès pour les parents
            </p>

            <form onSubmit={handleEnrollSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Aminata"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom de famille <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Sawadogo"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="M">Masculin (Garçon)</option>
                    <option value="F">Féminin (Fille)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classe d'affectation <span className="text-red-500">*</span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  required
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.gradeLevel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom du responsable
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Ex: Ousmane Sawadogo"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone SMS (urgent) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="+226 70 XX XX XX"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Confirmer l'inscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer Class (Staff only) */}
      {transferTargetStudent && isStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Changement de classe
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Déplacer {transferTargetStudent.firstName} {transferTargetStudent.lastName}
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nouvelle classe d'affectation
                </label>
                <select
                  value={newClassId}
                  onChange={(e) => setNewClassId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferTargetStudent(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Valider la mutation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
