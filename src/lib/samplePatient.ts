export type SamplePatient = typeof SAMPLE_PATIENT;

export const SAMPLE_PATIENT = {
  mrn: "SYN-10042",

  firstName: "Alex",
  lastName: "Rivera",
  photo: "/patients/alex.jpg",

  dateOfBirth: "1968-03-15",
  age: 57,
  sex: "Male",

  phone: "(555) 123-4567",
  email: "alex.rivera@email.com",

  address: {
    street: "123 Main Street",
    city: "Austin",
    state: "TX",
    zip: "78701",
  },

  language: "English",
  maritalStatus: "Married",
  bloodGroup: "O+",
  primaryPhysician: "Dr. Sarah Johnson",

  insurance: {
    provider: "Blue Cross",
    policyNumber: "BCBS-938475",
    status: "Active",
    expires: "2027-12-31",
  },

  emergencyContact: {
    name: "Maria Rivera",
    relationship: "Spouse",
    phone: "(555) 987-6543",
  },

  allergies: [
    { substance: "Penicillin", reaction: "Skin Rash", severity: "Moderate" },
    { substance: "Peanuts", reaction: "Anaphylaxis", severity: "Severe" },
  ],

  conditions: [
    { name: "Type 2 Diabetes", status: "Active", onsetDate: "2015-06-01" },
    { name: "Hypertension", status: "Active", onsetDate: "2010-02-20" },
    { name: "Hyperlipidemia", status: "Active", onsetDate: "2018-04-15" },
  ],

  medications: [
    {
      name: "Metformin",
      dose: "1000 mg",
      frequency: "Twice Daily",
      route: "Oral",
      status: "Active",
    },
    {
      name: "Lisinopril",
      dose: "10 mg",
      frequency: "Once Daily",
      route: "Oral",
      status: "Active",
    },
    {
      name: "Atorvastatin",
      dose: "20 mg",
      frequency: "Night",
      route: "Oral",
      status: "Active",
    },
  ],

  vitals: {
    height: "178 cm",
    weight: "85 kg",
    bmi: "26.8",
    bloodPressure: "148/92 mmHg",
    pulse: "82 bpm",
    respiratoryRate: "16/min",
    temperature: "98.4°F",
    oxygenSaturation: "98%",
  },

  labs: [
    { name: "HbA1c", value: "7.8%", date: "2025-12-01" },
    { name: "Fasting Glucose", value: "154 mg/dL", date: "2025-12-01" },
    { name: "Creatinine", value: "1.0 mg/dL", date: "2025-12-01" },
    { name: "Total Cholesterol", value: "196 mg/dL", date: "2025-12-01" },
  ],

  immunizations: [
    { vaccine: "COVID-19 Booster", date: "2025-01-14" },
    { vaccine: "Influenza", date: "2025-10-20" },
  ],

  socialHistory: {
    smoking: "Former smoker",
    alcohol: "Occasional",
    occupation: "Software Engineer",
    exercise: "3 days/week",
  },

  pharmacies: {
    name: "Rivendell Community Pharmacy",
    address: "123 Elven Way, Middle-earth",
    status: "Preferred · Active",
  },

  encounters: [
    {
      date: "2025-12-01",
      provider: "Dr. Sarah Johnson",
      reason: "Routine Diabetes Follow-up",
    },
  ],

  notes: [
    {
      title: "Progress Note",
      text: "Blood pressure slightly elevated. Continue medications and review diet.",
    },
  ],
};

