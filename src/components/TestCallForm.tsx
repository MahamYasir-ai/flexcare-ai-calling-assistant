import React, { useState } from 'react';
import { 
  Phone, 
  User, 
  Calendar, 
  Headphones, 
  Radio, 
  AlertCircle,
  PhoneOff,
  Stethoscope,
  ChevronDown
} from 'lucide-react';
import { ConsultationType, CallStatus } from '../types';
import { consultationTypesLabels } from '../data/mockData';

interface TestCallFormProps {
  onStartCall: (params: {
    name: string;
    phone: string;
    consultationType: ConsultationType;
    preferredSlot: string;
    painNote: string;
    callMode: 'browser_interactive' | 'real_telephony';
  }) => void;
  onEndCall: () => void;
  callStatus: CallStatus;
  isAudioMuted: boolean;
  onToggleAudioMute: () => void;
}

export const TestCallForm: React.FC<TestCallFormProps> = ({
  onStartCall,
  onEndCall,
  callStatus,
  isAudioMuted,
  onToggleAudioMute,
}) => {
  const [name, setName] = useState('Maham Tehreem');
  const [countryCode, setCountryCode] = useState('+92');
  const [phoneNumber, setPhoneNumber] = useState('300 1234567');
  const [consultationType, setConsultationType] = useState<ConsultationType>('initial_assessment');
  const [preferredSlot, setPreferredSlot] = useState('Tuesday morning around 11:00 AM');
  const [painNote, setPainNote] = useState('Lower back stiffness and shoulder strain');
  const [callMode, setCallMode] = useState<'browser_interactive' | 'real_telephony'>('browser_interactive');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isCallActive = callStatus === 'in_progress' || callStatus === 'initiating';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a patient or test contact name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number to test.');
      return;
    }
    setErrorMsg(null);

    onStartCall({
      name: name.trim(),
      phone: `${countryCode} ${phoneNumber.trim()}`,
      consultationType,
      preferredSlot: preferredSlot.trim() || 'Next available weekday',
      painNote: painNote.trim() || 'Physiotherapy consultation',
      callMode,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between h-full">
      {/* Top Header - Aligned to match LiveCallStatusArea */}
      <div>
        <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Phone className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                Initiate Outbound Call
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Configure patient contact details and consultation goal
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
            Input Console
          </span>
        </div>

        <form id="test-call-form" onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Symmetrical 2-Column: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Contact Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isCallActive}
                  placeholder="e.g. Maham Tehreem"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-900 disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl shadow-2xs">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={isCallActive}
                  className="px-3 py-2.5 text-sm font-bold bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="+92">🇵🇰 +92</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isCallActive}
                  placeholder="300 1234567"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-900 disabled:opacity-60 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Consultation Program */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              Physiotherapy Program
            </label>
            <div className="relative">
              <select
                value={consultationType}
                onChange={(e) => setConsultationType(e.target.value as ConsultationType)}
                disabled={isCallActive}
                className="w-full appearance-none px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-900 pr-10 disabled:opacity-60 font-medium"
              >
                {Object.entries(consultationTypesLabels).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({val.duration})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Symmetrical 2-Column: Slot & Pain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Preferred Slot
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  disabled={isCallActive}
                  placeholder="e.g. Tuesday at 11:00 AM"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Injury / Pain Focus
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={painNote}
                  onChange={(e) => setPainNote(e.target.value)}
                  disabled={isCallActive}
                  placeholder="e.g. Lower back pain"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all text-slate-800 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Symmetrical Call Mode Picker */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Audio Routing Mode:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <label 
                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                  callMode === 'browser_interactive' 
                    ? 'bg-teal-50/90 border-teal-600 shadow-2xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="callMode"
                  value="browser_interactive"
                  checked={callMode === 'browser_interactive'}
                  onChange={() => setCallMode('browser_interactive')}
                  disabled={isCallActive}
                  className="mt-0.5 text-teal-600 focus:ring-teal-500"
                />
                <div className="ml-2.5">
                  <div className="font-bold text-slate-900 flex items-center">
                    <Headphones className="w-3.5 h-3.5 mr-1 text-teal-700" />
                    Browser Voice
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                    Audition complete natural speech audio in browser.
                  </p>
                </div>
              </label>

              <label 
                className={`flex items-start p-3 rounded-xl border cursor-pointer transition-all ${
                  callMode === 'real_telephony' 
                    ? 'bg-slate-100 border-slate-600 shadow-2xs' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="callMode"
                  value="real_telephony"
                  checked={callMode === 'real_telephony'}
                  onChange={() => setCallMode('real_telephony')}
                  disabled={isCallActive}
                  className="mt-0.5 text-slate-900 focus:ring-slate-800"
                />
                <div className="ml-2.5">
                  <div className="font-bold text-slate-900 flex items-center">
                    <Radio className="w-3.5 h-3.5 mr-1 text-slate-700" />
                    Omni Dispatch
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-tight">
                    Telephony gateway key <code className="font-mono">0c4466...</code>
                  </p>
                </div>
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-rose-600" />
              {errorMsg}
            </div>
          )}
        </form>
      </div>

      {/* Symmetrical Action Buttons anchored cleanly at the bottom */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3">
        {!isCallActive ? (
          <button
            type="submit"
            form="test-call-form"
            className="flex-1 flex items-center justify-center px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <Phone className="w-5 h-5 mr-2 text-teal-200" />
            <span>Start Outbound Call</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onEndCall}
            className="flex-1 flex items-center justify-center px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            <PhoneOff className="w-5 h-5 mr-2 animate-bounce" />
            <span>End Call</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleAudioMute}
          className={`px-4 py-3.5 rounded-xl border text-sm font-semibold flex items-center transition-colors cursor-pointer shrink-0 ${
            isAudioMuted 
              ? 'bg-rose-50 border-rose-200 text-rose-700' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700'
          }`}
          title={isAudioMuted ? 'Unmute speech audio' : 'Mute speech audio'}
        >
          <Headphones className="w-4 h-4 mr-1.5" />
          <span>{isAudioMuted ? 'Muted' : 'Audio On'}</span>
        </button>
      </div>
    </div>
  );
};
