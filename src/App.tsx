import React, { useState, useEffect, useRef } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  StatsGrid 
} from './components/StatsGrid';
import { 
  AgentInfoCard 
} from './components/AgentInfoCard';
import { 
  TestCallForm 
} from './components/TestCallForm';
import { 
  LiveCallStatusArea 
} from './components/LiveCallStatusArea';
import { 
  AppointmentDetailsSection 
} from './components/AppointmentDetailsSection';
import { 
  CallHistoryTable 
} from './components/CallHistoryTable';
import { 
  AgentConfigModal 
} from './components/AgentConfigModal';
import { 
  ClinicServicesModal 
} from './components/ClinicServicesModal';
import { 
  ComplianceGuideModal 
} from './components/ComplianceGuideModal';
import { 
  TranscriptModal 
} from './components/TranscriptModal';
import { 
  OmniWidgetController 
} from './components/OmniWidgetController';

import { 
  CallStatus, 
  CallRecord, 
  DashboardStats, 
  AgentConfig, 
  AppointmentDetails, 
  ConsultationType, 
  TranscriptMessage 
} from './types';
import { 
  initialStats, 
  initialCallHistory, 
  defaultAgentConfig, 
  defaultAppointmentDetails,
  consultationTypesLabels
} from './data/mockData';
import { 
  generateScriptForContact, 
  speakSentence, 
  stopSpeaking 
} from './services/voiceAgentSimulator';

