import type { PatientContext } from "@/lib/types";

export function DerivedContextPanel({ context }: { context: PatientContext }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-clinical-200 bg-clinical-50 p-4">
        <h4 className="text-xs font-semibold uppercase text-clinical-700">
          One-liner
        </h4>
        <p className="mt-2 text-sm font-medium text-clinical-900">
          {context.oneLiner}
        </p>
      </div>

      <ContextList
        title="Active Problems"
        empty="No active problems"
        items={context.activeProblems.map((p) => ({
          label: p.name,
          detail: `${p.status}${p.onsetDate ? " · onset " + p.onsetDate : ""}`,
          refs: p.evidenceRefIds,
        }))}
      />

      <ContextList
        title="Current Medications"
        empty="No active medications"
        items={context.currentMedications.map((m) => ({
          label: m.name,
          detail: `${m.dose} ${m.frequency} (${m.route})`,
          refs: m.evidenceRefIds,
        }))}
      />

      <ContextList
        title="Allergies"
        empty="No allergies documented"
        items={context.allergies.map((a) => ({
          label: a.substance,
          detail: `${a.reaction} — ${a.severity}`,
          refs: a.evidenceRefIds,
        }))}
      />

      <ContextList
        title="Relevant Observations"
        empty="No observations"
        items={context.relevantObservations.map((o) => ({
          label: o.display,
          detail: `${o.value}${o.unit ? " " + o.unit : ""} · ${new Date(o.recordedAt).toLocaleDateString()}`,
          refs: o.evidenceRefIds,
        }))}
      />

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-700">Risk Flags</h4>
        {context.riskFlags.length === 0 ? (
          <p className="text-sm text-slate-500">No risk flags identified</p>
        ) : (
          <div className="space-y-2">
            {context.riskFlags.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg border p-3 text-sm ${
                  r.level === "high"
                    ? "border-red-200 bg-red-50"
                    : r.level === "medium"
                      ? "border-amber-200 bg-amber-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <RiskLevelBadge level={r.level} />
                  <span className="font-medium">{r.label}</span>
                </div>
                <p className="mt-1 text-slate-600">{r.rationale}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-700">
          Missing / Unknown Information
        </h4>
        {context.missingInformation.length === 0 ? (
          <p className="text-sm text-slate-500">No obvious gaps identified</p>
        ) : (
          <ul className="space-y-1 text-sm text-slate-600">
            {context.missingInformation.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>
                  <strong>{m.field}:</strong> {m.description}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-700">
          Limitations
        </h4>
        <ul className="space-y-1 text-sm text-slate-500">
          {context.limitations.map((l, i) => (
            <li key={i}>• {l}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-slate-400">
        Generated: {new Date(context.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}

function ContextList({
  title,
  empty,
  items,
}: {
  title: string;
  empty: string;
  items: { label: string; detail: string; refs: string[] }[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-700">{title}</h4>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{empty}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-slate-600">{item.detail}</div>
              {item.refs.length > 0 && (
                <div className="mt-1 text-xs text-slate-400">
                  Refs: {item.refs.map((r) => r.slice(0, 8)).join(", ")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskLevelBadge({ level }: { level: string }) {
  const cls =
    level === "high"
      ? "badge-danger"
      : level === "medium"
        ? "badge-warning"
        : "badge-info";
  return <span className={cls}>{level}</span>;
}
