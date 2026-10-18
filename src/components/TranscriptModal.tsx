import React from 'react';
import { 
  X, 
  FileText, 
  Bot, 
  User, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Calendar, 
  Download, 
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { CallRecord } from '../types';
import { consultationTypesLabels } from '../data/mockData';

interface TranscriptModalProps {
  call: CallRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TranscriptModal: React.FC<TranscriptModalProps> = ({
  call,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !call) return null;

  const consultInfo = consultationTypesLabels[call.consultationType] || {
    label: 'Physiotherapy Consultation',
    duration: '45 min',
  };

  const handleExportText = () => {
    const lines = [
      `FlexCare Physiotherapy - AI Call Transcript`,
      `Patient: ${call.contactName} (${call.phoneNumber})`,
      `Date/Time: ${call.timestamp}`,
      `Duration: ${call.duration}`,
      `Consultation Type: ${consultInfo.label}`,
      `Outcome: ${call.outcome}`,
      `Preferred Slot: ${call.preferredDate} - ${call.preferredTime}`,
      `Clinical Note: ${call.summary}`,
      `Compliance Score: ${call.complianceScore}% Verified`,
      `----------------------------------------`,
      ...call.transcript.map(
        (m) => `[${m.timestamp}] ${m.speaker.toUpperCase()}: ${m.text}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlexCare_Transcript_${call.contactName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <FileText className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center">
                Call Audio Transcript & Audit
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {call.id}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-800">{call.contactName}</span> • {call.phoneNumber} • {call.duration}
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

        {/* Triage Overview Banner */}
        <div className="bg-slate-100/70 px-5 py-3 border-b border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Service</span>
            <span className="font-semibold text-slate-800">{consultInfo.label}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Requested Slot</span>
            <span className="font-semibold text-teal-800">{call.preferredDate}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Therapist</span>
            <span className="font-semibold text-slate-800">{call.assignedTherapist || 'Elena Rostova'}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Guardrail Audit</span>
            <span className="font-bold text-emerald-700 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              100% Passed
            </span>
          </div>
        </div>

        {/* Transcript Dialogue List */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-white">
          {call.transcript.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No audio transcript available for this call.
            </div>
          ) : (
            call.transcript.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.speaker === 'agent' ? 'items-start' : 'items-end'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400">
                  {msg.speaker === 'agent' ? (
                    <>
                      <Bot className="w-3.5 h-3.5 text-teal-600" />
                      <span className="font-bold text-teal-900">FlexCare AI Agent</span>
                      <span>• {msg.timestamp}</span>
                    </>
                  ) : (
                    <>
                      <span>{msg.timestamp} •</span>
                      <span className="font-bold text-slate-700">{call.contactName}</span>
                      <User className="w-3.5 h-3.5 text-slate-500" />
                    </>
                  )}
                </div>

                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                    msg.speaker === 'agent'
                      ? 'bg-slate-50 border border-slate-200/90 text-slate-800 shadow-2xs rounded-tl-xs'
                      : 'bg-teal-700 text-white shadow-2xs rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.isComplianceHighlight && (
                  <div className="mt-1 flex items-center space-x-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{msg.complianceNote}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer with Clinical Note & Download */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 italic text-[11px]">
            Summary: {call.summary}
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleExportText}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Download Transcript (.txt)
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