export default function App() {
  // State
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [callHistory, setCallHistory] = useState<CallRecord[]>(initialCallHistory);
  const [appointment, setAppointment] = useState<AppointmentDetails>(defaultAppointmentDetails);
  const [agentConfig, setAgentConfig] = useState<AgentConfig>(defaultAgentConfig);

  // Active call state
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [currentTranscript, setCurrentTranscript] = useState<TranscriptMessage[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'agent' | 'patient' | 'none'>('none');
  const [extractedInfo, setExtractedInfo] = useState<{
    intent?: string;
    preferredSlot?: string;
    status?: string;
    painFocus?: string;
  }>({});
  const [telephonyError, setTelephonyError] = useState<string | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [activeContactName, setActiveContactName] = useState<string>('Maham Tehreem');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [transcriptModalCall, setTranscriptModalCall] = useState<CallRecord | null>(null);

  // Refs for managing timers, speech cancellation, and active call loop
  const timerIntervalRef = useRef<any>(null);
  const turnTimeoutsRef = useRef<any[]>([]);
  const isCallActiveRef = useRef<boolean>(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isCallActiveRef.current = false;
      clearInterval(timerIntervalRef.current);
      turnTimeoutsRef.current.forEach((t) => clearTimeout(t));
      stopSpeaking();
    };
  }, []);

  // Duration timer
  useEffect(() => {
    if (callStatus === 'in_progress') {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [callStatus]);

  // Handle End/Hang Up Call
  const handleEndCall = () => {
    isCallActiveRef.current = false;
    stopSpeaking();
    turnTimeoutsRef.current.forEach((t) => clearTimeout(t));
    turnTimeoutsRef.current = [];
    setCurrentSpeaker('none');

    if (callStatus === 'in_progress') {
      setCallStatus('completed');
    } else {
      setCallStatus('idle');
    }
  };

  // Start Test Call Handler
  const handleStartCall = ({
    name,
    phone,
    consultationType,
    preferredSlot,
    painNote,
    callMode,
  }: {
    name: string;
    phone: string;
    consultationType: ConsultationType;
    preferredSlot: string;
    painNote: string;
    callMode: 'browser_interactive' | 'real_telephony';
  }) => {
    // Reset previous call artifacts
    handleEndCall();
    setActiveContactName(name);
    setTelephonyError(null);
    setCurrentTranscript([]);
    setCallDuration(0);
    setExtractedInfo({
      intent: 'Consultation Intake',
      preferredSlot,
      status: 'Tentative (Subject to Availability)',
      painFocus: painNote,
    });

    if (callMode === 'real_telephony') {
      setCallStatus('initiating');
      const errorTimeout = setTimeout(() => {
        setCallStatus('failed');
        setTelephonyError(
          `OmniDimension Telephony Gateway: Outbound carrier route not configured for destination "${phone}". The live voice agent can be tested right now via Browser Voice Call with natural speech audio!`
        );
      }, 1800);
      turnTimeoutsRef.current.push(errorTimeout);
      return;
    }

    // Browser Interactive Audio Mode
    setCallStatus('initiating');
    isCallActiveRef.current = true;

    // Trunk connection handshake
    const initTimeout = setTimeout(() => {
      if (!isCallActiveRef.current) return;
      setCallStatus('in_progress');
      startConversationDialogue(name, phone, consultationType, preferredSlot, painNote);
    }, 1500);

    turnTimeoutsRef.current.push(initTimeout);
  };

  // Turn-by-turn conversational dialogue simulation with complete sentence audio playback
  const startConversationDialogue = async (
    name: string,
    phone: string,
    consultationType: ConsultationType,
    preferredSlot: string,
    painNote: string
  ) => {
    const script = generateScriptForContact(name, consultationType, preferredSlot, painNote);
    const recordedMessages: TranscriptMessage[] = [];

    for (let index = 0; index < script.length; index++) {
      if (!isCallActiveRef.current) return;
      const turn = script[index];

      // Step 1: Agent Turn - Agent speaks full sentence
      setCurrentSpeaker('agent');

      const agentMsg: TranscriptMessage = {
        id: `live-turn-a-${index}-${Date.now()}`,
        speaker: 'agent',
        text: turn.agentText,
        timestamp: `00:${(index * 24 + 4).toString().padStart(2, '0')}`,
        isComplianceHighlight: !!turn.agentComplianceNote,
        complianceNote: turn.agentComplianceNote,
      };

      recordedMessages.push(agentMsg);
      setCurrentTranscript([...recordedMessages]);

      if (turn.extractedField) {
        setExtractedInfo((prev) => ({
          ...prev,
          [turn.extractedField!.field.toLowerCase()]: turn.extractedField!.value,
        }));
      }

      // If audio is on, play the full sentence audio and WAIT until the speech has completely ended!
      if (!isAudioMuted) {
        await speakSentence(turn.agentText, agentConfig.speechRate);
      } else {
        const wordCount = turn.agentText.split(' ').length;
        const readMs = Math.max(5000, (wordCount / 140) * 60 * 1000);
        await new Promise((r) => setTimeout(r, readMs));
      }

      if (!isCallActiveRef.current) return;

      // Step 2: Natural conversational reflection pause after agent finishes speaking
      setCurrentSpeaker('none');
      await new Promise((r) => setTimeout(r, 1600));

      if (!isCallActiveRef.current) return;

      // Step 3: Patient Turn (Maham responds)
      setCurrentSpeaker('patient');
      const patientMsg: TranscriptMessage = {
        id: `live-turn-p-${index}-${Date.now()}`,
        speaker: 'patient',
        text: turn.patientText,
        timestamp: `00:${(index * 24 + 18).toString().padStart(2, '0')}`,
      };

      recordedMessages.push(patientMsg);
      setCurrentTranscript([...recordedMessages]);

      // Ample comfortable reading time for patient reply so it never rushes
      await new Promise((r) => setTimeout(r, 3800));
      setCurrentSpeaker('none');

      if (!isCallActiveRef.current) return;

      // Brief conversational breath pause before agent takes next turn
      if (index < script.length - 1) {
        await new Promise((r) => setTimeout(r, 1400));
      }
    }

    if (!isCallActiveRef.current) return;

    // Call successfully completed
    setCurrentSpeaker('none');
    setCallStatus('completed');
    stopSpeaking();

    // Create new record
    const newRecord: CallRecord = {
      id: `call-${Date.now().toString().slice(-4)}`,
      contactName: name,
      phoneNumber: phone,
      timestamp: 'Just now',
      duration: '1m 58s',
      consultationType,
      outcome: 'appointment_requested',
      summary: `Patient requested consultation for ${painNote}. Preferred slot noted as ${preferredSlot}. Mandatory availability guardrail communicated.`,
      preferredDate: preferredSlot.split('around')[0] || preferredSlot,
      preferredTime: preferredSlot.includes('around') ? preferredSlot.split('around')[1].trim() : '11:00 AM',
      painFocus: painNote,
      assignedTherapist: 'Dr. Marcus Vance, PT, DPT',
      bookingStatus: 'tentative',
      complianceScore: 100,
      transcript: [...recordedMessages],
    };

    setCallHistory((prev) => [newRecord, ...prev]);

    // Update active appointment details
    setAppointment({
      patientName: name,
      phoneNumber: phone,
      consultationType,
      preferredDate: preferredSlot.split('around')[0] || preferredSlot,
      preferredTime: preferredSlot.includes('around') ? preferredSlot.split('around')[1].trim() : '11:00 AM',
      painFocus: painNote,
      bookingStatus: 'tentative',
      assignedTherapist: 'Dr. Marcus Vance, PT, DPT',
      urgency: 'moderate',
      clinicalNotes: `Patient triage complete. Focus: ${painNote}. Stated slot is tentative pending clinic schedule confirmation.`,
      createdTime: 'Just now',
      emrSyncStatus: 'pending',
    });

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalCalls: prev.totalCalls + 1,
      completedCalls: prev.completedCalls + 1,
      appointmentsBooked: prev.appointmentsBooked + 1,
    }));
  };

  // Audio mute toggle
  const handleToggleAudioMute = () => {
    setIsAudioMuted((prev) => {
      const next = !prev;
      if (next) {
        stopSpeaking();
      }
      return next;
    });
  };

  // Select historical call
  const handleSelectCall = (call: CallRecord) => {
    setAppointment({
      patientName: call.contactName,
      phoneNumber: call.phoneNumber,
      consultationType: call.consultationType,
      preferredDate: call.preferredDate,
      preferredTime: call.preferredTime,
      painFocus: call.painFocus,
      bookingStatus: call.bookingStatus,
      assignedTherapist: call.assignedTherapist || 'Dr. Marcus Vance, PT, DPT',
      urgency: 'routine',
      clinicalNotes: call.summary,
      createdTime: call.timestamp,
      emrSyncStatus: call.bookingStatus === 'confirmed' ? 'synced' : 'pending',
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCallActive={callStatus === 'in_progress' || callStatus === 'initiating'}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Row 1: Agent Info Card */}
        <AgentInfoCard
          config={agentConfig}
          callStatus={callStatus}
          onOpenConfig={() => setIsSettingsOpen(true)}
        />

        {/* Row 2: Statistics Cards */}
        <StatsGrid stats={stats} />

        {/* Row 3: Symmetrical 50/50 Dual Calling Console */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left: Outbound Call Input Console */}
          <div className="h-full">
            <TestCallForm
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
              callStatus={callStatus}
              isAudioMuted={isAudioMuted}
              onToggleAudioMute={handleToggleAudioMute}
            />
          </div>

          {/* Right: Live Call Status & Audio Transcript Console */}
          <div className="h-full">
            <LiveCallStatusArea
              callStatus={callStatus}
              callDuration={callDuration}
              transcript={currentTranscript}
              currentSpeaker={currentSpeaker}
              extractedInfo={extractedInfo}
              telephonyError={telephonyError}
              onEndCall={handleEndCall}
              onRetryAsBrowserSim={() => {
                setTelephonyError(null);
                handleStartCall({
                  name: activeContactName,
                  phone: '+92 300 1234567',
                  consultationType: 'initial_assessment',
                  preferredSlot: 'Tuesday morning around 11:00 AM',
                  painNote: 'Lower back stiffness and shoulder strain',
                  callMode: 'browser_interactive',
                });
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              isAudioMuted={isAudioMuted}
              onToggleAudioMute={handleToggleAudioMute}
              contactName={activeContactName}
            />
          </div>
        </div>

        {/* Row 4: Appointment Details Section */}
        <AppointmentDetailsSection
          appointment={appointment}
          onUpdateStatus={(newStatus) => {
            setAppointment((prev) => ({
              ...prev,
              bookingStatus: newStatus,
              emrSyncStatus: newStatus === 'confirmed' ? 'synced' : 'pending',
            }));
          }}
        />

        {/* Row 5: Call History Table */}
        <CallHistoryTable
          calls={callHistory}
          onSelectCall={handleSelectCall}
          onViewTranscript={(call) => setTranscriptModalCall(call)}
          selectedCallId={callHistory.find(c => c.contactName === appointment.patientName)?.id}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">CallPilot AI</span>
            <span>• FlexCare Physiotherapy Healthcare Voice Agent Platform</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsComplianceModalOpen(true)}
              className="hover:text-teal-700 underline font-medium cursor-pointer"
            >
              Guardrail Documentation
            </button>
            <button 
              onClick={() => setIsClinicModalOpen(true)}
              className="hover:text-teal-700 underline font-medium cursor-pointer"
            >
              FlexCare Clinic Profile
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-teal-700 underline font-medium cursor-pointer"
            >
              OmniDimension API Specs
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AgentConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={agentConfig}
        onSaveConfig={(updated) => setAgentConfig(updated)}
      />

      <ClinicServicesModal
        isOpen={isClinicModalOpen}
        onClose={() => setIsClinicModalOpen(false)}
      />

      <ComplianceGuideModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
      />

      <TranscriptModal
        call={transcriptModalCall}
        isOpen={!!transcriptModalCall}
        onClose={() => setTranscriptModalCall(null)}
      />

      {/* OmniDimension Chatbot Controller with Vanish Cross Button and Size Clamp */}
      <OmniWidgetController agentName="FlexCare AI Assistant" />
    </div>
  );
}
