'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { Check, ArrowRight, ShieldCheck, Calculator, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan?: (planId: 'free' | 'main' | 'advanced') => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const { currentSchool, saasPlans, updateSchoolPlan } = useSchool();
  const [studentsCount, setStudentsCount] = useState<number>(300);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ROI / Savings calculation:
  // Typical school expenses per year:
  // 1. Paper notebooks / printed circulars: ~1,500 FCFA per student / year
  // 2. Urgent phone calls by administrative staff: ~50,000 FCFA / year
  const traditionalCost = Math.round(studentsCount * 1200 + 40000);
  const ecoleConnectMainPlanYearly = 10000 * 10; // 10 school months = 100,000 FCFA
  const netSavings = Math.max(0, traditionalCost - ecoleConnectMainPlanYearly);

  const handleChoosePlan = (planId: 'free' | 'main' | 'advanced') => {
    updateSchoolPlan(currentSchool.id, planId);
    if (onSelectPlan) onSelectPlan(planId);
    setSuccessMessage(`Le forfait de ${currentSchool.name} a été mis à jour vers "${planId === 'free' ? 'Découverte (0 FCFA)' : planId === 'main' ? 'Offre Principale (10 000 FCFA/mois)' : 'Offre Avancée (25 000 FCFA/mois)'}".`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tarifs B2B adaptés aux écoles
        </h2>
        <p className="text-sm text-slate-600">
          L'école souscrit au service. L'accès reste 100% gratuit pour les familles.
        </p>
      </div>

      {successMessage && (
        <div className="max-w-xl mx-auto p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="font-bold ml-2">×</button>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {saasPlans.map((plan) => {
          const isCurrent = currentSchool.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'bg-white border-2 border-emerald-600 shadow-xl ring-4 ring-emerald-50'
                  : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              {plan.badgeText && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {plan.badgeText}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      Forfait Actuel
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-4 min-h-[32px] leading-relaxed">
                  {plan.subtitle}
                </p>

                <div className="mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      {plan.price.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 font-mono">
                      {plan.currency}
                    </span>
                    <span className="text-xs text-slate-500">/{plan.billingPeriod}</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-1">
                    {plan.classesLimit}
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 mb-6">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Fonctionnalités incluses
                  </div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleChoosePlan(plan.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-slate-100 text-slate-600 cursor-default'
                    : plan.isPopular
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>{isCurrent ? 'Forfait déjà activé' : `Choisir ${plan.name}`}</span>
                {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Simulator / ROI section */}
      <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Simulateur d'économies
            </h3>
            <p className="text-xs text-slate-400">
              Comparatif direct face aux coûts papier et photocopies
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300">Effectif total d'élèves de l'école :</span>
                <span className="font-bold text-emerald-400 font-mono tabular-nums">
                  {studentsCount} élèves
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                step="25"
                value={studentsCount}
                onChange={(e) => setStudentsCount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 élèves</span>
                <span>300 (école moyenne)</span>
                <span>1200 élèves</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span>Coût traditionnel (cahiers, tirages papier, appels) :</span>
                <span className="font-mono text-slate-200">
                  ~{traditionalCost.toLocaleString('fr-FR')} FCFA / an
                </span>
              </div>
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span>Abonnement ÉcoleConnect (Offre principale 10 mois) :</span>
                <span className="font-mono text-emerald-400">
                  {ecoleConnectMainPlanYearly.toLocaleString('fr-FR')} FCFA / an
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 text-center space-y-2">
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
              Gain financier direct estimé
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tabular-nums">
              +{netSavings.toLocaleString('fr-FR')} FCFA
            </div>
            <div className="text-xs text-slate-300">
              d'économies nettes par année scolaire, en plus d'une transmission en temps réel à 100% des parents.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
