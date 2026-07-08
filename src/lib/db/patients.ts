import { v4 as uuidv4 } from "uuid";
import { getStore, rowToAgentMessage, saveStore } from "./json-store";
import { seedDatabase } from "./seed";
import type {
  AgentMessage,
  AgentResponse,
  CreatePatientInput,
  Patient,
  PatientContext,
  PatientRecord,
  SavedDraft,
} from "../types";

function ensureSeeded(): void {
  seedDatabase();
}

export function listPatients(): Patient[] {
  ensureSeeded();
  const store = getStore();
  return [...store.patients].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getPatientRecord(patientId: string): PatientRecord | null {
  ensureSeeded();
  const store = getStore();
  const patient = store.patients.find((p) => p.id === patientId);
  if (!patient) return null;

  return {
    patient,
    conditions: store.conditions
      .filter((c) => c.patientId === patientId)
      .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name)),
    medications: store.medications
      .filter((m) => m.patientId === patientId)
      .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name)),
    allergies: store.allergies
      .filter((a) => a.patientId === patientId)
      .sort((a, b) => {
        const order = { severe: 0, moderate: 1, mild: 2, unknown: 3 };
        return order[a.severity] - order[b.severity];
      }),
    observations: store.observations
      .filter((o) => o.patientId === patientId)
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      ),
    evidenceSources: store.evidenceSources
      .filter((e) => e.patientId === patientId)
      .sort(
        (a, b) =>
          new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
      ),
  };
}

export function createPatient(input: CreatePatientInput): PatientRecord {
  ensureSeeded();
  const store = getStore();
  const now = new Date().toISOString();
  const patientId = uuidv4();
  const evidenceId = uuidv4();

  store.patients.push({
    id: patientId,
    mrn: input.mrn,
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: input.dateOfBirth,
    sex: input.sex,
    createdAt: now,
    updatedAt: now,
  });

  store.evidenceSources.push({
    id: evidenceId,
    patientId,
    sourceType: "ehr_record",
    label: "Initial intake record",
    recordedAt: now,
    detail: "Synthetic patient created via DataX intake form",
  });

  for (const c of input.conditions || []) {
    store.conditions.push({
      id: uuidv4(),
      patientId,
      name: c.name,
      status: c.status,
      onsetDate: c.onsetDate,
      notes: c.notes,
      sourceRef: c.sourceRef || evidenceId,
    });
  }

  for (const m of input.medications || []) {
    store.medications.push({
      id: uuidv4(),
      patientId,
      name: m.name,
      dose: m.dose,
      frequency: m.frequency,
      route: m.route,
      status: m.status,
      startDate: m.startDate,
      sourceRef: m.sourceRef || evidenceId,
    });
  }

  for (const a of input.allergies || []) {
    store.allergies.push({
      id: uuidv4(),
      patientId,
      substance: a.substance,
      reaction: a.reaction,
      severity: a.severity,
      sourceRef: a.sourceRef || evidenceId,
    });
  }

  for (const o of input.observations || []) {
    store.observations.push({
      id: uuidv4(),
      patientId,
      type: o.type,
      code: o.code,
      display: o.display,
      value: o.value,
      unit: o.unit,
      recordedAt: o.recordedAt,
      sourceRef: o.sourceRef || evidenceId,
    });
  }

  saveStore();

  const record = getPatientRecord(patientId);
  if (!record) throw new Error("Failed to create patient");
  return record;
}

export function saveDerivedContext(
  patientId: string,
  context: PatientContext
): void {
  ensureSeeded();
  const store = getStore();
  store.derivedContext = store.derivedContext.filter(
    (row) => row.patientId !== patientId
  );
  store.derivedContext.push({
    id: uuidv4(),
    patientId,
    context,
    generatedAt: context.generatedAt,
  });
  saveStore();
}

export function getLatestDerivedContext(
  patientId: string
): PatientContext | null {
  ensureSeeded();
  const store = getStore();
  const rows = store.derivedContext
    .filter((row) => row.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );

  return rows[0]?.context ?? null;
}

export function saveAgentMessage(
  patientId: string,
  role: "user" | "assistant",
  content: string,
  response: AgentResponse | null
): AgentMessage {
  ensureSeeded();
  const store = getStore();
  const id = uuidv4();
  const now = new Date().toISOString();

  const row = {
    id,
    patientId,
    role,
    content,
    response,
    createdAt: now,
  };

  store.agentMessages.push(row);
  saveStore();

  return rowToAgentMessage(row);
}

export function listAgentMessages(patientId: string): AgentMessage[] {
  ensureSeeded();
  const store = getStore();
  return store.agentMessages
    .filter((m) => m.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .map(rowToAgentMessage);
}

export function saveDraft(
  patientId: string,
  title: string,
  content: string,
  taskRequested: string,
  evidenceRefIds: string[],
  agentMessageId: string | null
): SavedDraft {
  ensureSeeded();
  const store = getStore();
  const id = uuidv4();
  const now = new Date().toISOString();

  const draft: SavedDraft = {
    id,
    patientId,
    title,
    content,
    taskRequested,
    evidenceRefIds,
    agentMessageId,
    createdAt: now,
  };

  store.savedDrafts.push(draft);
  saveStore();
  return draft;
}

export function listDrafts(patientId: string): SavedDraft[] {
  ensureSeeded();
  const store = getStore();
  return store.savedDrafts
    .filter((d) => d.patientId === patientId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getDraft(patientId: string, draftId: string): SavedDraft | null {
  ensureSeeded();
  const store = getStore();
  return (
    store.savedDrafts.find(
      (d) => d.id === draftId && d.patientId === patientId
    ) ?? null
  );
}
