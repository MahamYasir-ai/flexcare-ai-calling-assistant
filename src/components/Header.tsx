import React from 'react';
import { 
  Activity, 
  Settings, 
  Stethoscope, 
  Sparkles,
  Bot
} from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  isCallActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  isCallActive,
}) => {
  return (
    // Note: Standard natural scroll (NOT sticky) as requested
    <header className="w-full bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-900 to-teal-800 text-white shadow-md shadow-teal-900/10 shrink-0">
              <Activity className="w-6 h-6 text-teal-300" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  CallPilot<span className="text-teal-600">.AI</span>
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded-full">
                  FlexCare AI Voice Assistant
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 font-medium mt-0.5">
                <span className="text-slate-400">Clinic:</span>
                <span className="font-semibold text-slate-800 flex items-center">
                  <Stethoscope className="w-4 h-4 mr-1 text-teal-600" />
                  FlexCare Physiotherapy & Sports Rehabilitation
                </span>
              </div>
            </div>
          </div>

          {/* Right Action: OmniDimension Status & Config */}
          <div className="flex items-center space-x-3">
            {/* OmniDimension Status Pill */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCallActive ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isCallActive ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              </span>
              <span className="text-slate-700 font-semibold">
                {isCallActive ? 'Voice Call Active' : 'FlexCare AI Assistant: Online'}
              </span>
            </div>

            {/* Essential Settings Button */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center px-3.5 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
              title="OmniDimension Agent ID & Configuration"
            >
              <Settings className="w-4 h-4 mr-1.5 text-slate-600" />
              <span>Agent Config</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