export const SAMPLE_PATIENT_2 = {
  mrn: "SYN-10058",
  firstName: "Jordan",
  lastName: "Chen",
  photo: "/patients/jordan.jpg",
  dateOfBirth: "1975-11-22",
  age: 50,
  sex: "Female",
  phone: "(555) 234-5678",
  email: "jordan.chen@email.com",
  address: {
    street: "456 Oak Avenue",
    city: "Portland",
    state: "OR",
    zip: "97201",
  },
  language: "English",
  maritalStatus: "Single",
  bloodGroup: "A+",
  primaryPhysician: "Dr. Michael Torres",
  insurance: {
    provider: "Aetna",
    policyNumber: "AET-284719",
    status: "Active",
    expires: "2026-08-31",
  },
  emergencyContact: {
    name: "Lisa Chen",
    relationship: "Sister",
    phone: "(555) 876-5432",
  },
  allergies: [
    { substance: "Sulfonamides", reaction: "Stevens-Johnson syndrome", severity: "Severe" },
    { substance: "Latex", reaction: "Contact dermatitis", severity: "Mild" },
  ],
  conditions: [
    { name: "Heart Failure", status: "Active", onsetDate: "2022-01-10" },
    { name: "Atrial Fibrillation", status: "Active", onsetDate: "2020-05-15" },
    { name: "Chronic Kidney Disease Stage 3", status: "Active", onsetDate: "2021-08-01" },
  ],
  medications: [
    { name: "Furosemide", dose: "40 mg", frequency: "Once Daily", route: "Oral", status: "Active" },
    { name: "Apixaban", dose: "5 mg", frequency: "Twice Daily", route: "Oral", status: "Active" },
    { name: "Carvedilol", dose: "12.5 mg", frequency: "Twice Daily", route: "Oral", status: "Active" },
  ],
  vitals: {
    height: "165 cm",
    weight: "72 kg",
    bmi: "26.4",
    bloodPressure: "132/88 mmHg",
    pulse: "88 bpm",
    respiratoryRate: "18/min",
    temperature: "98.1°F",
    oxygenSaturation: "96%",
  },
  labs: [
    { name: "eGFR", value: "42 mL/min/1.73m2", date: "2025-12-01" },
    { name: "Creatinine", value: "1.6 mg/dL", date: "2025-12-01" },
    { name: "BNP", value: "450 pg/mL", date: "2025-12-01" },
    { name: "Potassium", value: "4.2 mEq/L", date: "2025-12-01" },
  ],
  immunizations: [
    { vaccine: "Pneumococcal", date: "2024-03-10" },
    { vaccine: "Influenza", date: "2025-10-15" },
  ],
  socialHistory: {
    smoking: "Never smoker",
    alcohol: "None",
    occupation: "Teacher",
    exercise: "Light walking",
  },
  pharmacies: {
    name: "Portland Care Pharmacy",
    address: "789 Health Blvd, Portland, OR",
    status: "Preferred · Active",
  },
  encounters: [
    { date: "2025-12-01", provider: "Dr. Michael Torres", reason: "Heart Failure Follow-up" },
  ],
  notes: [
    { title: "Progress Note", text: "NYHA class III symptoms. Weight up 3kg. Adjust diuretic dose." },
  ],
};

