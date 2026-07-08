export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "male" | "female" | "other" | "unknown";
  createdAt: string;
  updatedAt: string;
}

export interface Condition {
  id: string;
  patientId: string;
  name: string;
  status: "active" | "resolved" | "inactive";
  onsetDate: string | null;
  notes: string | null;
  sourceRef: string | null;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  status: "active" | "stopped" | "on-hold";
  startDate: string | null;
  sourceRef: string | null;
}

export interface Allergy {
  id: string;
  patientId: string;
  substance: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe" | "unknown";
  sourceRef: string | null;
}

export interface Observation {
  id: string;
  patientId: string;
  type: "vital" | "lab" | "note" | "other";
  code: string;
  display: string;
  value: string;
  unit: string | null;
  recordedAt: string;
  sourceRef: string | null;
}

export interface EvidenceSource {
  id: string;
  patientId: string;
  sourceType: "ehr_record" | "lab_report" | "clinical_note" | "patient_reported" | "derived";
  label: string;
  recordedAt: string;
  detail: string | null;
}

export interface PatientRecord {
  patient: Patient;
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  observations: Observation[];
  evidenceSources: EvidenceSource[];
}

export interface ContextProblem {
  name: string;
  status: string;
  onsetDate: string | null;
  evidenceRefIds: string[];
}

export interface ContextMedication {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  evidenceRefIds: string[];
}

export interface ContextAllergy {
  substance: string;
  reaction: string;
  severity: string;
  evidenceRefIds: string[];
}

export interface ContextObservation {
  display: string;
  value: string;
  unit: string | null;
  recordedAt: string;
  type: string;
  evidenceRefIds: string[];
}

export interface RiskFlag {
  level: "high" | "medium" | "low";
  label: string;
  rationale: string;
  evidenceRefIds: string[];
}

export interface MissingInfo {
  field: string;
  description: string;
}

export interface PatientContext {
  patientId: string;
  generatedAt: string;
  oneLiner: string;
  activeProblems: ContextProblem[];
  currentMedications: ContextMedication[];
  allergies: ContextAllergy[];
  relevantObservations: ContextObservation[];
  riskFlags: RiskFlag[];
  missingInformation: MissingInfo[];
  evidenceReferences: EvidenceSource[];
  limitations: string[];
}

export interface AgentStep {
  step: number;
  action: string;
  detail: string;
}

export interface AgentResponse {
  id: string;
  patientId: string;
  taskRequested: string;
  patientContextUsed: PatientContext;
  steps: AgentStep[];
  draftOutput: string;
  evidenceRefIds: string[];
  missingInformation: MissingInfo[];
  uncertaintyNotes: string[];
  rejected: boolean;
  rejectionReason: string | null;
  clinicianReviewNotice: string;
  createdAt: string;
}

export interface AgentMessage {
  id: string;
  patientId: string;
  role: "user" | "assistant";
  content: string;
  agentResponse: AgentResponse | null;
  createdAt: string;
}

export interface SavedDraft {
  id: string;
  patientId: string;
  title: string;
  content: string;
  taskRequested: string;
  evidenceRefIds: string[];
  agentMessageId: string | null;
  createdAt: string;
}

export interface CreatePatientInput {
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Patient["sex"];
  conditions?: Omit<Condition, "id" | "patientId">[];
  medications?: Omit<Medication, "id" | "patientId">[];
  allergies?: Omit<Allergy, "id" | "patientId">[];
  observations?: Omit<Observation, "id" | "patientId">[];
}

export type SupportedTask =
  | "handover_summary"
  | "risk_flags"
  | "missing_information"
  | "new_clinician_summary";

export const SUPPORTED_TASK_PROMPTS: Record<SupportedTask, string> = {
  handover_summary: "Prepare a handover summary for this patient.",
  risk_flags: "What are the key risk flags?",
  missing_information: "What information is missing?",
  new_clinician_summary:
    "Summarize this patient for a new clinician taking over care.",
};
