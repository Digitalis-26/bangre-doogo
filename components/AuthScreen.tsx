'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Moon,
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export function AuthScreen() {
  const {
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
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'main' | 'advanced'>('main');
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCaptchaChecked) {
      setFeedback({ success: false, message: 'Veuillez cocher la case "Je suis un humain".' });
      return;
    }
    const res = login(email, role);
    setFeedback(res);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setFeedback({ success: false, message: 'Veuillez remplir tous les champs obligatoires.' });
      return;
    }
    if (!isCaptchaChecked) {
      setFeedback({ success: false, message: 'Veuillez cocher la case "Je suis un humain".' });
      return;
    }
    const res = signup({ name, email, phone, role, schoolId });
    if (role === 'director' || role === 'secretary') {
      updateSchoolPlan(schoolId, selectedPlanId);
    }
    setFeedback(res);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = resetPassword(email);
    setFeedback(res);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between text-slate-900 select-none">
      {/* Top Brand Header matching exactly the model screenshot */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full border-2 border-[#E08D79] flex items-center justify-center text-[#E08D79] font-bold text-sm">
            EC
          </div>
          <span className="text-lg font-bold text-[#E08D79] tracking-tight">
            ÉcoleConnect
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
            title="Thème"
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setFeedback(null);
            }}
            className="px-4 py-2 bg-[#E08D79] hover:bg-[#D57B65] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Se connecter
          </button>
        </div>
      </header>

      {/* Main Single Centered Form Card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[480px] my-auto">
          {/* Top Title matching screenshot */}
          <div className="text-center mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>
                {authModalMode === 'signup'
                  ? 'Créer un compte'
                  : authModalMode === 'forgot'
                  ? 'Mot de passe'
                  : 'Bon retour'}
              </span>
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {authModalMode === 'signup'
                ? 'Inscris-toi pour accéder à ta plateforme scolaire.'
                : authModalMode === 'forgot'
                ? 'Saisis tes identifiants pour réinitialiser ton accès.'
                : 'Connecte-toi pour accéder à ta plateforme.'}
            </p>
          </div>

          {/* Clean White Card with Rounded-3xl and Border */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 space-y-4">
            {/* Informational Callout 1 (Notice) */}
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 flex items-start gap-2.5 text-slate-700 text-xs leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Suivi scolaire en direct : notes, devoirs, circulaires et alertes d'absences en temps réel.
              </span>
            </div>

            {/* Informational Callout 2 (Advantage) */}
            <div className="p-3.5 rounded-xl border border-orange-200/80 bg-orange-50/40 flex items-start gap-2.5 text-slate-700 text-xs leading-relaxed">
              <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <span>
                Plateforme unifiée école & familles avec liaison sécurisée et SMS d'urgence automatiques.
              </span>
            </div>

            {/* Feedback alert */}
            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
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

            {/* Switch Header: CONNEXION / INSCRIPTION */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black tracking-wider uppercase text-slate-900 font-mono">
                {authModalMode === 'signup'
                  ? 'INSCRIPTION'
                  : authModalMode === 'forgot'
                  ? 'RÉCUPÉRATION'
                  : 'CONNEXION'}
              </span>
              {authModalMode === 'login' ? (
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('signup');
                    setFeedback(null);
                  }}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  Pas de compte ? S'inscrire
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setFeedback(null);
                  }}
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  Déjà un compte ? Se connecter
                </button>
              )}
            </div>

            {/* LOGIN FORM */}
            {authModalMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full text-xs sm:text-sm px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 placeholder-slate-400 transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe (min. 12 caractères, majuscule + n...)"
                    className="w-full text-xs sm:text-sm pl-4 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 placeholder-slate-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Profile selector */}
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50/60 text-slate-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  >
                    <option value="parent">Profil : Parent d'élève</option>
                    <option value="teacher">Profil : Enseignant</option>
                    <option value="director">Profil : Direction d'école</option>
                    <option value="secretary">Profil : Secrétariat</option>
                    <option value="super_admin">Profil : Super Administrateur</option>
                  </select>
                </div>

                {/* Captcha Box styled as hCaptcha */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCaptchaChecked}
                      onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                      className="w-6 h-6 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer accent-orange-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">
                      Je suis un humain
                    </span>
                  </label>
                  <div className="flex flex-col items-center text-[9px] text-slate-400 font-mono">
                    <div className="w-5 h-5 rounded-md bg-teal-500 text-white flex items-center justify-center font-bold text-[10px]">
                      h
                    </div>
                    <span className="font-bold text-slate-600">hCaptcha</span>
                    <span className="text-[8px] text-slate-400">Confidentialité - Conditions</span>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#E08D79] hover:bg-[#D57B65] active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Quick login demo links */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center mb-1.5 flex items-center justify-center gap-1">
                    <span>Accès rapide démo par profil</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        login('parent@ecoleconnect.bf', 'parent');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg cursor-pointer transition-colors"
                      title="Tester l'interface strictement réservée aux parents"
                    >
                      👨‍👩‍👧 Espace Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        login('enseignant@ecoleconnect.bf', 'teacher');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold rounded-lg cursor-pointer transition-colors"
                      title="Tester l'interface enseignant"
                    >
                      📚 Enseignant
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        login('direction@ecoleconnect.bf', 'director');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold rounded-lg cursor-pointer transition-colors"
                      title="Tester l'interface direction"
                    >
                      🏫 Direction
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Cloisonnement strict : Un compte parent n'accède qu'à l'Espace Famille et au suivi de ses enfants.
                  </p>
                </div>

                <div className="text-center pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('forgot');
                      setFeedback(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </form>
            )}

            {/* SIGNUP FORM */}
            {authModalMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom complet"
                    className="w-full text-xs sm:text-sm px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 placeholder-slate-400 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 placeholder-slate-400 transition-all"
                    required
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Téléphone"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800 placeholder-slate-400 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/60 text-slate-700"
                  >
                    <option value="parent">Parent d'élève</option>
                    <option value="teacher">Enseignant</option>
                    <option value="director">Directeur d'école</option>
                    <option value="secretary">Secrétariat</option>
                  </select>

                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50/60 text-slate-700"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Captcha Box */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCaptchaChecked}
                      onChange={(e) => setIsCaptchaChecked(e.target.checked)}
                      className="w-6 h-6 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer accent-orange-600"
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-700">
                      Je suis un humain
                    </span>
                  </label>
                  <div className="flex flex-col items-center text-[9px] text-slate-400 font-mono">
                    <div className="w-5 h-5 rounded-md bg-teal-500 text-white flex items-center justify-center font-bold text-[10px]">
                      h
                    </div>
                    <span className="font-bold text-slate-600">hCaptcha</span>
                    <span className="text-[8px] text-slate-400">Confidentialité - Conditions</span>
                  </div>
                </div>

                {/* Primary Signup Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#E08D79] hover:bg-[#D57B65] active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>S'inscrire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authModalMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-xs text-slate-600">
                  Saisissez votre email ou téléphone pour recevoir un code temporaire de reconnexion.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email ou téléphone"
                  className="w-full text-xs sm:text-sm px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-slate-800"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#E08D79] hover:bg-[#D57B65] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Envoyer le lien</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* BOTTOM SECTION: FORMULES DE SOUSCRIPTION (SEULEMENT LORS DE LA SOUSCRIPTION / COMPTE ÉCOLE) */}
            {authModalMode === 'signup' && (role === 'director' || role === 'secretary') && (
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                <div className="text-center">
                  <span className="text-[11px] font-black tracking-wider uppercase text-slate-800 font-mono">
                    CHOIX DU FORFAIT ÉTABLISSEMENT
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Choisissez une formule pour l'école. L'accès reste 100% gratuit pour les familles.
                  </p>
                </div>

                {/* Plan cards inspired directly by bottom cards in the model screenshot */}
                <div className="space-y-2">
                  {/* Plan 1: Mensuel sans engagement */}
                  <div
                    onClick={() => setSelectedPlanId('main')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedPlanId === 'main'
                        ? 'border-[#D57B65] bg-orange-50/20 ring-2 ring-orange-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          10 000 FCFA
                        </span>
                        <span className="text-xs text-slate-500">/mois</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Sans engagement · Jusqu'à 15 classes
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlanId === 'main'
                          ? 'border-[#D57B65] bg-[#E08D79]'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPlanId === 'main' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Plan 2: Offre annuelle avantageuse avec badge */}
                  <div
                    onClick={() => setSelectedPlanId('advanced')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between relative ${
                      selectedPlanId === 'advanced'
                        ? 'border-[#D57B65] bg-orange-50/30 ring-2 ring-orange-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="absolute -top-2.5 right-4 bg-[#D57B65] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      OFFRE RECOMMANDÉE
                    </span>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          25 000 FCFA
                        </span>
                        <span className="text-xs text-slate-500">/mois</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Classes illimitées · Multi-établissements & SMS prioritaires
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlanId === 'advanced'
                          ? 'border-[#D57B65] bg-[#E08D79]'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPlanId === 'advanced' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Plan 3: Découverte 0 FCFA */}
                  <div
                    onClick={() => setSelectedPlanId('free')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      selectedPlanId === 'free'
                        ? 'border-[#D57B65] bg-orange-50/20 ring-2 ring-orange-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-slate-900 font-mono">0 FCFA</span>
                        <span className="text-xs text-slate-500">/découverte</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        1 classe test · Idéal pour tester sans engagement
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlanId === 'free'
                          ? 'border-[#D57B65] bg-[#E08D79]'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedPlanId === 'free' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Clean Bottom Note */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-100">
        ÉcoleConnect · Système de gestion & communication scolaire
      </footer>
    </div>
  );
}