export const SAMPLE_PATIENT_3 = {
  mrn: "SYN-10073",
  firstName: "Maria",
  lastName: "Santos",
  photo: "/patients/maria.jpg",
  dateOfBirth: "1982-07-08",
  age: 43,
  sex: "Female",
  phone: "(555) 345-6789",
  email: "maria.santos@email.com",
  address: {
    street: "789 Pine Street",
    city: "Miami",
    state: "FL",
    zip: "33101",
  },
  language: "Spanish",
  maritalStatus: "Married",
  bloodGroup: "B+",
  primaryPhysician: "Dr. Elena Rodriguez",
  insurance: {
    provider: "UnitedHealthcare",
    policyNumber: "UHC-551203",
    status: "Active",
    expires: "2027-06-30",
  },
  emergencyContact: {
    name: "Carlos Santos",
    relationship: "Spouse",
    phone: "(555) 765-4321",
  },
  allergies: [
    { substance: "Aspirin", reaction: "GI bleeding", severity: "Moderate" },
    { substance: "Shellfish", reaction: "Hives", severity: "Moderate" },
  ],
  conditions: [
    { name: "Asthma", status: "Active", onsetDate: "2005-03-12" },
    { name: "Anxiety Disorder", status: "Active", onsetDate: "2019-09-01" },
    { name: "Migraine", status: "Active", onsetDate: "2012-11-20" },
  ],
  medications: [
    { name: "Fluticasone/Salmeterol", dose: "250/50 mcg", frequency: "Twice Daily", route: "Inhalation", status: "Active" },
    { name: "Albuterol", dose: "90 mcg", frequency: "As Needed", route: "Inhalation", status: "Active" },
    { name: "Sertraline", dose: "50 mg", frequency: "Once Daily", route: "Oral", status: "Active" },
  ],
  vitals: {
    height: "160 cm",
    weight: "62 kg",
    bmi: "24.2",
    bloodPressure: "118/76 mmHg",
    pulse: "72 bpm",
    respiratoryRate: "16/min",
    temperature: "98.6°F",
    oxygenSaturation: "99%",
  },
  labs: [
    { name: "Peak Flow", value: "380 L/min", date: "2025-12-01" },
    { name: "Eosinophils", value: "4.2%", date: "2025-12-01" },
    { name: "IgE Total", value: "220 IU/mL", date: "2025-12-01" },
  ],
  immunizations: [
    { vaccine: "COVID-19 Booster", date: "2025-02-20" },
    { vaccine: "Tdap", date: "2023-05-15" },
  ],
  socialHistory: {
    smoking: "Never smoker",
    alcohol: "Social",
    occupation: "Nurse",
    exercise: "4 days/week",
  },
  pharmacies: {
    name: "Miami Health Pharmacy",
    address: "321 Ocean Drive, Miami, FL",
    status: "Preferred · Active",
  },
  encounters: [
    { date: "2025-12-01", provider: "Dr. Elena Rodriguez", reason: "Asthma Control Review" },
  ],
  notes: [
    { title: "Progress Note", text: "Well controlled on current regimen. No exacerbations in 6 months." },
  ],
};

export const SAMPLE_PATIENT_4 = {
  mrn: "SYN-10091",
  firstName: "James",
  lastName: "Okonkwo",
  photo: "/patients/james.jpg",
  dateOfBirth: "1955-04-19",
  age: 70,
  sex: "Male",
  phone: "(555) 456-7890",
  email: "james.okonkwo@email.com",
  address: {
    street: "321 Elm Court",
    city: "Chicago",
    state: "IL",
    zip: "60601",
  },
  language: "English",
  maritalStatus: "Widowed",
  bloodGroup: "AB+",
  primaryPhysician: "Dr. Robert Kim",
  insurance: {
    provider: "Medicare Advantage",
    policyNumber: "MA-7738291",
    status: "Active",
    expires: "2026-12-31",
  },
  emergencyContact: {
    name: "Amara Okonkwo",
    relationship: "Daughter",
    phone: "(555) 654-3210",
  },
  allergies: [
    { substance: "Codeine", reaction: "Respiratory depression", severity: "Severe" },
    { substance: "Iodine contrast", reaction: "Anaphylaxis", severity: "Severe" },
  ],
  conditions: [
    { name: "COPD", status: "Active", onsetDate: "2010-06-15" },
    { name: "Osteoarthritis", status: "Active", onsetDate: "2015-02-28" },
    { name: "Prostate Cancer", status: "Resolved", onsetDate: "2018-11-01" },
  ],
  medications: [
    { name: "Tiotropium", dose: "18 mcg", frequency: "Once Daily", route: "Inhalation", status: "Active" },
    { name: "Prednisone", dose: "5 mg", frequency: "Once Daily", route: "Oral", status: "Active" },
    { name: "Acetaminophen", dose: "650 mg", frequency: "As Needed", route: "Oral", status: "Active" },
  ],
  vitals: {
    height: "175 cm",
    weight: "78 kg",
    bmi: "25.5",
    bloodPressure: "138/84 mmHg",
    pulse: "76 bpm",
    respiratoryRate: "20/min",
    temperature: "98.2°F",
    oxygenSaturation: "93%",
  },
  labs: [
    { name: "FEV1", value: "58% predicted", date: "2025-12-01" },
    { name: "PSA", value: "0.8 ng/mL", date: "2025-12-01" },
    { name: "Hemoglobin", value: "13.2 g/dL", date: "2025-12-01" },
  ],
  immunizations: [
    { vaccine: "Pneumococcal", date: "2023-09-01" },
    { vaccine: "Shingles", date: "2024-01-20" },
  ],
  socialHistory: {
    smoking: "Former smoker — quit 2008",
    alcohol: "None",
    occupation: "Retired Engineer",
    exercise: "Limited mobility",
  },
  pharmacies: {
    name: "Chicago Central Pharmacy",
    address: "555 Michigan Ave, Chicago, IL",
    status: "Preferred · Active",
  },
  encounters: [
    { date: "2025-12-01", provider: "Dr. Robert Kim", reason: "COPD Exacerbation Follow-up" },
  ],
  notes: [
    { title: "Progress Note", text: "Stable on current COPD regimen. Continue pulmonary rehab." },
  ],
};

