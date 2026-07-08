import { v4 as uuidv4 } from "uuid";
import { getStore, saveStore } from "./json-store";

export function seedDatabase(): void {
  const store = getStore();
  if (store.patients.length > 0) return;

  const now = new Date().toISOString();
  const patientId = uuidv4();
  const evidenceId = uuidv4();

  store.patients.push({
    id: patientId,
    mrn: "SYN-10001",
    firstName: "Jordan",
    lastName: "Chen",
    dateOfBirth: "1975-11-22",
    sex: "female",
    createdAt: now,
    updatedAt: now,
  });

  store.evidenceSources.push({
    id: evidenceId,
    patientId,
    sourceType: "ehr_record",
    label: "Admission record",
    recordedAt: now,
    detail: "Synthetic seed patient",
  });

  const conditions = [
    ["Heart Failure", "active", "2022-01-10"],
    ["Atrial Fibrillation", "active", "2020-05-15"],
    ["Chronic Kidney Disease Stage 3", "active", "2021-08-01"],
  ] as const;

  for (const [name, status, onset] of conditions) {
    store.conditions.push({
      id: uuidv4(),
      patientId,
      name,
      status,
      onsetDate: onset,
      notes: null,
      sourceRef: evidenceId,
    });
  }

  const medications = [
    ["Furosemide", "40mg", "OD", "oral", "active"],
    ["Apixaban", "5mg", "BD", "oral", "active"],
    ["Carvedilol", "12.5mg", "BD", "oral", "active"],
  ] as const;

  for (const [name, dose, freq, route, status] of medications) {
    store.medications.push({
      id: uuidv4(),
      patientId,
      name,
      dose,
      frequency: freq,
      route,
      status,
      startDate: null,
      sourceRef: evidenceId,
    });
  }

  store.allergies.push({
    id: uuidv4(),
    patientId,
    substance: "Sulfonamides",
    reaction: "Stevens-Johnson syndrome (historical)",
    severity: "severe",
    sourceRef: evidenceId,
  });

  const observations = [
    ["vital", "8480-6", "Systolic Blood Pressure", "132", "mmHg"],
    ["vital", "8867-4", "Heart Rate", "88", "bpm"],
    ["lab", "33914-3", "eGFR", "42", "mL/min/1.73m2"],
    ["lab", "2160-0", "Creatinine", "1.6", "mg/dL"],
    [
      "note",
      "note-adm",
      "Admission note",
      "Admitted for worsening dyspnoea. NYHA class III. Weight up 3kg over 1 week.",
      "",
    ],
  ] as const;

  for (const [type, code, display, value, unit] of observations) {
    store.observations.push({
      id: uuidv4(),
      patientId,
      type,
      code,
      display,
      value,
      unit: unit || null,
      recordedAt: now,
      sourceRef: evidenceId,
    });
  }

  saveStore();
}
