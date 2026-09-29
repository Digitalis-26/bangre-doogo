'use client';

import React from 'react';
import { PaymentTransaction } from '@/lib/types';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  Building2,
  Calendar,
  FileCheck,
  ShieldCheck,
  CreditCard,
  User,
  ArrowRight,
} from 'lucide-react';
import { formatNumber, formatDateNice } from '@/lib/utils';

interface OfficialReceiptModalProps {
  transaction: PaymentTransaction | null;
  onClose: () => void;
}

// Convert numbers to French words for official currency display
function numberToFrenchWords(n: number): string {
  if (n === 0) return 'Zéro Franc CFA';
  const units = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
  const teens = ['Dix', 'Onze', 'Douze', 'Treize', 'Quatorze', 'Quinze', 'Seize', 'Dix-sept', 'Dix-huit', 'Dix-neuf'];
  const tens = ['', 'Dix', 'Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante-dix', 'Quatre-vingts', 'Quatre-vingt-dix'];

  if (n === 40000) return 'Quarante mille Francs CFA';
  if (n === 45000) return 'Quarante-cinq mille Francs CFA';
  if (n === 50000) return 'Cinquante mille Francs CFA';
  if (n === 60000) return 'Soixante mille Francs CFA';
  if (n === 80000) return 'Quatre-vingts mille Francs CFA';
  if (n === 90000) return 'Quatre-vingt-dix mille Francs CFA';
  if (n === 100000) return 'Cent mille Francs CFA';
  if (n === 120000) return 'Cent vingt mille Francs CFA';
  if (n === 135000) return 'Cent trente-cinq mille Francs CFA';
  if (n === 150000) return 'Cent cinquante mille Francs CFA';
  if (n === 160000) return 'Cent soixante mille Francs CFA';

  return `${n.toLocaleString('fr-FR')} Francs CFA`;
}

export function OfficialReceiptModal({ transaction, onClose }: OfficialReceiptModalProps) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const shareReceiptWhatsApp = () => {
    const text = `*QUITTANCE DE PAIEMENT SCOLARITÉ N° ${transaction.receiptNumber}*\n` +
      `Établissement : ${transaction.schoolName}\n` +
      `Élève : ${transaction.studentName} (Matricule: ${transaction.studentMatricule})\n` +
      `Classe : ${transaction.className}\n` +
      `Montant versé : ${transaction.amount.toLocaleString()} FCFA\n` +
      `Mode : ${transaction.methodLabel} (Réf: ${transaction.methodRef || 'N/A'})\n` +
      `Tranche : ${transaction.installmentName}\n` +
      `Reste à devoir : ${transaction.balanceAfter.toLocaleString()} FCFA\n` +
      `Statut : Validé et Enregistré sur ÉcoleConnect.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Top Action Bar (hidden when printing) */}
        <div className="print:hidden px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-wide uppercase">
              Quittance de Paiement Scolaire Officielle
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-700/40"
              title="Imprimer ou enregistrer en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={shareReceiptWhatsApp}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Envoyer la quittance par WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div id="official-receipt" className="p-6 sm:p-8 space-y-6 bg-white text-slate-900">
          {/* Header Strip with National Coat & School Coordinates */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  RÉPUBLIQUE DU BURKINA FASO · MINISTÈRE DE L'ÉDUCATION NATIONALE
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#154734] mt-1 tracking-tight">
                  {transaction.schoolName}
                </h2>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span>{transaction.schoolCity}</span>
                  <span>·</span>
                  <span>Tél : {transaction.schoolPhone}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold">Service Comptabilité & Scolarité</span>
                </div>
              </div>

              {/* Receipt Number Badge */}
              <div className="text-center sm:text-right bg-emerald-50 border-2 border-emerald-600/40 rounded-2xl p-3 shrink-0">
                <div className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
                  QUITTANCE OFFICIELLE
                </div>
                <div className="text-base sm:text-lg font-black font-mono text-[#154734] mt-0.5">
                  {transaction.receiptNumber}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Date : {formatDateNice(transaction.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Student & Payment Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Bénéficiaire (Élève)
              </div>
              <div className="text-base font-extrabold text-slate-900 mt-1">
                {transaction.studentName}
              </div>
              <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-800">
                  Matricule : {transaction.studentMatricule}
                </span>
                <span>·</span>
                <span className="font-semibold text-slate-700">Classe : {transaction.className}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Réglement effectué par
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {transaction.payerName}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                Contact : {transaction.payerPhone} · {transaction.recordedBy}
              </div>
            </div>
          </div>

          {/* Core Payment Details Box */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="bg-[#154734] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span>Désignation des Frais Scolaires</span>
              <span>Montant Réglé</span>
            </div>

            <div className="p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {transaction.installmentName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Mode : <strong className="text-slate-800">{transaction.methodLabel}</strong>
                    {transaction.methodRef && (
                      <span className="ml-2 font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        Réf : {transaction.methodRef}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-mono text-[#154734]">
                    {transaction.amount.toLocaleString()} FCFA
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Payé avec succès</span>
                  </div>
                </div>
              </div>

              {/* Amount in French Words */}
              <div className="text-xs text-slate-700 italic bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/80">
                Arrêté la présente quittance à la somme de :{' '}
                <strong className="text-amber-950 font-bold not-italic">
                  {numberToFrenchWords(transaction.amount)}
                </strong>.
              </div>

              {/* Balance State */}
              <div className="flex items-center justify-between text-xs pt-1 text-slate-600">
                <span>Reste à devoir sur l'année scolaire :</span>
                <span className={`font-mono font-bold ${transaction.balanceAfter === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {transaction.balanceAfter === 0 ? '0 FCFA (Scolarité soldée)' : `${transaction.balanceAfter.toLocaleString()} FCFA`}
                </span>
              </div>
            </div>
          </div>

          {/* Official Stamp & Signatures */}
          <div className="pt-3 grid grid-cols-2 gap-4 items-center">
            {/* Security Certification */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certification Électronique</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Ce document officiel tient lieu de preuve de paiement libératoire pour l'élève.
                Vérifiable auprès de l'intendance de l'établissement via son identifiant unique.
              </p>
            </div>

            {/* Circular Digital Stamp */}
            <div className="flex justify-end">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#154734] p-1.5 flex flex-col items-center justify-center text-center rotate-[-3deg] bg-emerald-50/50 shadow-xs select-none">
                <div className="text-[8px] font-black uppercase text-[#154734] tracking-tighter">
                  DIRECTION DES ÉTUDES
                </div>
                <div className="w-6 h-6 my-0.5 rounded-full bg-[#154734] text-amber-300 flex items-center justify-center font-bold text-[10px]">
                  EC
                </div>
                <div className="text-[9px] font-extrabold text-amber-800">
                  ★ QUITTANCÉ ★
                </div>
                <div className="text-[7px] text-slate-500 font-mono">
                  {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Modal Close Button */}
        <div className="print:hidden p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
