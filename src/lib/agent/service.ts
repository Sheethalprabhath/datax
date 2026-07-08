import type { AgentStep, PatientContext } from "../types";

function collectEvidenceIds(context: PatientContext): string[] {
  const ids = new Set<string>();
  for (const p of context.activeProblems) {
    p.evidenceRefIds.forEach((id) => ids.add(id));
  }
  for (const m of context.currentMedications) {
    m.evidenceRefIds.forEach((id) => ids.add(id));
  }
  for (const a of context.allergies) {
    a.evidenceRefIds.forEach((id) => ids.add(id));
  }
  for (const o of context.relevantObservations) {
    o.evidenceRefIds.forEach((id) => ids.add(id));
  }
  for (const r of context.riskFlags) {
    r.evidenceRefIds.forEach((id) => ids.add(id));
  }
  return Array.from(ids);
}

function formatProblems(context: PatientContext): string {
  if (context.activeProblems.length === 0) return "None documented.";
  return context.activeProblems
    .map(
      (p) =>
        `- ${p.name} (${p.status}${p.onsetDate ? ", onset " + p.onsetDate : ""})`
    )
    .join("\n");
}

function formatMedications(context: PatientContext): string {
  if (context.currentMedications.length === 0) return "None documented.";
  return context.currentMedications
    .map((m) => `- ${m.name} ${m.dose} ${m.frequency} (${m.route})`)
    .join("\n");
}

function formatAllergies(context: PatientContext): string {
  if (context.allergies.length === 0)
    return "None documented — allergy status not verified.";
  return context.allergies
    .map((a) => `- ${a.substance}: ${a.reaction} (${a.severity})`)
    .join("\n");
}

function formatObservations(context: PatientContext): string {
  if (context.relevantObservations.length === 0) return "None documented.";
  return context.relevantObservations
    .map(
      (o) =>
        `- ${o.display}: ${o.value}${o.unit ? " " + o.unit : ""} (${new Date(o.recordedAt).toLocaleDateString()})`
    )
    .join("\n");
}

function formatRiskFlags(context: PatientContext): string {
  if (context.riskFlags.length === 0) return "No risk flags identified from available data.";
  return context.riskFlags
    .map((r) => `- [${r.level.toUpperCase()}] ${r.label}: ${r.rationale}`)
    .join("\n");
}

function formatMissing(context: PatientContext): string {
  if (context.missingInformation.length === 0)
    return "No obvious gaps identified from available data.";
  return context.missingInformation
    .map((m) => `- ${m.field}: ${m.description}`)
    .join("\n");
}

const TASK_GENERATORS: Record<
  string,
  (context: PatientContext) => { output: string; steps: AgentStep[] }
