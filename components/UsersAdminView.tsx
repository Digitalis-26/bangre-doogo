'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  ShieldCheck,
  Plus,
  Search,
  KeyRound,
  UserX,
  UserCheck,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserRole, User } from '@/lib/types';

export function UsersAdminView() {
  const {
    users,
    createUser,
    updateUser,
    toggleUserStatus,
    currentSchool,
    resetPassword,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [title, setTitle] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    return true;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    createUser({
      name,
      email,
      phone,
      role,
      schoolId: currentSchool.id,
      title: title || (role === 'teacher' ? 'Enseignant' : role === 'parent' ? 'Parent' : 'Administration'),
      status: 'active',
    });

    setFeedback(`Compte créé avec succès pour ${name} (${role}).`);
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setTitle('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleResetPassword = (u: User) => {
    resetPassword(u.email);
    setFeedback(`Un nouveau code temporaire a été transmis à ${u.name} au ${u.phone}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Administration des Utilisateurs & Rôles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Contrôle des accès, attributions des droits et statut des comptes de l'établissement
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Créer un utilisateur</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">Filtrer par rôle :</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs p-2 border border-slate-300 rounded-lg bg-white text-slate-800"
          >
            <option value="all">Tous les rôles ({users.length})</option>
            <option value="director">Directeurs</option>
            <option value="secretary">Secrétaires</option>
            <option value="teacher">Enseignants</option>
            <option value="parent">Parents</option>
            <option value="super_admin">Super Admins</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Utilisateur</th>
                <th className="py-3 px-4">Coordonnées</th>
                <th className="py-3 px-4">Rôle Système</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isSuspended = u.status === 'suspended';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.title || 'Utilisateur'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{u.phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUser(u.id, { role: e.target.value as UserRole })}
                        className="text-xs p-1.5 border border-slate-300 rounded-md bg-white font-medium"
                      >
                        <option value="director">Directeur</option>
                        <option value="secretary">Secrétaire</option>
                        <option value="teacher">Enseignant</option>
                        <option value="parent">Parent</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                          isSuspended
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isSuspended ? 'Suspendu' : 'Actif'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResetPassword(u)}
                          title="Réinitialiser le mot de passe"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          title={isSuspended ? 'Réactiver le compte' : 'Suspendre le compte'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSuspended
                              ? 'text-emerald-700 hover:bg-emerald-50'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {isSuspended ? (
                            <UserCheck className="w-3.5 h-3.5" />
                          ) : (
                            <UserX className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Créer un nouvel utilisateur
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Création d'accès avec mot de passe généré automatiquement
            </p>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom & Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: M. Souleymane Zoungrana"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@ecole.bf"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+226 70 00 00 00"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rôle attribué
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="director">Directeur</option>
                    <option value="secretary">Secrétaire</option>
                    <option value="teacher">Enseignant</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fonction / Titre
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Conseiller pédagogique"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>
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
                  Créer l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
