'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  X,
  LogIn,
  UserPlus,
  KeyRound,
  Shield,
  School as SchoolIcon,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export function AuthModal() {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    resetPassword,
    schools,
    currentSchool,
    saasPlans,
    updateSchoolPlan,
  } = useSchool();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [schoolId, setSchoolId] = useState(currentSchool.id);
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'main' | 'advanced'>('free');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, role);
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setAuthModalOpen(false);
        setFeedback(null);
        setEmail('');
        setPassword('');
      }, 1500);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    const res = signup({ name, email, phone, role, schoolId });
    if (role === 'director' || role === 'secretary') {
      updateSchoolPlan(schoolId, selectedPlanId);
    }
    setFeedback(res);
    if (res.success) {
      setTimeout(() => {
        setAuthModalOpen(false);
        setFeedback(null);
        setName('');
        setEmail('');
        setPhone('');
      }, 1500);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = resetPassword(email);
    setFeedback(res);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative my-8">
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setFeedback(null);
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all border-b-2 -mb-3 cursor-pointer ${
              authModalMode === 'login'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Connexion</span>
          </button>

          <button
            onClick={() => {
              setAuthModalMode('signup');
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all border-b-2 -mb-3 cursor-pointer ${
              authModalMode === 'signup'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Créer un compte</span>
          </button>

          <button
            onClick={() => {
              setAuthModalMode('forgot');
              setFeedback(null);
            }}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition-all border-b-2 -mb-3 cursor-pointer ${
              authModalMode === 'forgot'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Mot de passe</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl text-xs flex items-start gap-2 ${
              feedback.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span className="leading-snug">{feedback.message}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse email professionnelle ou personnelle <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: direction@horizon-ouaga.bf ou parent@gmail.com"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rôle souhaité pour cette session
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="parent">Parent d'élève (Suivi des enfants)</option>
                <option value="teacher">Enseignant (Pointage appel & Devoirs)</option>
                <option value="director">Directeur d'établissement</option>
                <option value="secretary">Secrétariat & Scolarité</option>
                <option value="super_admin">Super Administrateur SaaS</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('forgot')}
                  className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Se connecter à ÉcoleConnect
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {authModalMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: M. Ousmane Sawadogo"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                  placeholder="parent@gmail.com"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Type de profil
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="parent">Parent d'élève</option>
                <option value="teacher">Enseignant / Professeur</option>
                <option value="director">Directeur d'établissement</option>
                <option value="secretary">Secrétariat scolaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Établissement scolaire associé
              </label>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan selection visible during subscription for school administration */}
            {(role === 'director' || role === 'secretary') && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700">
                  Formule d'abonnement de l'école
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {saasPlans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900">{plan.name}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          )}
                        </div>
                        <div className="font-mono font-bold text-xs text-emerald-800">
                          {plan.price === 0 ? '0 FCFA' : `${plan.price.toLocaleString('fr-FR')} F/mois`}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                          {plan.classesLimit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer mt-2"
            >
              Créer mon compte
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authModalMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-3.5">
            <p className="text-xs text-slate-600 leading-relaxed">
              Saisissez l'adresse email ou le numéro de téléphone associé à votre compte scolaire. Nous vous enverrons immédiatement un code de réinitialisation sécurisé.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email ou Numéro Mobile
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: +226 78 90 12 34 ou parent@gmail.com"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Envoyer les instructions de réinitialisation
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Retour à la page de connexion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