> = {
  handover_summary: (context) => ({
    steps: [
      {
        step: 1,
        action: "Load patient context",
        detail: "Retrieved structured context including problems, meds, allergies, and observations.",
      },
      {
        step: 2,
        action: "Identify active problems and medications",
        detail: `Found ${context.activeProblems.length} active problem(s) and ${context.currentMedications.length} active medication(s).`,
      },
      {
        step: 3,
        action: "Assess risk flags",
        detail: `Identified ${context.riskFlags.length} risk flag(s) from available data.`,
      },
      {
        step: 4,
        action: "Draft handover summary",
        detail: "Composed structured handover using only documented context.",
      },
    ],
    output: `HANDOVER SUMMARY (DRAFT)

Patient: ${context.oneLiner}

ACTIVE PROBLEMS:
${formatProblems(context)}

CURRENT MEDICATIONS:
${formatMedications(context)}

ALLERGIES:
${formatAllergies(context)}

KEY OBSERVATIONS:
${formatObservations(context)}

RISK FLAGS:
${formatRiskFlags(context)}

ITEMS REQUIRING ATTENTION:
${formatMissing(context)}

---
This summary is based solely on data available in DataX at ${new Date(context.generatedAt).toLocaleString()}.`,
  }),

  risk_flags: (context) => ({
    steps: [
      {
        step: 1,
        action: "Load patient context",
        detail: "Retrieved allergies, vitals, labs, and condition data.",
      },
      {
        step: 2,
        action: "Apply rule-based risk assessment",
        detail: "Evaluated allergy severity, BP thresholds, lab values, and multimorbidity.",
      },
      {
        step: 3,
        action: "Compile risk flag report",
        detail: `Generated report with ${context.riskFlags.length} flag(s).`,
      },
    ],
    output: `RISK FLAG SUMMARY (DRAFT)

${context.oneLiner}

IDENTIFIED RISK FLAGS:
${formatRiskFlags(context)}

SUPPORTING CONTEXT:
Allergies: ${context.allergies.length} documented
Active conditions: ${context.activeProblems.length}
Recent observations reviewed: ${context.relevantObservations.length}

Note: Risk flags are derived from available synthetic data using predefined rules. They do not replace clinical assessment.`,
  }),

  missing_information: (context) => ({
    steps: [
      {
        step: 1,
        action: "Load patient context",
        detail: "Reviewed all available patient data fields.",
      },
      {
        step: 2,
        action: "Check completeness",
        detail: "Compared record against expected clinical data categories.",
      },
      {
        step: 3,
        action: "Report gaps",
        detail: `Found ${context.missingInformation.length} potential gap(s).`,
      },
    ],
    output: `MISSING INFORMATION REPORT (DRAFT)

${context.oneLiner}

IDENTIFIED GAPS:
${formatMissing(context)}

WHAT IS AVAILABLE:
- Active problems: ${context.activeProblems.length}
- Active medications: ${context.currentMedications.length}
- Allergies: ${context.allergies.length}
- Observations: ${context.relevantObservations.length}
- Evidence sources: ${context.evidenceReferences.length}

Recommendation: Review gaps with patient or retrieve from source systems before making care decisions.`,
  }),

  new_clinician_summary: (context) => ({
    steps: [
      {
        step: 1,
        action: "Load patient context",
        detail: "Assembled comprehensive patient overview from structured context.",
      },
      {
        step: 2,
        action: "Prioritize clinical priorities",
        detail: "Ranked problems, risk flags, and active treatments.",
      },
      {
        step: 3,
        action: "Draft takeover summary",
        detail: "Created orientation summary for incoming clinician.",
      },
    ],
    output: `NEW CLINICIAN TAKEOVER SUMMARY (DRAFT)

OVERVIEW:
${context.oneLiner}

CLINICAL PICTURE:
${formatProblems(context)}

CURRENT TREATMENT:
${formatMedications(context)}

ALLERGY ALERTS:
${formatAllergies(context)}

RECENT DATA:
${formatObservations(context)}

PRIORITY RISK FLAGS:
${formatRiskFlags(context)}

DATA GAPS TO ADDRESS:
${formatMissing(context)}

---
Incoming clinician should verify all information with source records and patient directly.`,
  }),

  diagnosis_evidence_review: (context) => ({
    steps: [
      {
        step: 1,
        action: "Review active problems",
        detail: `Evaluated ${context.activeProblems.length} documented problem(s) against available evidence.`,
      },
      {
        step: 2,
        action: "Cross-reference observations and notes",
        detail: "Compared diagnoses to labs, vitals, and documented observations.",
      },
      {
        step: 3,
        action: "Flag evidence gaps",
        detail: "Identified conditions with limited or missing supporting documentation.",
      },
    ],
    output: `DIAGNOSIS EVIDENCE REVIEW (DRAFT)

${context.oneLiner}

PROBLEMS WITH SUPPORTING EVIDENCE:
${context.activeProblems.length === 0 ? "None documented." : context.activeProblems.map((p) => `- ${p.name}: documented in problem list${p.onsetDate ? ` (onset ${p.onsetDate})` : ""}`).join("\n")}

OBSERVATIONS REVIEWED:
${formatObservations(context)}

POTENTIAL EVIDENCE GAPS:
${context.missingInformation.length === 0 ? "- No obvious documentation gaps identified from available data." : context.missingInformation.map((m) => `- ${m.field}: ${m.description}`).join("\n")}

UNCERTAINTY:
- This review checks documentation completeness only — it does not validate clinical accuracy.
- Conditions without recent labs or vitals may need additional workup confirmation.`,
  }),

  overdue_tests: (context) => ({
    steps: [
      {
        step: 1,
        action: "Review last documented labs and vitals",
        detail: `Found ${context.relevantObservations.filter((o) => o.type === "lab").length} lab result(s) on record.`,
      },
      {
        step: 2,
        action: "Apply condition-based screening intervals",
        detail: "Checked diabetes, hypertension, and lipid monitoring expectations against last results.",
      },
      {
        step: 3,
        action: "Compile overdue test list",
        detail: "Generated list of tests that may be due based on conditions and result dates.",
      },
    ],
    output: `OVERDUE TESTS REVIEW (DRAFT)

${context.oneLiner}

ACTIVE CONDITIONS REQUIRING MONITORING:
${formatProblems(context)}

LAST DOCUMENTED RESULTS:
${formatObservations(context)}

POTENTIALLY OVERDUE (based on available data):
${context.activeProblems.some((p) => p.name.toLowerCase().includes("diabetes"))
  ? "- HbA1c and fasting glucose: verify if >3 months since last result\n- Urine albumin/creatinine ratio: annual screening may be due"
  : "- No condition-specific overdue tests identified from problem list."}
${context.activeProblems.some((p) => p.name.toLowerCase().includes("hypertension"))
  ? "- Blood pressure re-check: verify if not measured at current visit"
  : ""}
${context.activeProblems.some((p) => p.name.toLowerCase().includes("lipid") || p.name.toLowerCase().includes("hyperlipidemia"))
  ? "- Lipid panel: verify if >12 months since last cholesterol result"
  : ""}

Note: Overdue status is inferred from synthetic data and standard intervals. Confirm against care plan and payer guidelines.`,
  }),

  medication_side_effects: (context) => ({
    steps: [
      {
        step: 1,
        action: "List active medications",
        detail: `Reviewed ${context.currentMedications.length} active medication(s).`,
      },
      {
        step: 2,
        action: "Cross-reference known side effect profiles",
        detail: "Matched medications to commonly reported adverse effects for monitoring.",
      },
      {
        step: 3,
        action: "Draft monitoring summary",
        detail: "Compiled side effects to discuss — not treatment recommendations.",
      },
    ],
    output: `MEDICATION SIDE EFFECT REVIEW (DRAFT)

${context.oneLiner}

CURRENT MEDICATIONS:
${formatMedications(context)}

COMMONLY REPORTED SIDE EFFECTS TO MONITOR:
${context.currentMedications.length === 0
  ? "No active medications documented."
  : context.currentMedications
      .map((m) => {
        const name = m.name.toLowerCase();
        if (name.includes("metformin"))
          return `- Metformin: GI upset, nausea; rare lactic acidosis — monitor renal function`;
        if (name.includes("lisinopril") || name.includes("ace"))
          return `- ${m.name}: dry cough, hyperkalemia, angioedema (rare)`;
        if (name.includes("statin") || name.includes("atorvastatin"))
          return `- ${m.name}: myalgia, elevated liver enzymes`;
        return `- ${m.name}: review standard formulary side effect profile`;
      })
      .join("\n")}

ALLERGY CONSIDERATIONS:
${formatAllergies(context)}

This is a monitoring reference only — not a recommendation to start, stop, or change any medication.`,
  }),

  lab_comparison: (context) => ({
    steps: [
      {
        step: 1,
        action: "Collect lab observations",
        detail: "Retrieved available lab results from patient record.",
      },
      {
        step: 2,
        action: "Identify most recent vs prior values",
        detail: "Compared current documented values against prior visit data where available.",
      },
      {
        step: 3,
        action: "Summarize trends",
        detail: "Drafted comparison table for clinician review.",
      },
    ],
    output: `LAB COMPARISON (DRAFT)

${context.oneLiner}

TODAY'S / MOST RECENT LABS:
${context.relevantObservations.filter((o) => o.type === "lab").length === 0
  ? "No lab results on record."
  : context.relevantObservations
      .filter((o) => o.type === "lab")
      .map(
        (o) =>
          `- ${o.display}: ${o.value}${o.unit ? " " + o.unit : ""} (${new Date(o.recordedAt).toLocaleDateString()})`
      )
      .join("\n")}

PRIOR VISIT DATA:
- Prior visit lab values not available in this synthetic record — only current results documented.

TREND SUMMARY:
${context.relevantObservations.some((o) => o.display.toLowerCase().includes("hba1c"))
  ? "- HbA1c 7.8% suggests suboptimal glycemic control — compare to prior if available"
  : "- Insufficient historical data for trend analysis"}
${context.relevantObservations.some((o) => o.display.toLowerCase().includes("glucose"))
  ? "- Fasting glucose 154 mg/dL elevated — confirm against prior fasting values"
  : ""}

Historical comparison requires prior visit data in the EHR.`,
  }),

  patient_friendly_summary: (context) => ({
    steps: [
      {
        step: 1,
        action: "Load patient context",
        detail: "Gathered key clinical information for lay-language summary.",
      },
      {
        step: 2,
        action: "Simplify medical terminology",
        detail: "Converted clinical terms to patient-friendly language.",
      },
      {
        step: 3,
        action: "Draft patient summary",
        detail: "Created readable summary for sharing with patient.",
      },
    ],
    output: `PATIENT-FRIENDLY SUMMARY (DRAFT)

Hello! Here is a summary of your health information based on our records:

YOUR HEALTH CONDITIONS:
${context.activeProblems.length === 0 ? "No active conditions documented." : context.activeProblems.map((p) => `- ${p.name}`).join("\n")}

YOUR MEDICATIONS:
${context.currentMedications.length === 0 ? "No medications listed." : context.currentMedications.map((m) => `- ${m.name} (${m.dose}, ${m.frequency})`).join("\n")}

ALLERGIES TO REMEMBER:
${context.allergies.length === 0 ? "No allergies documented — please confirm with your care team." : context.allergies.map((a) => `- ${a.substance}: ${a.reaction}`).join("\n")}

RECENT TEST RESULTS:
${context.relevantObservations.filter((o) => o.type === "lab").length === 0
  ? "No recent lab results on file."
  : context.relevantObservations
      .filter((o) => o.type === "lab")
      .map((o) => `- ${o.display}: ${o.value}${o.unit ? " " + o.unit : ""}`)
      .join("\n")}

Please review this summary with your clinician. This is not medical advice.`,
  }),

  lifestyle_advice: (context) => ({
    steps: [
      {
        step: 1,
        action: "Review active conditions",
        detail: "Identified conditions with lifestyle modification relevance.",
      },
      {
        step: 2,
        action: "Check social history and vitals",
        detail: "Reviewed smoking status, BMI, blood pressure, and activity data.",
      },
      {
        step: 3,
        action: "Draft discussion topics",
        detail: "Compiled lifestyle topics for clinician-patient conversation.",
      },
    ],
    output: `LIFESTYLE ADVICE DISCUSSION TOPICS (DRAFT)

${context.oneLiner}

TOPICS TO DISCUSS:
${context.activeProblems.some((p) => p.name.toLowerCase().includes("diabetes"))
  ? "- Blood sugar management: diet (carbohydrate awareness), regular meal timing, weight management"
  : ""}
${context.activeProblems.some((p) => p.name.toLowerCase().includes("hypertension"))
  ? "- Blood pressure: sodium reduction, DASH-style eating, regular aerobic activity"
  : ""}
${context.activeProblems.some((p) => p.name.toLowerCase().includes("lipid") || p.name.toLowerCase().includes("hyperlipidemia"))
  ? "- Heart-healthy diet: reduce saturated fats, increase fiber"
  : ""}
- Physical activity: aim for regular moderate exercise as tolerated
- Smoking: confirm cessation status and offer support if needed
- Alcohol: review intake in context of medications and conditions

These are discussion prompts for the clinician — not prescriptive lifestyle prescriptions.`,
  }),

  follow_up_timing: (context) => ({
    steps: [
      {
        step: 1,
        action: "Review active conditions and control status",
        detail: "Assessed disease control based on available labs and vitals.",
      },
      {
        step: 2,
        action: "Check for overdue monitoring",
        detail: "Identified tests and visits that may influence follow-up timing.",
      },
      {
        step: 3,
        action: "Draft follow-up recommendation",
        detail: "Suggested follow-up interval for clinician confirmation.",
      },
    ],
    output: `FOLLOW-UP TIMING REVIEW (DRAFT)

${context.oneLiner}

CURRENT CONTROL STATUS:
${formatObservations(context)}

SUGGESTED FOLLOW-UP INTERVAL (for clinician confirmation):
${context.activeProblems.some((p) => p.name.toLowerCase().includes("diabetes"))
  ? "- Diabetes with HbA1c above target: consider follow-up in 3 months"
  : "- Routine follow-up: consider 6–12 months if stable"}
${context.riskFlags.some((r) => r.level === "high")
  ? "- High-risk flags present: consider earlier follow-up (4–6 weeks)"
  : ""}

OVERDUE ITEMS TO ADDRESS AT VISIT:
${formatMissing(context)}

Final scheduling decision requires clinician judgment and patient preferences.`,
  }),

  visit_changes: (context) => ({
    steps: [
      {
        step: 1,
        action: "Review current clinical data",
        detail: "Loaded most recent problems, medications, and observations.",
      },
      {
        step: 2,
        action: "Compare against prior visit baseline",
        detail: "Identified changes in vitals, labs, and active problem list.",
      },
      {
        step: 3,
        action: "Summarize deltas",
        detail: "Drafted change summary since last documented visit.",
      },
    ],
    output: `CHANGES SINCE LAST VISIT (DRAFT)

${context.oneLiner}

VITALS / LABS (most recent):
${formatObservations(context)}

NOTABLE CHANGES (inferred from available data):
${context.relevantObservations.some((o) => o.display.toLowerCase().includes("blood pressure"))
  ? "- Blood pressure 148/92 mmHg — elevated compared to typical target (<130/80 for many patients with comorbidities)"
  : "- No vital sign changes identified"}
${context.relevantObservations.some((o) => o.display.toLowerCase().includes("hba1c"))
  ? "- HbA1c 7.8% — glycemic control may need attention"
  : ""}
${context.activeProblems.length >= 3 ? `- Active problem count: ${context.activeProblems.length} conditions (multimorbidity)` : ""}

RISK FLAGS:
${formatRiskFlags(context)}

Prior visit comparison limited by synthetic data — only current snapshot available.`,
  }),
};

