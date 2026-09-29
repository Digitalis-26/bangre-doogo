'use client';

import React, { useState, useMemo } from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  StudentTuitionAccount,
  PaymentTransaction,
  TuitionInstallment,
  PaymentMethodType,
} from '@/lib/types';
import {
  CreditCard,
  Wallet,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  Search,
  Filter,
  Users,
  Building2,
  TrendingUp,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  QrCode,
  DollarSign,
  Plus,
  RefreshCw,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';
import { OfficialReceiptModal } from '@/components/OfficialReceiptModal';
import { formatDateNice } from '@/lib/utils';

export function TuitionView() {
  const {
    currentRole,
    currentUser,
    currentSchool,
    myChildren,
    classes,
    tuitionAccounts,
    paymentTransactions,
    tuitionReminders,
    processOnlineTuitionPayment,
    recordManualTuitionPayment,
    sendTuitionReminder,
    sendBulkTuitionReminders,
  } = useSchool();

  // Active top tab for administration
  const [adminSubTab, setAdminSubTab] = useState<'students' | 'transactions' | 'reminders'>('students');

  // Filters for administration
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'overdue' | 'partial' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected child for Parent View
  const [selectedChildStudentId, setSelectedChildStudentId] = useState<string>(
    myChildren[0]?.id || 'stud-1'
  );

  // Modal states
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<PaymentTransaction | null>(null);

  // Payment Drawer/Modal state (Parent Online Payment)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAccount, setPaymentAccount] = useState<StudentTuitionAccount | null>(null);
  const [selectedInstallmentId, setSelectedInstallmentId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(45000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('orange_money');
  const [payerPhone, setPayerPhone] = useState(currentUser.phone || '+226 78 90 12 34');
  const [otpCode, setOtpCode] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessFeedback, setPaymentSuccessFeedback] = useState<string | null>(null);

  // Manual Cashier Payment Modal state (Direction / Secrétariat)
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [cashierTargetAccount, setCashierTargetAccount] = useState<StudentTuitionAccount | null>(null);
  const [cashierAmount, setCashierAmount] = useState<number>(45000);
  const [cashierMethod, setCashierMethod] = useState<PaymentMethodType>('cash');
  const [cashierInstallmentName, setCashierInstallmentName] = useState('2ème Tranche');
  const [cashierPayerName, setCashierPayerName] = useState('');
  const [cashierPayerPhone, setCashierPayerPhone] = useState('');
  const [cashierNotes, setCashierNotes] = useState('');

  // Individual Reminder Modal state
  const [reminderTargetAccount, setReminderTargetAccount] = useState<StudentTuitionAccount | null>(null);
  const [reminderCustomMessage, setReminderCustomMessage] = useState('');
  const [reminderChannel, setReminderChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [reminderFeedback, setReminderFeedback] = useState<string | null>(null);

  // Bulk Reminder Confirmation Modal
  const [isBulkReminderOpen, setIsBulkReminderOpen] = useState(false);
  const [bulkChannel, setBulkChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [bulkFeedback, setBulkFeedback] = useState<string | null>(null);

  // -------------------------------------------------------------
  // COMPUTED METRICS FOR ADMINISTRATION
  // -------------------------------------------------------------
  const schoolAccounts = useMemo(() => {
    return tuitionAccounts.filter((a) => a.schoolId === currentSchool.id);
  }, [tuitionAccounts, currentSchool.id]);

  const totalExpectedRevenue = useMemo(() => {
    return schoolAccounts.reduce((acc, curr) => acc + curr.totalDue, 0);
  }, [schoolAccounts]);

  const totalCollectedRevenue = useMemo(() => {
    return schoolAccounts.reduce((acc, curr) => acc + curr.totalPaid, 0);
  }, [schoolAccounts]);

  const totalOverdueBalance = useMemo(() => {
    return schoolAccounts.reduce((acc, curr) => acc + curr.balance, 0);
  }, [schoolAccounts]);

  const recoveryRate = useMemo(() => {
    if (totalExpectedRevenue === 0) return 0;
    return Math.round((totalCollectedRevenue / totalExpectedRevenue) * 100);
  }, [totalExpectedRevenue, totalCollectedRevenue]);

  const overdueStudentsCount = useMemo(() => {
    return schoolAccounts.filter((a) => a.status === 'overdue').length;
  }, [schoolAccounts]);

  // Filtered accounts for management table
  const filteredSchoolAccounts = useMemo(() => {
    return schoolAccounts.filter((acc) => {
      if (selectedClassFilter !== 'all' && acc.classId !== selectedClassFilter) {
        return false;
      }
      if (selectedStatusFilter !== 'all' && acc.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = acc.studentName.toLowerCase().includes(query);
        const matchesMatricule = acc.studentMatricule.toLowerCase().includes(query);
        const matchesGuardian = acc.guardianName.toLowerCase().includes(query);
        if (!matchesName && !matchesMatricule && !matchesGuardian) return false;
      }
      return true;
    });
  }, [schoolAccounts, selectedClassFilter, selectedStatusFilter, searchQuery]);

  // -------------------------------------------------------------
  // PARENT VIEW COMPUTED DATA
  // -------------------------------------------------------------
  const currentParentAccount = useMemo(() => {
    return tuitionAccounts.find((a) => a.studentId === selectedChildStudentId) || tuitionAccounts[0];
  }, [tuitionAccounts, selectedChildStudentId]);

  const currentChildTransactions = useMemo(() => {
    if (!currentParentAccount) return [];
    return paymentTransactions.filter((p) => p.studentId === currentParentAccount.studentId);
  }, [paymentTransactions, currentParentAccount]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleOpenParentPayment = (account: StudentTuitionAccount, installment?: TuitionInstallment) => {
    setPaymentAccount(account);
    if (installment) {
      setSelectedInstallmentId(installment.id);
      setPaymentAmount(installment.amount - installment.paidAmount);
    } else {
      setSelectedInstallmentId('');
      setPaymentAmount(Math.min(account.balance, 45000));
    }
    setPayerPhone(currentUser.phone || '+226 78 90 12 34');
    setOtpCode('');
    setPaymentSuccessFeedback(null);
    setIsPaymentModalOpen(true);
  };

  const handleExecuteParentPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAccount) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      const methodLabels: Record<PaymentMethodType, string> = {
        orange_money: 'Orange Money Burkina',
        moov_money: 'Moov Money Flooz',
        wave: 'Wave CI / BF',
        coris_money: 'Coris Money / Barid Cash',
        cash: 'Espèces',
        bank_transfer: 'Virement bancaire',
      };

      const selectedInst = paymentAccount.installments.find((i) => i.id === selectedInstallmentId);

      const res = processOnlineTuitionPayment({
        studentId: paymentAccount.studentId,
        amount: paymentAmount,
        paymentMethod,
        methodLabel: methodLabels[paymentMethod],
        installmentId: selectedInstallmentId,
        installmentName: selectedInst ? selectedInst.name : 'Règlement de scolarité',
        payerName: currentUser.name,
        payerPhone,
      });

      setIsProcessingPayment(false);
      setPaymentSuccessFeedback(res.message);
      setSelectedTransactionForReceipt(res.transaction);
    }, 1200);
  };

  const handleOpenCashierModal = (account?: StudentTuitionAccount) => {
    const target = account || schoolAccounts[0];
    setCashierTargetAccount(target);
    setCashierAmount(target ? Math.min(target.balance, 45000) : 45000);
    setCashierPayerName(target ? target.guardianName : '');
    setCashierPayerPhone(target ? target.guardianPhone : '');
    setCashierInstallmentName('2ème Tranche');
    setCashierMethod('cash');
    setCashierNotes('');
    setIsCashierModalOpen(true);
  };

  const handleExecuteCashierPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierTargetAccount) return;

    const methodLabels: Record<PaymentMethodType, string> = {
      orange_money: 'Orange Money (Paiement guichet)',
      moov_money: 'Moov Money (Paiement guichet)',
      wave: 'Wave (Paiement guichet)',
      coris_money: 'Coris Money',
      cash: 'Espèces au guichet',
      bank_transfer: 'Virement bancaire / Dépôt direct',
    };

    const res = recordManualTuitionPayment({
      studentId: cashierTargetAccount.studentId,
      amount: cashierAmount,
      paymentMethod: cashierMethod,
      methodLabel: methodLabels[cashierMethod],
      installmentName: cashierInstallmentName,
      payerName: cashierPayerName || cashierTargetAccount.guardianName,
      payerPhone: cashierPayerPhone || cashierTargetAccount.guardianPhone,
      notes: cashierNotes,
    });

    setIsCashierModalOpen(false);
    setSelectedTransactionForReceipt(res.transaction);
  };

  const handleOpenReminderModal = (account: StudentTuitionAccount) => {
    setReminderTargetAccount(account);
    const defaultMsg = `Avis ${currentSchool.name} : Rappel pour la scolarité de ${account.studentName} (${account.className}). Reste dû : ${account.balance.toLocaleString()} FCFA. Règlement direct via Orange Money, Moov ou Wave sur votre espace ÉcoleConnect. Merci.`;
    setReminderCustomMessage(defaultMsg);
    setReminderChannel('sms');
    setReminderFeedback(null);
  };

  const handleSendSingleReminder = () => {
    if (!reminderTargetAccount) return;
    const res = sendTuitionReminder(
      reminderTargetAccount.studentId,
      reminderCustomMessage,
      reminderChannel
    );
    setReminderFeedback(res.message);
    setTimeout(() => {
      setReminderTargetAccount(null);
      setReminderFeedback(null);
    }, 2000);
  };

  const handleSendBulkReminders = () => {
    const overdueAccounts = schoolAccounts.filter((a) => a.balance > 0);
    const overdueIds = overdueAccounts.map((a) => a.studentId);
    const res = sendBulkTuitionReminders(overdueIds, bulkChannel);
    setBulkFeedback(res.message);
    setTimeout(() => {
      setIsBulkReminderOpen(false);
      setBulkFeedback(null);
    }, 2500);
  };

  const isParent = currentRole === 'parent';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. TOP HEADER & TITLE BANNER */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#154734]">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Module Frais & Scolarité</span>
            <span>·</span>
            <span className="text-slate-500 font-medium">UEMOA / FCFA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>{isParent ? 'Paiement de la Scolarité' : 'Gestion & Recouvrement des Frais'}</span>
            <span className="text-xl">💳</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {isParent
              ? 'Réglez les frais de scolarité de vos enfants en toute sécurité via Orange Money, Moov Money et Wave avec délivrance instantanée de quittance officielle.'
              : 'Pilotage complet des encaissements scolaires, relance automatique des impayés par SMS et délivrance des quittances certifiées.'}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {!isParent && (
            <>
              <button
                onClick={() => setIsBulkReminderOpen(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Relancer les impayés ({overdueStudentsCount})</span>
              </button>
              <button
                onClick={() => handleOpenCashierModal()}
                className="px-4 py-2.5 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer border border-emerald-700/50"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>Encaisser au guichet</span>
              </button>
            </>
          )}

          {isParent && currentParentAccount && (
            <button
              onClick={() => handleOpenParentPayment(currentParentAccount)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#154734] to-emerald-800 hover:from-[#0c3124] hover:to-[#154734] text-amber-300 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>Payer en ligne (Orange / Moov / Wave)</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PARENT PORTAL VIEW */}
      {/* ========================================================= */}
      {isParent && (
        <div className="space-y-6">
          {/* Child Selector Tabs */}
          {myChildren.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-xs font-bold text-slate-500 mr-1">Élève :</span>
              {myChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildStudentId(child.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                    selectedChildStudentId === child.id
                      ? 'bg-[#154734] text-amber-300 shadow-xs border border-emerald-700'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>👦 {child.firstName} {child.lastName}</span>
                  <span className="text-[10px] opacity-75 font-mono">({child.className})</span>
                </button>
              ))}
            </div>
          )}

          {/* Child Financial Status Card */}
          {currentParentAccount ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Financial Balance Summary */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Situation Financière
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      currentParentAccount.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentParentAccount.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {currentParentAccount.status === 'paid'
                      ? 'Scolarité Soldée'
                      : currentParentAccount.status === 'overdue'
                      ? 'Échéance en retard'
                      : 'Paiement partiel'}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Reste à payer</div>
                  <div className="text-3xl font-black font-mono text-slate-900 tracking-tight mt-0.5">
                    {currentParentAccount.balance.toLocaleString()} FCFA
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Total Scolarité</span>
                    <strong className="text-slate-800 font-mono">
                      {currentParentAccount.totalDue.toLocaleString()} FCFA
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Montant Déjà Réglé</span>
                    <strong className="text-emerald-700 font-mono">
                      {currentParentAccount.totalPaid.toLocaleString()} FCFA
                    </strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Progression du règlement</span>
                    <span>
                      {Math.round((currentParentAccount.totalPaid / currentParentAccount.totalDue) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#154734] to-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((currentParentAccount.totalPaid / currentParentAccount.totalDue) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {currentParentAccount.balance > 0 && (
                  <button
                    onClick={() => handleOpenParentPayment(currentParentAccount)}
                    className="w-full py-3 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Régler le solde maintenant</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                )}
              </div>

              {/* Installments Breakdown Card */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Échéancier des Tranches de Scolarité
                  </h3>
                  <span className="text-xs text-slate-500">
                    Année scolaire 2025-2026
                  </span>
                </div>

                <div className="space-y-3">
                  {currentParentAccount.installments.map((inst, idx) => (
                    <div
                      key={inst.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        inst.status === 'paid'
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : inst.status === 'overdue'
                          ? 'border-red-200 bg-red-50/30'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <strong className="text-xs sm:text-sm font-bold text-slate-900">
                            {inst.name}
                          </strong>
                          {inst.status === 'paid' && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Réglé</span>
                            </span>
                          )}
                          {inst.status === 'overdue' && (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black animate-pulse">
                              Échue en retard
                            </span>
                          )}
                          {inst.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                              À venir
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span>
                            Échéance : <strong>{new Date(inst.dueDate).toLocaleDateString('fr-FR')}</strong>
                          </span>
                          {inst.paidDate && (
                            <span className="text-emerald-700">
                              Payé le {new Date(inst.paidDate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-mono font-black text-slate-900">
                            {inst.amount.toLocaleString()} FCFA
                          </div>
                          {inst.paidAmount < inst.amount && (
                            <div className="text-[10px] text-slate-400">
                              Reste : {(inst.amount - inst.paidAmount).toLocaleString()} FCFA
                            </div>
                          )}
                        </div>

                        {inst.status !== 'paid' ? (
                          <button
                            onClick={() => handleOpenParentPayment(currentParentAccount, inst)}
                            className="px-3.5 py-2 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Payer cette tranche
                          </button>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border text-center text-slate-500">
              Aucun dossier de scolarité associé à cet élève.
            </div>
          )}

          {/* Child Payment Receipts History */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#154734]" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Quittances de Paiement Délivrées
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {currentChildTransactions.length} quittance(s) officielle(s)
              </span>
            </div>

            {currentChildTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Aucun versement enregistré pour le moment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">N° Quittance</th>
                      <th className="py-3 px-4">Date & Heure</th>
                      <th className="py-3 px-4">Désignation</th>
                      <th className="py-3 px-4">Montant</th>
                      <th className="py-3 px-4">Mode de règlement</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentChildTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-[#154734]">
                          {tx.receiptNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {formatDateNice(tx.createdAt)}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {tx.installmentName}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {tx.amount.toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200/80">
                            <span>{tx.methodLabel}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedTransactionForReceipt(tx)}
                            className="px-3 py-1.5 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Voir Quittance</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ADMINISTRATION VIEW (DIRECTION / SECRÉTARIAT) */}
      {/* ========================================================= */}
      {!isParent && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Total Attendu
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">
                {totalExpectedRevenue.toLocaleString()} FCFA
              </div>
              <p className="text-[10px] text-slate-400">Base élèves inscrits</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                  Total Recouvré
                </span>
                <span className="text-xs font-black text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
                  {recoveryRate}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
                {totalCollectedRevenue.toLocaleString()} FCFA
              </div>
              <p className="text-[10px] text-emerald-600 font-medium">Encaissements validés</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                Reste à Recouvrer
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-600">
                {totalOverdueBalance.toLocaleString()} FCFA
              </div>
              <p className="text-[10px] text-slate-400">Soldes en attente & retards</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-red-800 uppercase tracking-wide">
                Élèves en Retard
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-red-600">
                {overdueStudentsCount} élèves
              </div>
              <p className="text-[10px] text-red-500 font-medium">Tranches échues non réglées</p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdminSubTab('students')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  adminSubTab === 'students'
                    ? 'bg-[#154734] text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                👥 Comptes & Soldes par Élève ({filteredSchoolAccounts.length})
              </button>
              <button
                onClick={() => setAdminSubTab('transactions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  adminSubTab === 'transactions'
                    ? 'bg-[#154734] text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                📑 Journal des Encaissements & Quittances ({paymentTransactions.length})
              </button>
              <button
                onClick={() => setAdminSubTab('reminders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  adminSubTab === 'reminders'
                    ? 'bg-[#154734] text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                📲 Historique des Relances SMS ({tuitionReminders.length})
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* TAB 1: STUDENTS SCOLARITÉ TABLE */}
          {/* ------------------------------------------------------ */}
          {adminSubTab === 'students' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              {/* Filters & Search Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nom, matricule ou parent..."
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-[#154734] focus:ring-1 focus:ring-[#154734]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {/* Class Filter */}
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none"
                  >
                    <option value="all">Toutes les classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                    className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="overdue">⚠️ En retard / Impayé</option>
                    <option value="partial">⏳ Partiel</option>
                    <option value="paid">✅ Scolarité Soldée</option>
                  </select>
                </div>
              </div>

              {/* Accounts Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">Élève & Matricule</th>
                      <th className="py-3 px-4">Classe</th>
                      <th className="py-3 px-4">Parent / Contact</th>
                      <th className="py-3 px-4">Total Dû</th>
                      <th className="py-3 px-4">Réglé</th>
                      <th className="py-3 px-4">Reste</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSchoolAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{acc.studentName}</div>
                          <div className="font-mono text-[10px] text-emerald-800">
                            {acc.studentMatricule}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{acc.className}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">{acc.guardianName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {acc.guardianPhone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {acc.totalDue.toLocaleString()} F
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          {acc.totalPaid.toLocaleString()} F
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span className={acc.balance > 0 ? 'text-amber-700' : 'text-slate-400'}>
                            {acc.balance.toLocaleString()} F
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              acc.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : acc.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {acc.status === 'paid'
                              ? 'Soldé'
                              : acc.status === 'overdue'
                              ? 'En retard'
                              : 'Partiel'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Relancer button */}
                            {acc.balance > 0 && (
                              <button
                                onClick={() => handleOpenReminderModal(acc)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-lg text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                title="Envoyer une relance SMS"
                              >
                                <Send className="w-3 h-3 text-amber-700" />
                                <span>Relancer</span>
                              </button>
                            )}

                            {/* Encaisser button */}
                            {acc.balance > 0 && (
                              <button
                                onClick={() => handleOpenCashierModal(acc)}
                                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#154734] border border-emerald-300 font-bold rounded-lg text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                                title="Encaisser un versement"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Encaisser</span>
                              </button>
                            )}

                            {/* View receipts button */}
                            <button
                              onClick={() => {
                                const lastTx = paymentTransactions.find(
                                  (t) => t.studentId === acc.studentId
                                );
                                if (lastTx) {
                                  setSelectedTransactionForReceipt(lastTx);
                                } else {
                                  alert('Aucune quittance émise pour le moment.');
                                }
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-[11px] transition-colors cursor-pointer"
                              title="Voir la dernière quittance"
                            >
                              Quittance
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 2: TRANSACTIONS & RECEIPTS JOURNAL */}
          {/* ------------------------------------------------------ */}
          {adminSubTab === 'transactions' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#154734]" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Journal des Quittances Délivrées
                  </h3>
                </div>
                <button
                  onClick={() => handleOpenCashierModal()}
                  className="px-3.5 py-1.5 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvel Encaissement</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">N° Quittance</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Élève & Classe</th>
                      <th className="py-3 px-4">Tranche</th>
                      <th className="py-3 px-4">Montant</th>
                      <th className="py-3 px-4">Règlement</th>
                      <th className="py-3 px-4">Encaissé par</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-[#154734]">
                          {tx.receiptNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {formatDateNice(tx.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{tx.studentName}</div>
                          <div className="text-[10px] text-slate-500">{tx.className}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {tx.installmentName}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900">
                          {tx.amount.toLocaleString()} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200/60">
                            {tx.methodLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {tx.recordedBy}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedTransactionForReceipt(tx)}
                            className="px-3 py-1.5 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimer</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ */}
          {/* TAB 3: REMINDERS HISTORY */}
          {/* ------------------------------------------------------ */}
          {adminSubTab === 'reminders' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                    Historique des Relances SMS Transmises
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  {tuitionReminders.length} notification(s) envoyée(s)
                </span>
              </div>

              <div className="space-y-3">
                {tuitionReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rem.studentName}</span>
                        <span className="text-slate-400">({rem.className})</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Délivré par SMS
                        </span>
                      </div>
                      <p className="text-slate-600 italic">"{rem.message}"</p>
                      <div className="text-[11px] text-slate-400">
                        Destinataire : <strong>{rem.parentName}</strong> ({rem.parentPhone}) · Échéance rappelée : {rem.dueDate}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-amber-700 text-sm">
                        {rem.amountDue.toLocaleString()} FCFA
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Envoyé le {formatDateNice(rem.sentAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL: PARENT ONLINE PAYMENT (ORANGE / MOOV / WAVE) */}
      {/* ========================================================= */}
      {isPaymentModalOpen && paymentAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#154734] text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-300" />
                <span className="font-black text-sm uppercase tracking-wide text-amber-300">
                  Paiement de la Scolarité en Ligne
                </span>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 text-emerald-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteParentPayment} className="p-6 space-y-4">
              {/* Target Student Details */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{paymentAccount.studentName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    Matricule : {paymentAccount.studentMatricule} · {paymentAccount.className}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Reste total</div>
                  <div className="font-mono font-bold text-slate-900">
                    {paymentAccount.balance.toLocaleString()} FCFA
                  </div>
                </div>
              </div>

              {/* Installment Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tranche ou Motif de versement
                </label>
                <select
                  value={selectedInstallmentId}
                  onChange={(e) => {
                    setSelectedInstallmentId(e.target.value);
                    const inst = paymentAccount.installments.find((i) => i.id === e.target.value);
                    if (inst) setPaymentAmount(inst.amount - inst.paidAmount);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 outline-none"
                >
                  <option value="">Règlement libre / Acompte sur solde</option>
                  {paymentAccount.installments.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} — {inst.amount.toLocaleString()} FCFA{' '}
                      {inst.status === 'paid' ? '(Soldé)' : `(Reste ${(inst.amount - inst.paidAmount).toLocaleString()} F)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount to Pay */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Montant à régler (FCFA)
                </label>
                <input
                  type="number"
                  min="1000"
                  max={paymentAccount.balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-sm font-mono font-bold px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#154734]"
                  required
                />
              </div>

              {/* Payment Methods Choice (Local Mobile Money) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Choisissez votre moyen de paiement local
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Orange Money */}
                  <div
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      paymentMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-xs shrink-0">
                      OM
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Orange Money</div>
                      <div className="text-[10px] text-slate-500">*144# Burkina</div>
                    </div>
                  </div>

                  {/* Moov Money */}
                  <div
                    onClick={() => setPaymentMethod('moov_money')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      paymentMethod === 'moov_money'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                      MF
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Moov Money</div>
                      <div className="text-[10px] text-slate-500">*555# Flooz</div>
                    </div>
                  </div>

                  {/* Wave */}
                  <div
                    onClick={() => setPaymentMethod('wave')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      paymentMethod === 'wave'
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-500 text-white font-black flex items-center justify-center text-xs shrink-0">
                      W
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Wave</div>
                      <div className="text-[10px] text-slate-500">Zéro frais de dépôt</div>
                    </div>
                  </div>

                  {/* Coris Money */}
                  <div
                    onClick={() => setPaymentMethod('coris_money')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      paymentMethod === 'coris_money'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-xs shrink-0">
                      CM
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">Coris Money</div>
                      <div className="text-[10px] text-slate-500">Coris Bank BF</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Prompt for OTP / Push Notification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro de compte Mobile Money
                </label>
                <input
                  type="tel"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="+226 78 90 12 34"
                  className="w-full text-xs font-mono px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Une invite de validation USSD ou notification push sera envoyée sur ce numéro.
                </span>
              </div>

              {/* Validation Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-gradient-to-r from-[#154734] to-emerald-800 hover:from-[#0c3124] hover:to-[#154734] text-amber-300 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Validation sécurisée en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmer le paiement de {paymentAmount.toLocaleString()} FCFA</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: CASHIER PAYMENT (DIRECTION / SECRÉTARIAT) */}
      {/* ========================================================= */}
      {isCashierModalOpen && cashierTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="px-6 py-4 bg-[#154734] text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-300" />
                <span className="font-black text-sm uppercase tracking-wide text-amber-300">
                  Enregistrement d'un Encaissement Guichet
                </span>
              </div>
              <button
                onClick={() => setIsCashierModalOpen(false)}
                className="p-1.5 text-emerald-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteCashierPayment} className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900">{cashierTargetAccount.studentName}</div>
                <div className="text-slate-500 font-mono">
                  Matricule : {cashierTargetAccount.studentMatricule} · {cashierTargetAccount.className}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant versé (FCFA)</label>
                  <input
                    type="number"
                    value={cashierAmount}
                    onChange={(e) => setCashierAmount(Number(e.target.value))}
                    className="w-full font-mono font-bold text-sm px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode de versement</label>
                  <select
                    value={cashierMethod}
                    onChange={(e) => setCashierMethod(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="cash">Espèces au guichet</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="moov_money">Moov Money</option>
                    <option value="wave">Wave</option>
                    <option value="bank_transfer">Virement bancaire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tranche / Désignation</label>
                <input
                  type="text"
                  value={cashierInstallmentName}
                  onChange={(e) => setCashierInstallmentName(e.target.value)}
                  placeholder="ex: 1ère Tranche, Solde scolarité..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom du déposant</label>
                  <input
                    type="text"
                    value={cashierPayerName}
                    onChange={(e) => setCashierPayerName(e.target.value)}
                    placeholder="Nom du parent..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone déposant</label>
                  <input
                    type="tel"
                    value={cashierPayerPhone}
                    onChange={(e) => setCashierPayerPhone(e.target.value)}
                    placeholder="+226..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarques internes / Bordereau</label>
                <input
                  type="text"
                  value={cashierNotes}
                  onChange={(e) => setCashierNotes(e.target.value)}
                  placeholder="N° de reçu manuel ou bordereau banque..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4 text-amber-300" />
                  <span>Enregistrer & Générer la Quittance Officielle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: INDIVIDUAL REMINDER (SMS / WHATSAPP) */}
      {/* ========================================================= */}
      {reminderTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between border-b border-amber-600">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-slate-950" />
                <span className="font-black text-xs uppercase tracking-wide">
                  Relance Impayé Scolarité
                </span>
              </div>
              <button
                onClick={() => setReminderTargetAccount(null)}
                className="p-1 text-slate-950 hover:bg-amber-600 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">{reminderTargetAccount.studentName}</div>
                <div className="text-slate-500">
                  Parent : <strong>{reminderTargetAccount.guardianName}</strong> ({reminderTargetAccount.guardianPhone})
                </div>
                <div className="font-mono font-bold text-amber-800">
                  Solde en retard : {reminderTargetAccount.balance.toLocaleString()} FCFA
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Canal d'envoi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReminderChannel('sms')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      reminderChannel === 'sms'
                        ? 'border-amber-500 bg-amber-50 text-slate-950'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    📲 SMS Automatique
                  </button>
                  <button
                    type="button"
                    onClick={() => setReminderChannel('whatsapp')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      reminderChannel === 'whatsapp'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    💬 WhatsApp Direct
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message de relance</label>
                <textarea
                  rows={4}
                  value={reminderCustomMessage}
                  onChange={(e) => setReminderCustomMessage(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs leading-relaxed"
                />
              </div>

              {reminderFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{reminderFeedback}</span>
                </div>
              )}

              <button
                onClick={handleSendSingleReminder}
                className="w-full py-3 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Envoyer la relance au {reminderTargetAccount.guardianPhone}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL: BULK REMINDERS */}
      {/* ========================================================= */}
      {isBulkReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between border-b border-amber-600">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-slate-950" />
                <span className="font-black text-xs uppercase tracking-wide">
                  Relance Groupée des Impayés
                </span>
              </div>
              <button
                onClick={() => setIsBulkReminderOpen(false)}
                className="p-1 text-slate-950 hover:bg-amber-600 rounded-lg transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <div className="font-bold text-amber-950">
                  {overdueStudentsCount} élèves ciblés en retard de scolarité
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Cette action transmettra instantanément un rappel personnalisé par SMS à chaque parent avec le montant exact de sa tranche échue et les instructions de règlement en ligne.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Canal de diffusion</label>
                <select
                  value={bulkChannel}
                  onChange={(e) => setBulkChannel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 outline-none text-xs"
                >
                  <option value="sms">Passerelle SMS Nationale (Burkina / UEMOA)</option>
                  <option value="whatsapp">Liaison WhatsApp Directe</option>
                </select>
              </div>

              {bulkFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{bulkFeedback}</span>
                </div>
              )}

              <button
                onClick={handleSendBulkReminders}
                className="w-full py-3.5 bg-[#154734] hover:bg-[#0c3124] text-amber-300 font-black rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Confirmer l'envoi des {overdueStudentsCount} relances SMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. MODAL: OFFICIAL STAMPED RECEIPT PREVIEW */}
      {/* ========================================================= */}
      <OfficialReceiptModal
        transaction={selectedTransactionForReceipt}
        onClose={() => setSelectedTransactionForReceipt(null)}
      />
    </div>
  );
}
