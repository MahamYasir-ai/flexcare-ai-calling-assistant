import { TranscriptMessage, ConsultationType } from '../types';

export interface ScriptTurn {
  agentText: string;
  patientText: string;
  agentComplianceNote?: string;
  extractedField?: {
    field: string;
    value: string;
  };
}

export function generateScriptForContact(
  contactName: string,
  consultationType: ConsultationType,
  preferredSlotHint: string = 'Tuesday morning at 11:00 AM',
  painNote: string = 'stiffness and mobility recovery'
): ScriptTurn[] {
  const name = contactName.trim() || 'there';
  const typeLabels: Record<ConsultationType, string> = {
    initial_assessment: 'initial physical therapy assessment',
    sports_injury: 'sports injury and athletic rehabilitation consultation',
    post_op_rehab: 'post-operative joint mobility therapy session',
    spine_neck_care: 'spine and neck pain consultation',
    ergonomic_mobility: 'workplace ergonomic and mobility screening',
  };

  const therapyDesc = typeLabels[consultationType] || 'physiotherapy consultation';

  return [
    {
      agentText: `Hello ${name}, this is Dr. Sarah calling from FlexCare AI Voice Assistant. I am an automated assistant following up on your inquiry. Are you currently interested in booking an ${therapyDesc}?`,
      patientText: `Hi Sarah! Yes, I was looking to book an appointment. I have been dealing with ${painNote}.`,
      agentComplianceNote: 'AI self-identification and FlexCare clinic affiliation established.',
      extractedField: {
        field: 'Intent',
        value: 'Confirmed interest in consultation',
      },
    },
    {
      agentText: `I understand, and we would be glad to help you address that, ${name}. Our clinical team creates tailored treatment plans to restore your mobility. What days of the week and times generally work best for your schedule?`,
      patientText: `Next ${preferredSlotHint} would be ideal for me if possible.`,
      agentComplianceNote: 'Active listening and clinical triage intake.',
      extractedField: {
        field: 'Preferred Window',
        value: preferredSlotHint,
      },
    },
    {
      agentText: `Thank you, ${name}. I have logged your preferred appointment window for ${preferredSlotHint} for your ${therapyDesc}. Please note: this appointment time is tentative and subject to clinic schedule availability. Our coordinator will review the therapists' calendar and text you a formal confirmation once confirmed. Does that work for you?`,
      patientText: `Yes, that sounds great. I will watch out for the confirmation text.`,
      agentComplianceNote: 'MANDATORY GUARDRAIL: Stated tentative status; zero false confirmation before EMR sync.',
      extractedField: {
        field: 'Status',
        value: 'Tentative (Awaiting Roster Confirmation)',
      },
    },
    {
      agentText: `Wonderful! If you have any sharp pain or sudden swelling before then, please contact our front desk directly at +92 300 1234567. Thank you for choosing FlexCare Physiotherapy, and have a restful day!`,
      patientText: `Thank you Sarah, goodbye!`,
      agentComplianceNote: 'Emergency care guidance and warm closing.',
      extractedField: {
        field: 'Intake Completed',
        value: 'Ready for coordinator review',
      },
    },
  ];
}

// Browser speech synthesis helper that waits until full sentence audio has completed
export function speakSentence(
  text: string,
  rate = 1.0
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      // Calculate realistic reading time if speech synthesis is absent: ~160 words per min
      const wordCount = text.split(' ').length;
      const estimatedMs = Math.max(4000, (wordCount / 160) * 60 * 1000);
      setTimeout(resolve, estimatedMs);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.85, Math.min(1.05, rate));
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        v => v.lang.startsWith('en') && (
          v.name.includes('Natural') || 
          v.name.includes('Samantha') || 
          v.name.includes('Female') || 
          v.name.includes('Google') ||
          v.name.includes('Zira') ||
          v.name.includes('Jenny')
        )
      ) || voices.find(v => v.lang.startsWith('en'));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      let hasFinished = false;
      const finish = () => {
        if (!hasFinished) {
          hasFinished = true;
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Safety timeout: in case browser speechSynthesis gets stuck
      const maxMs = Math.max(6000, (text.split(' ').length / 100) * 60 * 1000);
      const safetyTimer = setTimeout(finish, maxMs);

      utterance.addEventListener('end', () => clearTimeout(safetyTimer));

      window.speechSynthesis.speak(utterance);
    } catch {
      setTimeout(resolve, 4500);
    }
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}
