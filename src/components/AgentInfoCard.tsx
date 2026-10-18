import React from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Mic2, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { AgentConfig, CallStatus } from '../types';

interface AgentInfoCardProps {
  config: AgentConfig;
  callStatus: CallStatus;
  onOpenConfig: () => void;
}

export const AgentInfoCard: React.FC<AgentInfoCardProps> = ({
  config,
  callStatus,
  onOpenConfig,
}) => {
  const getStatusDisplay = () => {
    switch (callStatus) {
      case 'initiating':
        return {
          label: 'Initiating Outbound Trunk...',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500 animate-pulse',
        };
      case 'in_progress':
        return {
          label: 'In Call • Live Speech Active',
          badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
          dotClass: 'bg-teal-500 animate-ping',
        };
      case 'completed':
        return {
          label: 'Call Completed • Ready',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      case 'failed':
        return {
          label: 'Carrier Route Missing',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500',
        };
      case 'idle':
      default:
        return {
          label: 'Online • Ready for Outbound Dispatch',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/10 border border-teal-600/20 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
            <Bot className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                FlexCare AI Voice Assistant
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                Widget Key: 0c446602...
              </span>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              Autonomous outbound patient triage and consultation booking engine
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center space-x-2.5">
          <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold border ${status.badgeClass}`}>
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${status.dotClass}`} />
            {status.label}
          </div>
          <button
            onClick={onOpenConfig}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Edit agent parameters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Symmetrical 3-Column Grid of Specs & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 text-sm items-stretch">
        {/* Card 1: Purpose */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between h-full space-y-2">
          <div>
            <span className="font-bold text-slate-700 uppercase tracking-wider text-xs flex items-center mb-2">
              <Sparkles className="w-4 h-4 mr-1.5 text-teal-600" />
              Agent Purpose & Scope
            </span>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              Calls patients who inquired about FlexCare physical therapy, evaluates musculoskeletal complaints, logs preferred booking slots, and routes inquiries to clinical staff.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-medium pt-2 border-t border-slate-200/60">
            Outbound Calling Protocol Active
          </div>
        </div>

        {/* Card 2: Voice Persona Specs */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between h-full space-y-2">
          <div>
            <span className="font-bold text-slate-700 uppercase tracking-wider text-xs flex items-center mb-2">
              <Mic2 className="w-4 h-4 mr-1.5 text-teal-600" />
              Voice Model & Persona
            </span>
            <div className="space-y-1.5 text-slate-700 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Persona:</span>
                <span className="font-bold text-slate-900">{config.voicePersona.split('(')[0]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Tone:</span>
                <span className="font-semibold text-teal-800">Empathetic Clinical Triage</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Engine:</span>
                <span className="font-mono text-xs font-semibold">OmniDimension V3</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium pt-2 border-t border-slate-200/60">
            Speech Rate: {config.speechRate}x Natural
          </div>
        </div>

        {/* Card 3: Behavioral Guardrails */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between h-full space-y-2">
          <div>
            <span className="font-bold text-slate-700 uppercase tracking-wider text-xs flex items-center mb-2">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-600" />
              Clinical Guardrails
            </span>
            <ul className="space-y-1.5 text-slate-700 text-xs sm:text-sm">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-teal-600 mr-2 mt-0.5 shrink-0" />
                <span>Mandatory AI introduction & FlexCare affiliation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 text-teal-600 mr-2 mt-0.5 shrink-0" />
                <span>Collects preferred slot & injury focus</span>
              </li>
              <li className="flex items-start text-amber-900 font-medium">
                <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 mt-0.5 shrink-0" />
                <span>Never confirms booking without EMR sync</span>
              </li>
            </ul>
          </div>
          <div className="text-xs text-emerald-700 font-semibold pt-2 border-t border-slate-200/60 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Zero False Confirmation Policy Enforced
          </div>
        </div>
      </div>
    </div>
  );
};