export const SAMPLE_PATIENTS = [
  SAMPLE_PATIENT,
  SAMPLE_PATIENT_2,
  SAMPLE_PATIENT_3,
  SAMPLE_PATIENT_4,
];

function buildFormDataFromPatient(patient: SamplePatient) {
  const recordedAt = "2025-12-01";
  const sexMap: Record<string, "male" | "female" | "other" | "unknown"> = {
    Male: "male",
    Female: "female",
  };

  return {
    mrn: patient.mrn,
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: patient.dateOfBirth,
    sex: sexMap[patient.sex] ?? ("unknown" as const),
    conditions: patient.conditions.map((c) => ({
      name: c.name,
      status: c.status.toLowerCase() as "active" | "resolved" | "inactive",
      onsetDate: c.onsetDate,
      notes: "",
    })),
    medications: patient.medications.map((m) => ({
      name: m.name,
      dose: m.dose,
      frequency: m.frequency,
      route: m.route.toLowerCase(),
      status: "active" as const,
      startDate: "",
    })),
    allergies: patient.allergies.map((a) => ({
      substance: a.substance,
      reaction: a.reaction,
      severity: a.severity.toLowerCase() as "mild" | "moderate" | "severe" | "unknown",
    })),
    observations: [
      {
        type: "vital" as const,
        code: "8480-6",
        display: "Blood Pressure",
        value: patient.vitals.bloodPressure.replace(" mmHg", ""),
        unit: "mmHg",
        recordedAt,
      },
      {
        type: "vital" as const,
        code: "8867-4",
        display: "Pulse",
        value: patient.vitals.pulse.replace(" bpm", ""),
        unit: "bpm",
        recordedAt,
      },
      {
        type: "vital" as const,
        code: "29463-7",
        display: "Weight",
        value: patient.vitals.weight.replace(" kg", ""),
        unit: "kg",
        recordedAt,
      },
      {
        type: "vital" as const,
        code: "39156-5",
        display: "BMI",
        value: patient.vitals.bmi,
        unit: "kg/m2",
        recordedAt,
      },
      ...patient.labs.slice(0, 4).map((lab, i) => ({
        type: "lab" as const,
        code: `lab-${i}`,
        display: lab.name,
        value: lab.value.replace(/[^\d.]/g, "") || lab.value,
        unit: lab.value.match(/[a-zA-Z/%]+/)?.[0] ?? "",
        recordedAt,
      })),
      {
        type: "note" as const,
        code: "smoking",
        display: "Smoking Status",
        value: patient.socialHistory.smoking,
        unit: "",
        recordedAt,
      },
    ],
  };
}

export function getSamplePatientForRecord(mrn: string, firstName: string, lastName: string) {
  return (
    SAMPLE_PATIENTS.find(
      (p) =>
        p.mrn === mrn ||
        (p.firstName === firstName && p.lastName === lastName)
    ) ?? null
  );
}

export function getSamplePatientFormData() {
  return buildFormDataFromPatient(SAMPLE_PATIENT);
}

export function getRandomSamplePatientFormData() {
  const patient = SAMPLE_PATIENTS[Math.floor(Math.random() * SAMPLE_PATIENTS.length)];
  return buildFormDataFromPatient(patient);
}
