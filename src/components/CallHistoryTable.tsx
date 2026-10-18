import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Eye, 
  HelpCircle,
  PhoneOff, 
  ShieldCheck
} from 'lucide-react';
import { CallRecord, CallOutcome } from '../types';
import { consultationTypesLabels } from '../data/mockData';

interface CallHistoryTableProps {
  calls: CallRecord[];
  onSelectCall: (call: CallRecord) => void;
  onViewTranscript: (call: CallRecord) => void;
  selectedCallId?: string;
}

export const CallHistoryTable: React.FC<CallHistoryTableProps> = ({
  calls,
  onSelectCall,
  onViewTranscript,
  selectedCallId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOutcome, setFilterOutcome] = useState<string>('all');

  const filteredCalls = calls.filter((call) => {
    const matchesSearch = 
      call.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.phoneNumber.includes(searchQuery) ||
      call.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      filterOutcome === 'all' || call.outcome === filterOutcome;

    return matchesSearch && matchesFilter;
  });

  const getOutcomeBadge = (outcome: CallOutcome) => {
    switch (outcome) {
      case 'appointment_requested':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
            Booked (Tentative)
          </span>
        );
      case 'follow_up_required':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
            Follow-Up Needed
          </span>
        );
      case 'info_provided':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Info Provided
          </span>
        );
      case 'no_answer':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <PhoneOff className="w-3.5 h-3.5 mr-1 text-slate-500" />
            No Answer / Retry
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            Declined
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header with Title and Search/Filter */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <History className="w-5 h-5 text-teal-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight">
              Call Logs & Intake History
            </h3>
            <p className="text-sm text-slate-500">
              Recorded outbound patient dials, triage status, and guardrail validation
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search contact, phone, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Outcome Filter */}
          <div className="flex items-center space-x-1.5 text-sm">
            {['all', 'appointment_requested', 'follow_up_required'].map((filterKey) => (
              <button
                key={filterKey}
                onClick={() => setFilterOutcome(filterKey)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  filterOutcome === filterKey
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {filterKey === 'all' && 'All Calls'}
                {filterKey === 'appointment_requested' && 'Booked'}
                {filterKey === 'follow_up_required' && 'Follow-Ups'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Patient Contact</th>
              <th className="px-5 py-3.5">Call Time</th>
              <th className="px-5 py-3.5">Consultation Program</th>
              <th className="px-5 py-3.5">Outcome</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5 hidden md:table-cell">Summary & AI Guardrail</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCalls.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                  No call records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredCalls.map((call) => {
                const isSelected = selectedCallId === call.id;
                const typeLabel = consultationTypesLabels[call.consultationType]?.label || 'Physiotherapy Consult';

                return (
                  <tr
                    key={call.id}
                    onClick={() => onSelectCall(call)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-teal-50/50' : ''
                    }`}
                  >
                    {/* Contact Name & Phone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0">
                          {call.contactName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm flex items-center">
                            {call.contactName}
                            {isSelected && (
                              <span className="ml-2 text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 font-mono text-xs mt-0.5">
                            {call.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Call Time */}
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap text-sm">
                      {call.timestamp}
                    </td>

                    {/* Consultation Type */}
                    <td className="px-5 py-4 text-slate-800">
                      <span className="font-semibold block text-sm">
                        {typeLabel}
                      </span>
                      {call.painFocus && (
                        <span className="text-xs text-teal-700 font-medium truncate block max-w-xs mt-0.5">
                          {call.painFocus}
                        </span>
                      )}
                    </td>

                    {/* Outcome */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {getOutcomeBadge(call.outcome)}
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-slate-600 font-mono text-sm">
                      {call.duration}
                    </td>

                    {/* Summary */}
                    <td className="px-5 py-4 hidden md:table-cell max-w-xs text-slate-600 text-xs">
                      <div className="truncate">
                        {call.summary}
                      </div>
                      <div className="flex items-center text-xs text-emerald-700 mt-1 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                        <span>Guardrail {call.complianceScore}% Verified</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewTranscript(call);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View conversation transcript"
                      >
                        <Eye className="w-4 h-4 mr-1 text-slate-500" />
                        Transcript
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