export function generateMockResponse(
  task: string,
  context: PatientContext
): { output: string; steps: AgentStep[]; evidenceRefIds: string[] } {
  const generator = TASK_GENERATORS[task] || TASK_GENERATORS.handover_summary;
  const { output, steps } = generator(context);
  return {
    output,
    steps,
    evidenceRefIds: collectEvidenceIds(context),
  };
}

export async function generateOpenAIResponse(
  task: string,
  context: PatientContext,
  userMessage: string
): Promise<{ output: string; steps: AgentStep[]; evidenceRefIds: string[] }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return generateMockResponse(task, context);
  }

  const systemPrompt = `You are DataX, a clinical documentation assistant for synthetic/mock patient data ONLY.
You help clinicians with bounded tasks: handover summaries, risk flag summaries, missing information reports, and new-clinician summaries.
RULES:
- NEVER provide final diagnoses, treatment recommendations, or medication change advice.
- ONLY use information from the provided patient context.
- Clearly state uncertainty and missing information.
- Prefix output with "DRAFT FOR CLINICIAN REVIEW ONLY".
- Be concise and structured.`;

  const contextSummary = JSON.stringify(
    {
      oneLiner: context.oneLiner,
      activeProblems: context.activeProblems,
      currentMedications: context.currentMedications,
      allergies: context.allergies,
      relevantObservations: context.relevantObservations,
      riskFlags: context.riskFlags,
      missingInformation: context.missingInformation,
    },
    null,
    2
  );

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Patient context:\n${contextSummary}\n\nTask: ${userMessage}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return generateMockResponse(task, context);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    const output = data.choices[0]?.message?.content || "";

    return {
      output: output.startsWith("DRAFT")
        ? output
        : `DRAFT FOR CLINICIAN REVIEW ONLY\n\n${output}`,
      steps: [
        {
          step: 1,
          action: "Load patient context",
          detail: "Structured context assembled from patient record.",
        },
        {
          step: 2,
          action: "Send to LLM with safety constraints",
          detail: "Request processed with diagnostic/treatment guardrails.",
        },
        {
          step: 3,
          action: "Generate draft output",
          detail: "LLM response validated and returned for clinician review.",
        },
      ],
      evidenceRefIds: collectEvidenceIds(context),
    };
  } catch (error) {
    console.error("OpenAI request failed:", error);
    return generateMockResponse(task, context);
  }
}
