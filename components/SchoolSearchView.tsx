'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { School, SchoolInquiry } from '@/lib/types';
import { formatDateNice, formatTime } from '@/lib/utils';
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Users,
  Award,
  DollarSign,
  Coffee,
  Bus,
  Home,
  Laptop,
  Check,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';

export function SchoolSearchView() {
  const {
    schools,
    currentUser,
    currentRole,
    myChildren,
    schoolInquiries,
    submitSchoolInquiry,
  } = useSchool();

  const isParent = currentRole === 'parent';
  const isStudent = currentRole === 'student';

  const [activeTab, setActiveTab] = useState<'directory' | 'my_inquiries'>('directory');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [maxBudget, setMaxBudget] = useState('all');
  const [requiredService, setRequiredService] = useState('all');

  // Modals state
  const [selectedSchoolForDetails, setSelectedSchoolForDetails] = useState<School | null>(null);
  const [selectedSchoolForInquiry, setSelectedSchoolForInquiry] = useState<School | null>(null);

  // Inquiry Form state
  const [inquiryStudentName, setInquiryStudentName] = useState(
    isParent && myChildren.length > 0 ? myChildren[0].firstName + ' ' + myChildren[0].lastName : isStudent ? currentUser.name : ''
  );
  const [inquiryTargetGrade, setInquiryTargetGrade] = useState('6ème');
  const [inquiryPhone, setInquiryPhone] = useState(currentUser.phone || '+226 70 00 00 00');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; inquiry?: SchoolInquiry } | null>(null);

  // Available unique cities
  const cities = Array.from(new Set(schools.map((s) => s.city)));

  // Filter schools
  const filteredSchools = schools.filter((sch) => {
    // City filter
    if (selectedCity !== 'all' && sch.city !== selectedCity) return false;

    // Cycle filter
    if (selectedCycle !== 'all') {
      if (!sch.cycles || !sch.cycles.includes(selectedCycle as any)) return false;
    }

    // Type filter
    if (selectedType !== 'all') {
      if (sch.type !== selectedType) return false;
    }

    // Service filter
    if (requiredService !== 'all') {
      if (!sch.services || !sch.services.some((serv) => serv.toLowerCase().includes(requiredService.toLowerCase()))) {
        return false;
      }
    }

    // Budget filter
    if (maxBudget !== 'all') {
      const budgetLimit = parseInt(maxBudget, 10);
      if (sch.annualTuitionMin && sch.annualTuitionMin > budgetLimit) return false;
    }

    // Text query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sch.name.toLowerCase().includes(q);
      const matchCity = sch.city.toLowerCase().includes(q);
      const matchAddress = sch.address?.toLowerCase().includes(q);
      const matchDesc = sch.description?.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchAddress && !matchDesc) return false;
    }

    return true;
  });

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchoolForInquiry || !inquiryStudentName.trim() || !inquiryTargetGrade.trim()) return;

    const res = submitSchoolInquiry({
      schoolId: selectedSchoolForInquiry.id,
      studentName: inquiryStudentName.trim(),
      targetGrade: inquiryTargetGrade.trim(),
      senderPhone: inquiryPhone.trim(),
      message: inquiryMessage.trim(),
    });

    setFeedback(res);
  };

  const getWhatsAppLink = (school: School, studentName?: string, grade?: string) => {
    const rawNumber = (school.whatsapp || school.phone).replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Bonjour Direction de ${school.name}, je vous contacte via ÉcoleConnect au sujet d'une demande de pré-inscription/renseignement pour l'élève ${studentName || '[Nom de l\'élève]'} en classe de ${grade || '[Classe souhaitée]'}. Pouvez-vous nous communiquer les formalités et dates de rentrée ? Merci.`
    );
    return `https://wa.me/${rawNumber}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Orientation & Inscriptions 2026-2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Trouver un Nouvel Établissement Scolaire
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Explorez les écoles partenaires certifiées ÉcoleConnect : cycles proposés, grille tarifaire transparente, services (cantine, transport, internat) et demande directe de pré-inscription.
          </p>
        </div>

        {/* Tab switch between directory and my inquiries */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit shrink-0">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'directory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Explorer ({schools.length} écoles)
          </button>
          <button
            onClick={() => setActiveTab('my_inquiries')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'my_inquiries' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Mes demandes envoyées</span>
            {schoolInquiries.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                {schoolInquiries.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Demande enregistrée avec succès !</span>
              <span className="text-slate-600">{feedback.message}</span>
            </div>
          </div>
          {feedback.inquiry && selectedSchoolForInquiry && (
            <a
              href={getWhatsAppLink(selectedSchoolForInquiry, feedback.inquiry.studentName, feedback.inquiry.targetGrade)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ouvrir sur WhatsApp</span>
            </a>
          )}
        </div>
      )}

      {/* VIEW 1: DIRECTORY & SEARCH */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Filter Control Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom d'école, ville, quartier (ex: Horizon, Ouaga 2000, Koudougou, Bilingue...)"
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
              {/* City filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Ville / Région
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50/70 text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">Toutes les villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cycle filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Niveau / Cycle
                </label>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50/70 text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">Tous les cycles</option>
                  <option value="Maternelle">Maternelle / Préscolaire</option>
                  <option value="Primaire">Primaire (CP1 - CM2)</option>
                  <option value="Collège">Collège (6ème - 3ème)</option>
                  <option value="Lycée">Lycée (2nde - Tle)</option>
                </select>
              </div>

              {/* Type filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Type d'établissement
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50/70 text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">Tous les types</option>
                  <option value="Privé laïc">Privé laïc</option>
                  <option value="Privé confessionnel">Privé confessionnel</option>
                  <option value="Bilingue Français-Anglais">Bilingue Français-Anglais</option>
                  <option value="Public d'excellence">Public d'excellence</option>
                </select>
              </div>

              {/* Budget filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Budget annuel max
                </label>
                <select
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50/70 text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">Tous les tarifs</option>
                  <option value="75000">Moins de 75 000 F</option>
                  <option value="120000">Moins de 120 000 F</option>
                  <option value="200000">Moins de 200 000 F</option>
                  <option value="350000">Moins de 350 000 F</option>
                </select>
              </div>

              {/* Services filter */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Service requis
                </label>
                <select
                  value={requiredService}
                  onChange={(e) => setRequiredService(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50/70 text-slate-800 focus:outline-none focus:border-emerald-600"
                >
                  <option value="all">Tous les services</option>
                  <option value="Cantine">Cantine scolaire</option>
                  <option value="Transport">Transport / Bus</option>
                  <option value="Internat">Internat</option>
                  <option value="Informatique">Salle informatique</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Reset */}
            {(selectedCity !== 'all' || selectedCycle !== 'all' || selectedType !== 'all' || maxBudget !== 'all' || requiredService !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span>{filteredSchools.length} établissement(s) correspondant à vos critères</span>
                <button
                  onClick={() => {
                    setSelectedCity('all');
                    setSelectedCycle('all');
                    setSelectedType('all');
                    setMaxBudget('all');
                    setRequiredService('all');
                    setSearchQuery('');
                  }}
                  className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          {/* School Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchools.map((school) => {
              const gradient = school.bannerGradient || 'from-emerald-700 to-slate-900';

              return (
                <div
                  key={school.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Graphic Header */}
                  <div>
                    <div className={`p-4 bg-gradient-to-r ${gradient} text-white relative`}>
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-mono font-semibold">
                          {school.code}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Partenaire certifié</span>
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-white leading-tight min-h-[44px]">
                        {school.name}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-slate-200 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                        <span className="truncate">{school.city}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 space-y-3">
                      {/* Cycles Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {school.cycles?.map((cycle) => (
                          <span
                            key={cycle}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            {cycle}
                          </span>
                        ))}
                        {school.type && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {school.type}
                          </span>
                        )}
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {school.description || 'Établissement conventionné partenaire de la plateforme ÉcoleConnect.'}
                      </p>

                      {/* Key Indicators: Fees & Exam Success */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px]">Scolarité annuelle :</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {school.annualTuitionMin
                              ? `${school.annualTuitionMin.toLocaleString()} - ${school.annualTuitionMax?.toLocaleString()} F`
                              : 'Sur demande'}
                          </span>
                        </div>
                        {school.successRate && (
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Taux de réussite :</span>
                            <span className="font-semibold text-emerald-700">{school.successRate}</span>
                          </div>
                        )}
                      </div>

                      {/* Services preview */}
                      {school.services && school.services.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Services & Équipements
                          </div>
                          <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                            {school.services.map((serv) => (
                              <span key={serv} className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{serv}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA Actions */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSchoolForDetails(school)}
                        className="flex-1 py-2 px-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
                      >
                        Fiche détaillée
                      </button>

                      <button
                        onClick={() => {
                          setSelectedSchoolForInquiry(school);
                          setFeedback(null);
                        }}
                        className="flex-1 py-2 px-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                      >
                        <span>Pré-inscription</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* WhatsApp Quick Direct Link */}
                    <a
                      href={getWhatsAppLink(school)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 text-[11px] text-slate-600 hover:text-emerald-800 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Échanger avec le secrétariat sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSchools.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 max-w-md mx-auto my-8">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Aucun établissement ne correspond</h3>
              <p className="text-xs text-slate-500">
                Essayez d'élargir vos filtres (sélectionnez "Toutes les villes" ou assouplissez le budget).
              </p>
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setSelectedCycle('all');
                  setSelectedType('all');
                  setMaxBudget('all');
                  setRequiredService('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY INQUIRIES & APPLICATIONS */}
      {activeTab === 'my_inquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Vos demandes de pré-inscription & contacts envoyés
              </h2>
              <p className="text-xs text-slate-500">
                Suivez les retours des directions d'écoles pour la rentrée 2026-2027
              </p>
            </div>
            <button
              onClick={() => setActiveTab('directory')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold cursor-pointer"
            >
              + Découvrir d'autres écoles
            </button>
          </div>

          {schoolInquiries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">Vous n'avez envoyé aucune demande d'inscription pour l'instant.</p>
              <p>Recherchez un établissement dans l'onglet "Explorer" et cliquez sur "Pré-inscription".</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {schoolInquiries.map((inq) => {
                const school = schools.find((s) => s.id === inq.schoolId);

                return (
                  <div key={inq.id} className="py-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">{inq.schoolName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Élève concerné : <strong>{inq.studentName}</strong> · Classe souhaitée : <span className="font-semibold text-emerald-700">{inq.targetGrade}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Dossier transmis</span>
                        </span>
                        {school && (
                          <a
                            href={getWhatsAppLink(school, inq.studentName, inq.targetGrade)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Relancer sur WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {inq.message && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 italic">
                        "{inq.message}"
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Envoyé le {formatDateNice(inq.createdAt)} · Téléphone de contact : {inq.senderPhone}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: SCHOOL FULL DETAILS */}
      {selectedSchoolForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-8 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {selectedSchoolForDetails.type || 'Établissement scolaire'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedSchoolForDetails.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedSchoolForDetails.address || selectedSchoolForDetails.city}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedSchoolForDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[11px]">Projet pédagogique & Cadre d'étude</h4>
              <p>{selectedSchoolForDetails.description}</p>
            </div>

            {/* Highlights */}
            {selectedSchoolForDetails.highlights && (
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase text-[11px]">Points forts de l'établissement</h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedSchoolForDetails.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tuition details */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Tarifs de scolarité indicatifs :</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {selectedSchoolForDetails.annualTuitionMin
                    ? `${selectedSchoolForDetails.annualTuitionMin.toLocaleString()} à ${selectedSchoolForDetails.annualTuitionMax?.toLocaleString()} FCFA / an`
                    : 'Sur devis'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Paiement échelonné en 3 à 4 tranches disponible. Les frais incluent les supports didactiques et l'accès à la plateforme ÉcoleConnect.
              </p>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Téléphone & WhatsApp</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5">{selectedSchoolForDetails.phone}</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Email administratif</div>
                <div className="font-medium text-slate-800 truncate mt-0.5">{selectedSchoolForDetails.email}</div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSchoolForDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = selectedSchoolForDetails;
                  setSelectedSchoolForDetails(null);
                  setSelectedSchoolForInquiry(s);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Déposer une pré-inscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INQUIRY & PRE-ENROLLMENT FORM */}
      {selectedSchoolForInquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative my-8 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Demande directe
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Pré-inscription à {selectedSchoolForInquiry.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Rentrée 2026-2027 · {selectedSchoolForInquiry.city}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchoolForInquiry(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
              {/* Student selection / name */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nom & Prénom de l'élève <span className="text-red-500">*</span>
                </label>
                {isParent && myChildren.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={inquiryStudentName}
                      onChange={(e) => setInquiryStudentName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800"
                    >
                      {myChildren.map((c) => (
                        <option key={c.id} value={`${c.firstName} ${c.lastName}`}>
                          {c.firstName} {c.lastName} ({c.className})
                        </option>
                      ))}
                      <option value="autre">Autre enfant (nouvelle inscription)</option>
                    </select>
                    {inquiryStudentName === 'autre' && (
                      <input
                        type="text"
                        onChange={(e) => setInquiryStudentName(e.target.value)}
                        placeholder="Saisissez le nom et prénom du nouvel enfant"
                        className="w-full p-2.5 border border-slate-300 rounded-xl"
                        required
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={inquiryStudentName}
                    onChange={(e) => setInquiryStudentName(e.target.value)}
                    placeholder="Ex : Kadiatou Sawadogo"
                    className="w-full p-2.5 border border-slate-300 rounded-xl"
                    required
                  />
                )}
              </div>

              {/* Target Grade / Level */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Classe souhaitée pour la rentrée <span className="text-red-500">*</span>
                </label>
                <select
                  value={inquiryTargetGrade}
                  onChange={(e) => setInquiryTargetGrade(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-800"
                  required
                >
                  <optgroup label="Primaire">
                    <option value="CP1">CP1</option>
                    <option value="CP2">CP2</option>
                    <option value="CE1">CE1</option>
                    <option value="CE2">CE2</option>
                    <option value="CM1">CM1</option>
                    <option value="CM2">CM2</option>
                  </optgroup>
                  <optgroup label="Collège">
                    <option value="6ème">6ème</option>
                    <option value="5ème">5ème</option>
                    <option value="4ème">4ème</option>
                    <option value="3ème">3ème</option>
                  </optgroup>
                  <optgroup label="Lycée">
                    <option value="2nde A / C">2nde A / C</option>
                    <option value="1ère A / D">1ère A / D</option>
                    <option value="Terminale D / A / C">Terminale D / A / C</option>
                  </optgroup>
                </select>
              </div>

              {/* Contact phone */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Numéro de téléphone / WhatsApp du tuteur <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="+226 70 XX XX XX"
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-mono"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Message ou demande spécifique (visite, internat, cantine...)
                </label>
                <textarea
                  rows={2}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Ex : Nous emménageons dans le quartier et souhaitons visiter l'école et réserver une place à la cantine."
                  className="w-full p-2.5 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Votre demande est transmise directement au secrétariat de l'école. Vous recevrez un appel ou un message WhatsApp sous 24 à 48 heures ouvrées.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSchoolForInquiry(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la pré-inscription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
