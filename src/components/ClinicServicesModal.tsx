import React from 'react';
import { 
  X, 
  Stethoscope, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Activity, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';
import { physiotherapists, consultationTypesLabels } from '../data/mockData';

interface ClinicServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicServicesModal: React.FC<ClinicServicesModalProps> = ({
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
              <Stethoscope className="w-4 h-4 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                FlexCare Physiotherapy & Sports Rehabilitation
              </h3>
              <p className="text-xs text-slate-500">
                Clinic profile, clinical specialties, and therapist scheduling roster
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
        <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Clinic Summary Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-900 to-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">
                Authorized Outbound Triage Center
              </span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                EMR ID: FLX-CORP-409
              </span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              FlexCare Physiotherapy provides evidence-based musculoskeletal rehabilitation, sports injury recovery, post-surgical mobilization, and spinal alignment care.
            </p>
            <div className="pt-1 flex flex-wrap gap-4 text-[11px] text-teal-200">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-teal-400" />
                450 Wellness Way, Suite 300, Medical Plaza
              </span>
              <span className="flex items-center">
                <Phone className="w-3 h-3 mr-1 text-teal-400" />
                +1 (555) 349-8200
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-teal-400" />
                Mon–Fri: 7:00 AM – 7:00 PM
              </span>
            </div>
          </div>

          {/* Clinical Specialties Offered */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Core Physiotherapy Consultation Programs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(consultationTypesLabels).map(([key, item]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.label}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-teal-50 text-teal-700">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Therapists on Duty */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center">
              <UserCheck className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Lead Clinical Therapists
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {physiotherapists.map((pt) => (
                <div key={pt.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="font-bold text-slate-900">{pt.name}</div>
                  <div className="text-[11px] text-teal-700 font-medium">{pt.specialty}</div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex justify-between">
                    <span>{pt.experience}</span>
                    <span className="text-emerald-700 font-semibold">{pt.nextAvailable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            All appointments booked by CallPilot AI remain tentative until reviewed by the clinic coordinator.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
