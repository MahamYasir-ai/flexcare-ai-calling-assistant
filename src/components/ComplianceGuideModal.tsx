import React from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  Lock, 
  FileCheck2, 
  CalendarClock,
  Sparkles
} from 'lucide-react';

interface ComplianceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceGuideModal: React.FC<ComplianceGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                CallPilot AI Behavioral Constitution & Guardrails
              </h3>
              <p className="text-xs text-slate-500">
                FlexCare Physiotherapy outbound calling protocols and compliance specifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Key Rule Highlight */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
            <div className="font-bold text-xs flex items-center text-amber-900">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600 shrink-0" />
              CRITICAL: Zero False-Confirmation Guardrail
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Under clinical healthcare rules, the AI voice agent <strong>must never claim an appointment is confirmed</strong> without explicit, successful verification from the clinic's scheduling EMR system. Every booking request captured by CallPilot is tagged as <em>Tentative (Subject to Availability)</em>.
            </p>
          </div>

          {/* 4 Core Pillars */}
          <div className="space-y-3">
            {/* Pillar 1 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  Mandatory AI & Clinic Identification
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  The voice agent immediately introduces itself: <em>“Hello, this is CallPilot calling on behalf of FlexCare Physiotherapy. I'm an automated assistant...”</em> ensuring patient transparency.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  Consultation Interest & Injury Intake
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  The agent actively asks if the person is interested in booking a consultation for physical recovery, pain relief, or sports rehab, and notes specific musculoskeletal complaints.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  Preferred Time Window Collection
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  The agent collects preferred days (e.g. Tuesday mornings) and suitable time ranges, ensuring patient convenience without overbooking.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">
                  Availability Disclaimer & EMR Sync
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  The agent explicitly informs the patient: <em>“Please note that this appointment is tentative and subject to clinic schedule availability. Our coordinator will review the roster and text you a formal confirmation shortly.”</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
