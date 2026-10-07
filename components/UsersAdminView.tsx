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
  Shield,
  ShieldAlert,
  FileText,
  AlertTriangle,
  RefreshCw,
  Download,
  Server,
  Eye,
  Check,
} from 'lucide-react';
import { UserRole, User } from '@/lib/types';

interface SecurityAuditItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  category: 'auth' | 'tuition' | 'records' | 'security';
  status: 'success' | 'warning' | 'blocked';
  ip: string;
}

export function UsersAdminView() {
  const {
    users,
    createUser,
    updateUser,
    toggleUserStatus,
    currentSchool,
    resetPassword,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'audit' | 'privacy'>('users');
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

  // Privacy policies state
  const [maskParentPhone, setMaskParentPhone] = useState(true);
  const [autoPurgeArchive, setAutoPurgeArchive] = useState(true);
  const [strictSessionTimeout, setStrictSessionTimeout] = useState(true);
  const [enforceTwoFactor, setEnforceTwoFactor] = useState(false);

  // Live security audit logs
  const [auditLogs] = useState<SecurityAuditItem[]>([
    {
      id: 'sec-9481',
      timestamp: 'Aujourd\'hui, 10:14',
      user: 'M. Kouamé Adama',
      role: 'Direction',
      action: 'Délivrance et signature numérique quittance #QUITT-2026-9481 (45 000 FCFA)',
      category: 'tuition',
      status: 'success',
      ip: '160.155.22.4 (Abidjan)',
    },
    {
      id: 'sec-9480',
      timestamp: 'Aujourd\'hui, 09:55',
      user: 'M. Ouédraogo Moussa',
      role: 'Parent',
      action: 'Paiement scolarité en ligne via Orange Money (45 000 FCFA - Tranche 2)',
      category: 'tuition',
      status: 'success',
      ip: '197.239.77.108 (Ouagadougou)',
    },
    {
      id: 'sec-9479',
      timestamp: 'Aujourd\'hui, 08:30',
      user: 'Mme Diallo Aïssatou',
      role: 'Enseignant',
      action: 'Validation appel quotidien CM2 A - Synchronisation registre absences',
      category: 'records',
      status: 'success',
      ip: '160.155.18.91 (Abidjan)',
    },
    {
      id: 'sec-9478',
      timestamp: 'Hier, 23:45',
      user: 'Inconnu (IP non autorisée)',
      role: 'Système',
      action: 'Tentative d\'injection SQL bloquée par le pare-feu applicatif (WAF)',
      category: 'security',
      status: 'blocked',
      ip: '45.133.1.20 (Bloqué)',
    },
    {
      id: 'sec-9477',
      timestamp: 'Hier, 16:20',
      user: 'M. Kouamé Adama',
      role: 'Direction',
      action: 'Campagne de relance SMS des impayés (14 parents relancés)',
      category: 'tuition',
      status: 'success',
      ip: '160.155.22.4 (Abidjan)',
    },
  ]);

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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              Administration, Sécurité & Protection des Données
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Protection Renforcée
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Contrôle des accès, audit de sécurité en temps réel et protection des données scolaires
          </p>
        </div>

        {activeSubTab === 'users' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Créer un utilisateur</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-[#154734] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          👥 Comptes & Rôles ({users.length})
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'audit'
              ? 'bg-[#154734] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Journal d&apos;Audit & Sécurité</span>
        </button>

        <button
          onClick={() => setActiveSubTab('privacy')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'privacy'
              ? 'bg-[#154734] text-amber-300 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-500" />
          <span>Protection des Données (Loi 010-2004)</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 1: USERS LIST */}
      {/* ======================================================== */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
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
                className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Rôle & Fonction</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{u.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                          {u.role === 'director'
                            ? 'Direction'
                            : u.role === 'secretary'
                            ? 'Secrétariat'
                            : u.role === 'teacher'
                            ? 'Enseignant'
                            : u.role === 'parent'
                            ? 'Parent'
                            : 'Super Admin'}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{u.title || 'Personnel certifié'}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-600">{u.phone}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status === 'active' ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Réinitialiser le mot de passe"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              u.status === 'active'
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={u.status === 'active' ? 'Suspendre l\'accès' : 'Réactiver l\'accès'}
                          >
                            {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 2: SECURITY AUDIT TRAIL */}
      {/* ======================================================== */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          {/* Key Security Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Chiffrement au repos</span>
                <Lock className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-black text-slate-900">AES-256 bits</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Base de données & quittances sécurisées</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Sessions actives</span>
                <Server className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-black text-slate-900">{users.length} comptes vérifiés</p>
              <p className="text-[10px] text-slate-400">Tokens de session révocables instantanément</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Incidents de sécurité</span>
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xl font-black text-emerald-700">0 anomalie active</p>
              <p className="text-[10px] text-slate-400">Dernière vérification WAF il y a 2 min</p>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Journal des Transactions & Actions Sensibles</span>
              </h3>
              <span className="text-[11px] text-slate-400">Horodatage certifié</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Date & Heure</th>
                    <th className="py-2.5 px-4">Auteur</th>
                    <th className="py-2.5 px-4">Action effectuée</th>
                    <th className="py-2.5 px-4">Adresse IP</th>
                    <th className="py-2.5 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{log.user}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({log.role})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-800">{log.action}</td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.ip}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {log.status === 'success' ? 'Validé ✓' : 'Bloqué ✕'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBTAB 3: DATA PRIVACY POLICIES */}
      {/* ======================================================== */}
      {activeSubTab === 'privacy' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">
              Politique de Protection des Données Personnelles (Loi n°010-2004/AN)
            </h3>
            <p className="text-xs text-slate-500">
              Conformité stricte avec les lois nationales et sous-régionales sur la protection des données des élèves et des familles.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Rule 1 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Masquage des numéros de téléphone parents</p>
                <p className="text-slate-500 text-[11px]">
                  Les coordonnées des parents sont masquées aux tiers et aux élèves pour préserver la vie privée.
                </p>
              </div>
              <button
                onClick={() => setMaskParentPhone(!maskParentPhone)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  maskParentPhone ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    maskParentPhone ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Rule 2 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Purge automatique et droit à l&apos;oubli</p>
                <p className="text-slate-500 text-[11px]">
                  Archivage chiffré des dossiers scolaires après diplomation avec destruction des traces temporaires après 5 ans.
                </p>
              </div>
              <button
                onClick={() => setAutoPurgeArchive(!autoPurgeArchive)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoPurgeArchive ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    autoPurgeArchive ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Rule 3 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">Expiration stricte des sessions d&apos;accès</p>
                <p className="text-slate-500 text-[11px]">
                  Déconnexion automatique après inactivité prolongée pour protéger les postes partagés en salle des professeurs.
                </p>
              </div>
              <button
                onClick={() => setStrictSessionTimeout(!strictSessionTimeout)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  strictSessionTimeout ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    strictSessionTimeout ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Certificat d&apos;intégrité numérique des quittances</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Chaque quittance de paiement émise par MON ÉCOLE porte une signature cryptographique inviolable et un code QR de vérification opposable aux tiers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Créer un nouvel utilisateur</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom et Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: M. Ouédraogo Moussa"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="moussa.o@monecole.bf"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de Téléphone (SMS) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+226 70 00 00 00"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rôle</label>
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
                  Créer l&apos;utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
