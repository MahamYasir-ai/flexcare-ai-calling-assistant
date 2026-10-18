import React, { useEffect, useRef } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Bot, 
  Wifi, 
  PhoneCall, 
  Terminal, 
  RefreshCw, 
  SlidersHorizontal 
} from 'lucide-react';
import { CallStatus, TranscriptMessage } from '../types';

interface LiveCallStatusAreaProps {
  callStatus: CallStatus;
  callDuration: number;
  transcript: TranscriptMessage[];
  currentSpeaker: 'agent' | 'patient' | 'none';
  extractedInfo: {
    intent?: string;
    preferredSlot?: string;
    status?: string;
    painFocus?: string;
  };
  telephonyError: string | null;
  onEndCall: () => void;
  onRetryAsBrowserSim: () => void;
  onOpenSettings: () => void;
  isAudioMuted: boolean;
  onToggleAudioMute: () => void;
  contactName: string;
}

export const LiveCallStatusArea: React.FC<LiveCallStatusAreaProps> = ({
  callStatus,
  callDuration,
  transcript,
  currentSpeaker,
  extractedInfo,
  telephonyError,
  onEndCall,
  onRetryAsBrowserSim,
  onOpenSettings,
  isAudioMuted,
  onToggleAudioMute,
  contactName,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between h-full">
      {/* Top Header - Symmetrically aligned with TestCallForm header */}
      <div>
        <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Terminal className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-lg tracking-tight">
                  Live Call Console
                </h3>
                {callStatus === 'in_progress' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Real-time audio stream, transcript, and clinical triage extraction
              </p>
            </div>
          </div>

          {/* Right Header Status Pill */}
          <div className="flex items-center space-x-2">
            {callStatus === 'idle' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
                Standby
              </span>
            )}
            {callStatus === 'initiating' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping mr-2" />
                Dialing...
              </span>
            )}
            {callStatus === 'in_progress' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse mr-2" />
                In Call ({formatTimer(callDuration)})
              </span>
            )}
            {callStatus === 'completed' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                Completed
              </span>
            )}
            {callStatus === 'failed' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-rose-50 text-rose-800 border border-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 mr-1.5" />
                Alert
              </span>
            )}
          </div>
        </div>

        {/* Console Content Area */}
        <div className="mt-5">
          {/* State 1: IDLE - Symmetrical, clean placeholder */}
          {callStatus === 'idle' && (
            <div className="py-14 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-400 mb-3.5">
                <PhoneCall className="w-8 h-8 text-teal-600/70" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Awaiting Outbound Call Trigger
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Click <strong className="text-teal-700">“Start Outbound Call”</strong> on the left. The live audio stream and synchronized transcript will display here in real time.
              </p>
              <div className="mt-4 inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                <Wifi className="w-3.5 h-3.5 text-teal-600" />
                <span>WebRTC 48kHz Ready</span>
                <span className="text-slate-300">•</span>
                <span>Dr. Sarah Bennett Voice</span>
              </div>
            </div>
          )}

          {/* State 2: INITIATING */}
          {callStatus === 'initiating' && (
            <div className="py-14 px-4 text-center border border-dashed border-teal-200 rounded-2xl bg-teal-50/30">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white shadow-2xs border border-teal-200 flex items-center justify-center text-teal-600 mb-3.5 animate-bounce">
                <Radio className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Connecting Call to {contactName}...
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                Establishing neural speech channel and loading FlexCare consultation intake guidelines.
              </p>
              <div className="flex items-center justify-center space-x-1.5 mt-5">
                {[30, 60, 40, 80, 50, 90, 45, 60, 35].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-teal-500 rounded-full animate-pulse"
                    style={{ height: `${h / 2}px`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* State 3: IN PROGRESS / COMPLETED */}
          {(callStatus === 'in_progress' || callStatus === 'completed') && (
            <div className="space-y-4">
              {/* Speaker Indicator & Dynamic Waveform */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${
                    currentSpeaker === 'agent' 
                      ? 'bg-teal-400 animate-ping' 
                      : currentSpeaker === 'patient' 
                        ? 'bg-emerald-400 animate-ping' 
                        : 'bg-slate-500'
                  }`} />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold tracking-wide">
                      {currentSpeaker === 'agent' && 'AI Agent (Dr. Sarah) is speaking...'}
                      {currentSpeaker === 'patient' && `${contactName} is responding...`}
                      {currentSpeaker === 'none' && (callStatus === 'completed' ? 'Call Finished' : 'Processing audio dialogue...')}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      OmniDimension Neural TTS • Zero False Confirmation Guardrail Active
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 h-6">
                  {[14, 24, 18, 30, 26, 16, 28, 20, 12, 22].map((height, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        currentSpeaker !== 'none' && callStatus === 'in_progress'
                          ? 'bg-teal-400 animate-pulse'
                          : 'bg-slate-700'
                      }`}
                      style={{
                        height: currentSpeaker !== 'none' && callStatus === 'in_progress' ? `${height}px` : '6px',
                        animationDelay: `${idx * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Live Transcript Stream */}
              <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-4">
                <div 
                  ref={scrollRef}
                  className="h-64 overflow-y-auto space-y-3.5 pr-1 text-sm"
                >
                  {transcript.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.speaker === 'agent' ? 'items-start' : 'items-end'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1 text-xs text-slate-500 font-medium">
                        {msg.speaker === 'agent' ? (
                          <>
                            <Bot className="w-3.5 h-3.5 text-teal-600" />
                            <span className="font-bold text-teal-900">Dr. Sarah (AI)</span>
                            <span>• {msg.timestamp}</span>
                          </>
                        ) : (
                          <>
                            <span>{msg.timestamp} •</span>
                            <span className="font-bold text-slate-800">{contactName}</span>
                            <User className="w-3.5 h-3.5 text-slate-600" />
                          </>
                        )}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed ${
                          msg.speaker === 'agent'
                            ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-tl-xs'
                            : 'bg-teal-700 text-white shadow-2xs rounded-tr-xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {msg.isComplianceHighlight && (
                        <div className="mt-1 flex items-center space-x-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{msg.complianceNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* State 4: FAILED */}
          {callStatus === 'failed' && (
            <div className="p-5 bg-rose-50/80 border border-rose-200 rounded-xl text-rose-950 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0 text-rose-700">
                  <AlertTriangle className="w-5 h-5 text-rose-700" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-rose-950">
                    Carrier Route Unavailable
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-800 mt-0.5 leading-normal">
                    {telephonyError || 'Direct cellular telephone carrier is not configured for this destination.'}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-rose-200 text-xs font-mono text-slate-700">
                &gt; OmniDimension Outbound Dispatch: Key 0c4466023c... validated.
                <br />
                &gt; Use Browser Voice mode to audition complete conversation audio immediately.
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={onRetryAsBrowserSim}
                  className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Audition via Browser Voice
                </button>
                <button
                  onClick={onOpenSettings}
                  className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  View Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Symmetrical Bottom Triage Summary Bar */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-2 text-slate-600">
          <span className="font-semibold text-slate-800">Status:</span>
          <span className="font-bold text-teal-800">
            {extractedInfo.status || 'Ready for Triage'}
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>{formatTimer(callDuration)}</span>
        </div>
      </div>
    </div>
  );
};
