'use client';

import React from 'react';
import { useSchool } from '@/context/SchoolContext';
import {
  Smartphone,
  Signal,
  Wifi,
  Battery,
  X,
  Home,
  FileText,
  Clock,
  UserCheck,
} from 'lucide-react';

interface MobileSimulatorFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MobileSimulatorFrame({
  children,
  activeTab,
  setActiveTab,
}: MobileSimulatorFrameProps) {
  const { isMobileDeviceView, setIsMobileDeviceView, currentRole } = useSchool();

  if (!isMobileDeviceView) {
    return <>{children}</>;
  }

  return (
    <div className="py-6 flex flex-col items-center">
      {/* Top Banner indicating mobile frame */}
      <div className="mb-4 flex items-center justify-between gap-4 max-w-[420px] w-full px-2 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>Émulateur Mobile PWA (Expérience Smartphone Parent/Prof)</span>
        </span>
        <button
          onClick={() => setIsMobileDeviceView(false)}
          className="text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer font-semibold"
        >
          <X className="w-3.5 h-3.5" />
          <span>Quitter l'émulateur</span>
        </button>
      </div>

      {/* Phone Case */}
      <div className="w-full max-w-[420px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative">
        {/* Dynamic Island / Notch */}
        <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-950 mr-2" />
          <div className="w-8 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Screen container */}
        <div className="bg-slate-50 rounded-[34px] overflow-hidden min-h-[720px] flex flex-col border border-slate-200 shadow-inner">
          {/* Status Bar */}
          <div className="px-6 py-2 bg-white flex items-center justify-between text-xs font-mono text-slate-800 border-b border-slate-100">
            <span className="font-bold">08:30</span>
            <div className="flex items-center gap-2">
              <Signal className="w-3 h-3 text-slate-600" />
              <Wifi className="w-3.5 h-3.5 text-slate-600" />
              <Battery className="w-4 h-4 text-slate-600" />
            </div>
          </div>

          {/* Scrollable Mobile Content */}
          <div className="flex-1 p-3 overflow-y-auto max-h-[640px]">
            {children}
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium cursor-pointer ${
                activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>

            <button
              onClick={() => setActiveTab('announcements')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium cursor-pointer ${
                activeTab === 'announcements' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Annonces</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium cursor-pointer ${
                activeTab === 'attendance' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Présences</span>
            </button>

            <button
              onClick={() => setActiveTab('liaison')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-medium cursor-pointer ${
                activeTab === 'liaison' ? 'text-emerald-700 font-bold' : 'hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Liaisons</span>
            </button>
          </div>

          {/* Home indicator bar */}
          <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto my-1.5" />
        </div>
      </div>
    </div>
  );
}
