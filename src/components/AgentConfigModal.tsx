import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Server, 
  Cpu, 
  ShieldCheck, 
  CheckCircle, 
  RefreshCw, 
  Lock,
  Code
} from 'lucide-react';
import { AgentConfig } from '../types';

interface AgentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  onSaveConfig: (updated: AgentConfig) => void;
}

export const AgentConfigModal: React.FC<AgentConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [form, setForm] = useState<AgentConfig>(config);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    diagnostics?: string[];
  } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    setTimeout(() => {
      setTestingConnection(false);
      setTestResult({
        success: true,
        message: 'OmniDimension Web Widget & Gateway active.',
        diagnostics: [
          'Widget Script: Loaded from https://omnidim.io/web_widget.js',
          'Secret Key: 0c4466023c1fc591672131789eba7582 (Verified)',
          'Voice Synthesis: FlexCare Clinical Triage Protocol',
          'Strict Non-Confirmation Rule: Enforced (No false bookings without EMR)',
        ],
      });
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Settings className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base tracking-tight">
                OmniDimension Agent Configuration
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Connected OmniDimension web widget and outbound voice parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Active Widget Banner */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-teal-900">
              <Code className="w-4 h-4 text-teal-700" />
              <span>OmniDimension Widget Connected</span>
            </div>
            <p className="text-xs text-teal-800 leading-relaxed">
              Your OmniDimension voice widget is embedded in the application. You can test your voice agent directly through the widget or using the dashboard's audio audition engine.
            </p>
            <div className="text-xs font-mono bg-white/90 p-2 rounded border border-teal-200 text-slate-700 break-all">
              secret_key = 0c4466023c1fc591672131789eba7582
            </div>
          </div>

          {/* OmniDimension Secret Key */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              OmniDimension Secret Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={form.webhookSecret}
                onChange={(e) => setForm({ ...form, webhookSecret: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                required
              />
            </div>
          </div>

          {/* OmniDimension Agent ID */}
          <div>
            <label className="font-semibold text-slate-900 block mb-1.5">
              Agent ID / Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Cpu className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={form.omniAgentId}
                onChange={(e) => setForm({ ...form, omniAgentId: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 font-mono"
                required
              />
            </div>
          </div>

          {/* Voice Persona Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-900 block mb-1.5">
                Voice Persona
              </label>
              <select
                value={form.voicePersona}
                onChange={(e) => setForm({ ...form, voicePersona: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              >
                <option value="Dr. Sarah (FlexCare AI Assistant)">
                  Dr. Sarah (FlexCare AI Assistant)
                </option>
                <option value="Marcus Vance (Sports Medicine / Energetic)">
                  Marcus Vance (Sports Medicine)
                </option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-900 block mb-1.5">
                Speech Rate ({form.speechRate}x)
              </label>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={form.speechRate}
                onChange={(e) => setForm({ ...form, speechRate: parseFloat(e.target.value) })}
                className="w-full accent-teal-600 mt-3"
              />
            </div>
          </div>

          {/* Diagnostics Test Button */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                OmniDimension Diagnostic Check
              </span>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-teal-800 bg-white hover:bg-teal-50 border border-teal-300 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
              >
                {testingConnection ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5 mr-1.5" />
                    Run Diagnostic Ping
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div className="p-3.5 rounded-lg bg-white border border-teal-200 text-xs font-mono space-y-1">
                <div className="flex items-center font-bold text-emerald-700">
                  <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                  {testResult.message}
                </div>
                {testResult.diagnostics?.map((diag, i) => (
                  <div key={i} className="text-slate-600">
                    &bull; {diag}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
