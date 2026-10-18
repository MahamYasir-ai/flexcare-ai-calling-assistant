export type CallStatus = 'idle' | 'initiating' | 'in_progress' | 'completed' | 'failed';

export type CallOutcome = 
  | 'appointment_requested' 
  | 'follow_up_required' 
  | 'info_provided' 
  | 'no_answer' 
  | 'declined';

export type ConsultationType = 
  | 'initial_assessment' 
  | 'sports_injury' 
  | 'post_op_rehab' 
  | 'spine_neck_care' 
  | 'ergonomic_mobility';

export type BookingStatus = 'tentative' | 'confirmed' | 'pending_emr' | 'rescheduled' | 'cancelled';

export interface CallRecord {
  id: string;
  contactName: string;
  phoneNumber: string;
  timestamp: string;
  duration: string;
  consultationType: ConsultationType;
  outcome: CallOutcome;
  summary: string;
  preferredDate: string;
  preferredTime: string;
  painFocus: string;
  assignedTherapist?: string;
  bookingStatus: BookingStatus;
  transcript: TranscriptMessage[];
  complianceScore: number;
}

export interface TranscriptMessage {
  id: string;
  speaker: 'agent' | 'patient';
  text: string;
  timestamp: string;
  intent?: string;
  isComplianceHighlight?: boolean;
  complianceNote?: string;
}

export interface AppointmentDetails {
  patientName: string;
  phoneNumber: string;
  consultationType: ConsultationType;
  preferredDate: string;
  preferredTime: string;
  painFocus: string;
  bookingStatus: BookingStatus;
  assignedTherapist: string;
  urgency: 'routine' | 'moderate' | 'urgent';
  clinicalNotes: string;
  createdTime: string;
  emrSyncStatus: 'synced' | 'pending' | 'review_required';
}

export interface AgentConfig {
  omniAgentId: string;
  telephonyEndpoint: string;
  voicePersona: string;
  speechRate: number;
  temperature: number;
  strictAvailabilityGuardrail: boolean;
  emergencyTriagePrompt: boolean;
  clinicName: string;
  clinicPhone: string;
  clinicAddress: string;
  webhookSecret: string;
}

export interface DashboardStats {
  totalCalls: number;
  completedCalls: number;
  appointmentsBooked: number;
  followUpsRequired: number;
  avgCallDuration: string;
  complianceRate: number;
}
