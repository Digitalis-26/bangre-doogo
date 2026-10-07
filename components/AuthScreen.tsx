'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { AnimatedGreenGoldBackground } from './AnimatedGreenGoldBackground';
import {
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Lock,
  UserCheck,
  GraduationCap,
  Sparkles,
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
    createSchool,
  } = useSchool();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [schoolName, setSchoolName] = useState(currentSchool.name);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setFeedback({ success: false, message: 'Veuillez saisir votre email ou téléphone ainsi que votre mot de passe.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const res = login(email, password);
    setFeedback(res);
    setIsSubmitting(false);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !schoolName.trim()) {
      setFeedback({ success: false, message: 'Veuillez renseigner tous les champs obligatoires (dont l\'établissement).' });
      return;
    }

    if (password.length < 6) {
      setFeedback({ success: false, message: 'Le mot de passe doit comporter au moins 6 caractères.' });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ success: false, message: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }

    if (!agreeTerms) {
      setFeedback({ success: false, message: 'Veuillez accepter les conditions d\'utilisation et la politique de confidentialité.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Resolve or create school by name
    const trimmedSchool = schoolName.trim();
    const existingSchool = schools.find(
      (s) => s.name.toLowerCase() === trimmedSchool.toLowerCase()
    );

    let targetSchoolId = existingSchool ? existingSchool.id : '';

    if (!existingSchool) {
      const created = createSchool({
        name: trimmedSchool,
        city: 'Ouagadougou',
        country: 'Burkina Faso',
        phone: phone.trim() || '+226 25 00 00 00',
        email: email.trim().toLowerCase(),
        plan: 'main',
        monthlyFee: 10000,
        code: trimmedSchool.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, '') || 'ECOL',
        status: 'active',
        cycles: ['Maternelle', 'Primaire', 'Collège'],
        type: 'Privé laïc',
      });
      targetSchoolId = created.id;
    }

    const res = signup({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      role,
      schoolId: targetSchoolId,
      schoolName: trimmedSchool,
    });

    setFeedback(res);
    setIsSubmitting(false);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setFeedback({ success: false, message: 'Veuillez saisir votre adresse email ou téléphone.' });
      return;
    }

    setIsSubmitting(true);
    const res = resetPassword(email.trim());
    setFeedback(res);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between text-slate-900 overflow-hidden">
      {/* Animated Vert-Or Background */}
      <AnimatedGreenGoldBackground />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-md my-auto">
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-2.5 mb-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-lg shadow-black/20">
              <div className="w-9 h-9 rounded-xl border border-amber-400/50 bg-gradient-to-br from-[#154734] to-[#0a281c] flex items-center justify-center text-amber-300 font-black text-sm shadow-inner">
                ME
              </div>
              <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1 drop-shadow-sm">
                <span>MON ÉCOLE</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {authModalMode === 'signup'
                ? 'Créer un compte'
                : authModalMode === 'forgot'
                ? 'Mot de passe oublié'
                : 'Connexion'}
            </h1>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium drop-shadow-xs">
              {authModalMode === 'signup'
                ? 'Remplissez vos informations pour rejoindre votre établissement.'
                : authModalMode === 'forgot'
                ? 'Saisissez vos identifiants pour réinitialiser votre accès.'
                : 'Accédez à votre espace sécurisé en renseignant vos identifiants.'}
            </p>
          </div>

          {/* Form Card with Premium Glass & Shadows */}
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl shadow-emerald-950/40 p-6 sm:p-8 space-y-5 relative overflow-hidden">
            {/* Top Accent Strip Vert-Or */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#154734] via-amber-400 to-[#154734]" />

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setFeedback(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalMode === 'login'
                    ? 'bg-white text-[#154734] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  setFeedback(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authModalMode === 'signup'
                    ? 'bg-white text-[#154734] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Créer un compte
              </button>
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  feedback.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <span className="leading-snug">{feedback.message}</span>
              </div>
            )}

            {/* ======================================================= */}
            {/* 1. LOGIN FORM */}
            {/* ======================================================= */}
            {authModalMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse Email ou Numéro de Téléphone
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: hamed.k@gmail.com ou 70 12 34 56"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalMode('forgot');
                        setFeedback(null);
                      }}
                      className="text-[11px] text-[#154734] hover:underline font-semibold cursor-pointer"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs sm:text-sm pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#154734] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#154734] via-[#1b5e20] to-[#154734] hover:from-[#0f3828] hover:to-[#1b5e20] active:scale-[0.99] text-amber-300 hover:text-amber-200 border border-emerald-600/50 text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>Vous n&apos;avez pas encore de compte ? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signup');
                      setFeedback(null);
                    }}
                    className="font-bold text-[#154734] hover:underline cursor-pointer"
                  >
                    Créer un compte
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================= */}
            {/* 2. SIGNUP FORM */}
            {/* ======================================================= */}
            {authModalMode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom et Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Hamed Koura"
                    className="w-full text-xs sm:text-sm px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hamed.k@gmail.com"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Numéro Téléphone (SMS) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+226 70 00 00 00"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 caractères"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Votre rôle sur la plateforme <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden"
                    >
                      <option value="parent">👨‍👩‍👧 Parent d&apos;élève</option>
                      <option value="director">🏫 Direction d&apos;établissement</option>
                      <option value="teacher">📚 Enseignant</option>
                      <option value="secretary">🏢 Secrétariat & Scolarité</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Établissement <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      list="schools-datalist"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Nom de votre école / établissement"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                      required
                    />
                    <datalist id="schools-datalist">
                      {schools.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.city}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Privacy Agreement Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-slate-600 select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#154734] focus:ring-[#154734] accent-[#154734]"
                    />
                    <span>
                      J&apos;accepte les conditions d&apos;utilisation et la protection des données scolaires conforme à la Loi n°010-2004/AN.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#154734] via-[#1b5e20] to-[#154734] hover:from-[#0f3828] hover:to-[#1b5e20] active:scale-[0.99] text-amber-300 hover:text-amber-200 border border-emerald-600/50 text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Création du compte...' : 'Créer mon compte'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>Vous avez déjà un compte ? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setFeedback(null);
                    }}
                    className="font-bold text-[#154734] hover:underline cursor-pointer"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================= */}
            {/* 3. FORGOT PASSWORD FORM */}
            {/* ======================================================= */}
            {authModalMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saisissez l&apos;adresse email ou le numéro de téléphone associé à votre compte. Un lien de réinitialisation sécurisé vous sera envoyé.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse Email ou Téléphone
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hamed.k@gmail.com"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600/20 focus:border-[#154734] outline-hidden text-slate-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#154734] via-[#1b5e20] to-[#154734] hover:from-[#0f3828] hover:to-[#1b5e20] text-amber-300 hover:text-amber-200 border border-emerald-600/50 text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setFeedback(null);
                    }}
                    className="font-bold text-[#154734] hover:underline cursor-pointer"
                  >
                    ← Revenir à la page de connexion
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-emerald-200/80 border-t border-emerald-900/40 bg-black/25 backdrop-blur-md relative z-10">
        MON ÉCOLE &bull; Système unifié d&apos;administration scolaire et suivi des familles
      </footer>
    </div>
  );
}
