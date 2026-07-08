const UNSUPPORTED_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern:
      /\b(final\s+)?diagnos(e|is|ing)\b|\bwhat\s+(do\s+they\s+have|is\s+wrong)\b/i,
    reason:
      "Final diagnosis requests are out of scope. DataX provides structured context and draft summaries for clinician review — not diagnostic conclusions.",
  },
  {
    pattern:
      /\b(prescribe|start|stop|change|adjust|increase|decrease|switch)\s+(the\s+)?(medication|med|drug|dose|treatment)\b|\bmedication\s+(change|recommendation|advice)\b/i,
    reason:
      "Medication change recommendations are out of scope. Please consult clinical guidelines and make treatment decisions independently.",
  },
  {
    pattern:
      /\b(recommend|suggest|should\s+(take|use|start|stop))\s+(treatment|therapy|medication|drug)\b|\btreatment\s+recommendation\b/i,
    reason:
      "Treatment recommendations are out of scope. DataX can summarize available context but cannot recommend treatments.",
  },
  {
    pattern:
      /\b(dose|dosage)\s+(for|of|recommendation)\b|\bwhat\s+(medication|drug|dose)\s+should\b/i,
    reason:
      "Dosing recommendations are out of scope and require independent clinical judgment.",
  },
];

const SUPPORTED_PATTERNS: { pattern: RegExp; task: string }[] = [
  {
    pattern:
      /\bdiagnos(is|es)\b.*\b(evidence|unsupported|support)\b|\b(evidence|unsupported)\b.*\bdiagnos(is|es)\b/i,
    task: "diagnosis_evidence_review",
  },
  {
    pattern:
      /\b(tests?|screenings?)\b.*\b(overdue|due|missing)\b|\boverdue\b.*\b(tests?|labs?)\b|\bwhat\s+tests?\s+are\s+overdue\b/i,
    task: "overdue_tests",
  },
  {
    pattern:
      /\bmedications?\b.*\b(side\s+effects?|adverse)\b|\bwhich\s+medications?\b.*\b(side\s+effects?|cause)\b/i,
    task: "medication_side_effects",
  },
  {
    pattern:
      /\bcompare\b.*\b(labs?|laboratory|today)\b|\blabs?\b.*\b(previous|prior|compare|today|visits?)\b/i,
    task: "lab_comparison",
  },
  {
    pattern:
      /\bpatient[\-\s]?friendly\s+summary\b|\bcreate\s+a\s+patient[\-\s]?friendly\b/i,
    task: "patient_friendly_summary",
  },
  {
    pattern:
      /\blifestyle\b.*\b(advice|discuss|recommend)\b|\bwhat\s+lifestyle\b/i,
    task: "lifestyle_advice",
  },
  {
    pattern:
      /\b(when\s+should\s+this\s+patient\s+return|next\s+follow[\-\s]?up|return\s+for\s+the\s+next)\b/i,
    task: "follow_up_timing",
  },
  {
    pattern:
      /\bwhat\s+has\s+changed\b|\bchanged\s+since\b.*\b(last\s+visit|patient)\b/i,
    task: "visit_changes",
  },
  {
    pattern: /\bhandover|hand[\-\s]?over|shift\s+report|transfer\s+summary\b/i,
    task: "handover_summary",
  },
  {
    pattern: /\brisk\s+flag|key\s+risk|risk\s+factor|what.*risk\b/i,
    task: "risk_flags",
  },
  {
    pattern: /\bmissing\s+(info|information|data)|what.*missing|gaps?\s+in\b/i,
    task: "missing_information",
  },
  {
    pattern:
      /\bnew\s+clinician|taking\s+over|care\s+transfer|summarize.*patient|patient\s+summary\b/i,
    task: "new_clinician_summary",
  },
  {
    pattern: /\bprepare\s+a\s+handover\s+summary\b/i,
    task: "handover_summary",
  },
];

export interface SafetyCheckResult {
  allowed: boolean;
  task: string | null;
  rejectionReason: string | null;
}

export function checkRequestSafety(message: string): SafetyCheckResult {
  for (const { pattern, task } of SUPPORTED_PATTERNS) {
    if (pattern.test(message)) {
      return { allowed: true, task, rejectionReason: null };
    }
  }

  for (const { pattern, reason } of UNSUPPORTED_PATTERNS) {
    if (pattern.test(message)) {
      return { allowed: false, task: null, rejectionReason: reason };
    }
  }

  return {
    allowed: false,
    task: null,
    rejectionReason:
      "This request is not supported. DataX can help with clinical review tasks such as evidence checks, overdue tests, lab comparisons, patient summaries, and follow-up planning. Please use one of the suggested prompts.",
  };
}

export const CLINICIAN_REVIEW_NOTICE =
  "⚠️ DRAFT FOR CLINICIAN REVIEW ONLY — This output is generated from available synthetic patient context. It is not a diagnosis, treatment plan, or medical advice. Verify all information against source records before use.";

export const SUPPORTED_TASK_SUGGESTIONS = [
  "Is any diagnosis unsupported by evidence?",
  "What tests are overdue?",
  "Which medications may cause side effects?",
  "Compare today's labs with previous visits.",
  "Create a patient-friendly summary.",
  "What lifestyle advice should be discussed?",
  "When should this patient return for the next follow-up appointment?",
  "What has changed since the patient's last visit?",
];
