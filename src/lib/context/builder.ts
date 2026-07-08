import type {
  MissingInfo,
  PatientContext,
  PatientRecord,
  RiskFlag,
} from "../types";

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function buildOneLiner(record: PatientRecord): string {
  const { patient, conditions, medications } = record;
  const age = calculateAge(patient.dateOfBirth);
  const activeProblems = conditions
    .filter((c) => c.status === "active")
    .map((c) => c.name);
  const activeMeds = medications
    .filter((m) => m.status === "active")
    .map((m) => m.name);

  const problemText =
    activeProblems.length > 0
      ? activeProblems.slice(0, 3).join(", ")
      : "no documented active problems";
  const medText =
    activeMeds.length > 0
      ? `${activeMeds.length} active medication(s)`
      : "no active medications documented";

  return `${age}-year-old ${patient.sex} (MRN: ${patient.mrn}) with ${problemText}; ${medText}.`;
}

function buildRiskFlags(record: PatientRecord): RiskFlag[] {
  const flags: RiskFlag[] = [];

  for (const allergy of record.allergies) {
    if (allergy.severity === "severe" || allergy.severity === "moderate") {
      flags.push({
        level: allergy.severity === "severe" ? "high" : "medium",
        label: `${allergy.severity} allergy: ${allergy.substance}`,
        rationale: `Documented reaction: ${allergy.reaction}`,
        evidenceRefIds: allergy.sourceRef ? [allergy.sourceRef] : [],
      });
    }
  }

  const bpObs = record.observations.find(
    (o) =>
      o.code === "8480-6" ||
      o.display.toLowerCase().includes("blood pressure") ||
      o.display.toLowerCase().includes("systolic")
  );
  if (bpObs) {
    const systolic = parseInt(bpObs.value, 10);
    if (!isNaN(systolic) && systolic >= 140) {
      flags.push({
        level: systolic >= 160 ? "high" : "medium",
        label: "Elevated blood pressure",
        rationale: `Most recent BP reading: ${bpObs.value}${bpObs.unit ? " " + bpObs.unit : ""}`,
        evidenceRefIds: bpObs.sourceRef ? [bpObs.sourceRef] : [],
      });
    }
  }

  const glucoseObs = record.observations.find(
    (o) =>
      o.code === "2339-0" ||
      o.display.toLowerCase().includes("glucose") ||
      o.display.toLowerCase().includes("hba1c")
  );
  if (glucoseObs) {
    const val = parseFloat(glucoseObs.value);
    if (
      !isNaN(val) &&
      (glucoseObs.display.toLowerCase().includes("hba1c")
        ? val >= 7.0
        : val >= 126)
    ) {
      flags.push({
        level: val >= 8.0 || val >= 180 ? "high" : "medium",
        label: "Diabetes-related lab concern",
        rationale: `${glucoseObs.display}: ${glucoseObs.value}${glucoseObs.unit ? " " + glucoseObs.unit : ""}`,
        evidenceRefIds: glucoseObs.sourceRef ? [glucoseObs.sourceRef] : [],
      });
    }
  }

  const activeConditions = record.conditions.filter((c) => c.status === "active");
  if (activeConditions.length >= 3) {
    flags.push({
      level: "medium",
      label: "Multimorbidity",
      rationale: `${activeConditions.length} active conditions documented`,
      evidenceRefIds: activeConditions
        .map((c) => c.sourceRef)
        .filter((r): r is string => !!r),
    });
  }

  if (record.allergies.length === 0) {
    flags.push({
      level: "low",
      label: "Allergy status not verified",
      rationale: "No allergies documented — confirm with patient",
      evidenceRefIds: [],
    });
  }

  return flags;
}

function buildMissingInformation(record: PatientRecord): MissingInfo[] {
  const missing: MissingInfo[] = [];

  if (record.conditions.filter((c) => c.status === "active").length === 0) {
    missing.push({
      field: "active_problems",
      description: "No active problems documented",
    });
  }

  if (record.medications.filter((m) => m.status === "active").length === 0) {
    missing.push({
      field: "medications",
      description: "No active medications documented",
    });
  }

  if (record.allergies.length === 0) {
    missing.push({
      field: "allergies",
      description: "Allergy status unknown — not documented as NKDA",
    });
  }

  const recentVitals = record.observations.filter((o) => o.type === "vital");
  if (recentVitals.length === 0) {
    missing.push({
      field: "vitals",
      description: "No recent vital signs on record",
    });
  }

  const recentLabs = record.observations.filter((o) => o.type === "lab");
  if (recentLabs.length === 0) {
    missing.push({
      field: "labs",
      description: "No recent laboratory results on record",
    });
  }

  const hasCarePlan = record.observations.some(
    (o) =>
      o.display.toLowerCase().includes("care plan") ||
      o.display.toLowerCase().includes("follow-up")
  );
  if (!hasCarePlan) {
    missing.push({
      field: "care_plan",
      description: "No documented follow-up or care plan",
    });
  }

  return missing;
}

export function buildPatientContext(record: PatientRecord): PatientContext {
  const now = new Date().toISOString();
  const activeConditions = record.conditions.filter((c) => c.status === "active");
  const activeMedications = record.medications.filter((m) => m.status === "active");

  const relevantObservations = record.observations
    .filter((o) => o.type === "vital" || o.type === "lab" || o.type === "note")
    .slice(0, 10);

  return {
    patientId: record.patient.id,
    generatedAt: now,
    oneLiner: buildOneLiner(record),
    activeProblems: activeConditions.map((c) => ({
      name: c.name,
      status: c.status,
      onsetDate: c.onsetDate,
      evidenceRefIds: c.sourceRef ? [c.sourceRef] : [],
    })),
    currentMedications: activeMedications.map((m) => ({
      name: m.name,
      dose: m.dose,
      frequency: m.frequency,
      route: m.route,
      evidenceRefIds: m.sourceRef ? [m.sourceRef] : [],
    })),
    allergies: record.allergies.map((a) => ({
      substance: a.substance,
      reaction: a.reaction,
      severity: a.severity,
      evidenceRefIds: a.sourceRef ? [a.sourceRef] : [],
    })),
    relevantObservations: relevantObservations.map((o) => ({
      display: o.display,
      value: o.value,
      unit: o.unit,
      recordedAt: o.recordedAt,
      type: o.type,
      evidenceRefIds: o.sourceRef ? [o.sourceRef] : [],
    })),
    riskFlags: buildRiskFlags(record),
    missingInformation: buildMissingInformation(record),
    evidenceReferences: record.evidenceSources,
    limitations: [
      "Context is derived from synthetic/mock data only — not suitable for clinical decisions.",
      "Context reflects only data present in this system at generation time.",
      "Agent outputs are drafts for clinician review and must not be treated as diagnoses or treatment plans.",
      "No external EHR, imaging, or real-time monitoring data is included.",
    ],
  };
}
