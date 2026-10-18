import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  CheckCircle2, 
  Stethoscope, 
  Phone 
} from 'lucide-react';
import { AppointmentDetails, BookingStatus } from '../types';
import { consultationTypesLabels } from '../data/mockData';

interface AppointmentDetailsSectionProps {
  appointment: AppointmentDetails;
  onUpdateStatus: (newStatus: BookingStatus) => void;
}

export const AppointmentDetailsSection: React.FC<AppointmentDetailsSectionProps> = ({
  appointment,
  onUpdateStatus,
}) => {
  const [isSyncingEMR, setIsSyncingEMR] = useState(false);
  const emrSynced = appointment.bookingStatus === 'confirmed';

  const handleSyncEMR = () => {
    setIsSyncingEMR(true);
    setTimeout(() => {
      setIsSyncingEMR(false);
      onUpdateStatus('confirmed');
    }, 1200);
  };

  const consultInfo = consultationTypesLabels[appointment.consultationType] || {
    label: 'Physiotherapy Consultation',
    duration: '45 min',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <Calendar className="w-6 h-6 text-teal-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight flex items-center">
              Appointment Triage & Booking Details
              <span className="ml-2.5 text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                REF-FLX-{appointment.phoneNumber.slice(-4)}
              </span>
            </h3>
            <p className="text-sm text-slate-500">
              Captured during voice call • Synchronized with FlexCare EMR
            </p>
          </div>
        </div>

        {/* Booking Status Pill */}
        <div className="flex items-center space-x-2">
          {appointment.bookingStatus === 'tentative' ? (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
              Tentative (Subject to Availability)
            </span>
          ) : (
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
              Confirmed by Clinic EMR
            </span>
          )}
        </div>
      </div>

      {/* Grid of Key Details with Symmetrical Equal-Height Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 items-stretch">
        {/* Patient & Consultation */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Patient Contact
            </span>
            <div className="font-bold text-slate-900 text-base">{appointment.patientName}</div>
            <div className="text-slate-700 font-mono flex items-center mt-1">
              <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {appointment.phoneNumber}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Consultation Program
            </span>
            <div className="font-bold text-slate-900">{consultInfo.label}</div>
            <div className="text-slate-500 text-xs mt-0.5">{consultInfo.duration} • 1-on-1 Clinical Session</div>
          </div>
        </div>

        {/* Date & Time Preferences */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm flex flex-col justify-between h-full">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Preferred Date
            </span>
            <div className="font-bold text-slate-900 text-base flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              {appointment.preferredDate}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Requested Time Window
            </span>
            <div className="font-bold text-teal-800 flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-teal-600" />
              {appointment.preferredTime}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Assigned Physiotherapist
            </span>
            <div className="font-semibold text-slate-800 flex items-center">
              <Stethoscope className="w-4 h-4 mr-2 text-teal-600" />
              {appointment.assignedTherapist}
            </div>
          </div>
        </div>

        {/* Clinical Note & Guardrail Verification */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-sm flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Agent Triage Notes
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Urgency: {appointment.urgency.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200 text-xs">
              "{appointment.clinicalNotes}"
            </p>
          </div>

          {/* Symmetrical, cohesive guardrail box */}
          <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-950 text-xs space-y-1">
            <div className="flex items-center font-bold text-teal-800 text-xs">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-teal-600" />
              Availability Guardrail Active
            </div>
            <p className="text-teal-800/80 text-xs leading-normal">
              Slot remains tentative until confirmed by FlexCare clinical scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div className="flex items-center space-x-2 text-slate-600">
          <span className="font-bold text-slate-800">EMR Schedule Status:</span>
          {emrSynced ? (
            <span className="text-emerald-700 font-bold flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Verified & Synced in FlexCare EMR
            </span>
          ) : (
            <span className="text-amber-800 font-semibold flex items-center">
              <Clock className="w-4 h-4 mr-1 text-amber-600" />
              Pending EMR Slot Confirmation
            </span>
          )}
        </div>

        <div>
          {!emrSynced ? (
            <button
              onClick={handleSyncEMR}
              disabled={isSyncingEMR}
              className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            >
              {isSyncingEMR ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Clinic Calendar...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Confirm & Sync with Clinic EMR
                </>
              )}
            </button>
          ) : (
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              Appointment Confirmed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
