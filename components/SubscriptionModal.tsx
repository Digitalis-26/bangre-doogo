'use client';

import React, { useState } from 'react';
import { useSchool } from '@/context/SchoolContext';
import { X, Check, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSchoolName?: string;
}

export function SubscriptionModal({ isOpen, onClose, targetSchoolName }: SubscriptionModalProps) {
  const { currentSchool, saasPlans, updateSchoolPlan } = useSchool();
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'main' | 'advanced'>(
    (currentSchool.plan as 'free' | 'main' | 'advanced') || 'free'
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const schoolName = targetSchoolName || currentSchool.name;

  const handleConfirmSubscription = () => {
    updateSchoolPlan(currentSchool.id, selectedPlanId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Souscription confirmée !
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Le forfait de l'établissement <strong>{schoolName}</strong> a été mis à jour avec succès.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Souscription École</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Choisir le forfait pour {schoolName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sélectionnez le forfait adapté à la taille de l'établissement.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {saasPlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = currentSchool.plan === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/20 shadow-md ring-2 ring-emerald-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {plan.badgeText && (
                      <span className="absolute -top-2.5 left-4 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                        {plan.badgeText}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            Actuel
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-3 min-h-[30px]">
                        {plan.subtitle}
                      </p>

                      <div className="mb-3 pb-3 border-b border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-slate-900 font-mono">
                            {plan.price.toLocaleString('fr-FR')}
                          </span>
                          <span className="text-xs font-semibold text-slate-700 font-mono">
                            {plan.currency}
                          </span>
                          <span className="text-[11px] text-slate-400">/{plan.billingPeriod}</span>
                        </div>
                        <div className="text-[11px] font-medium text-emerald-700 mt-0.5">
                          {plan.classesLimit}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug text-[11px]">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100">
                      <div
                        className={`w-full py-1.5 rounded-lg text-xs font-bold text-center transition-colors ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Sélectionné' : 'Sélectionner'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleConfirmSubscription}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Confirmer la souscription</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
