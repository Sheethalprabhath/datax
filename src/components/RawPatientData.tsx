import type { PatientRecord } from "@/lib/types";

export function RawPatientData({ record }: { record: PatientRecord }) {
  const { patient, conditions, medications, allergies, observations, evidenceSources } =
    record;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <DataField label="MRN" value={patient.mrn} />
        <DataField label="Date of Birth" value={patient.dateOfBirth} />
        <DataField label="First Name" value={patient.firstName} />
        <DataField label="Last Name" value={patient.lastName} />
        <DataField label="Sex" value={patient.sex} />
        <DataField
          label="Created"
          value={new Date(patient.createdAt).toLocaleString()}
        />
      </div>

      <SubSection title={`Conditions (${conditions.length})`}>
        {conditions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {conditions.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{c.name}</span>
                  <StatusBadge status={c.status} />
                </div>
                {c.onsetDate && (
                  <p className="mt-1 text-slate-500">Onset: {c.onsetDate}</p>
                )}
                {c.notes && <p className="mt-1 text-slate-600">{c.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </SubSection>

      <SubSection title={`Medications (${medications.length})`}>
        {medications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {medications.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.name}</span>
                  <StatusBadge status={m.status} />
                </div>
                <p className="mt-1 text-slate-600">
                  {m.dose} · {m.frequency} · {m.route}
                </p>
              </div>
            ))}
          </div>
        )}
      </SubSection>

      <SubSection title={`Allergies (${allergies.length})`}>
        {allergies.length === 0 ? (
          <EmptyState text="No allergies documented" />
        ) : (
          <div className="space-y-2">
            {allergies.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{a.substance}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <p className="mt-1 text-slate-600">Reaction: {a.reaction}</p>
              </div>
            ))}
          </div>
        )}
      </SubSection>

      <SubSection title={`Observations (${observations.length})`}>
        {observations.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {observations.map((o) => (
              <div
                key={o.id}
                className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{o.display}</span>
                  <span className="badge-info capitalize">{o.type}</span>
                </div>
                <p className="mt-1 text-slate-600">
                  {o.value}
                  {o.unit ? ` ${o.unit}` : ""}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(o.recordedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </SubSection>

      <SubSection title={`Evidence Sources (${evidenceSources.length})`}>
        {evidenceSources.map((e) => (
          <div
            key={e.id}
            className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{e.label}</span>
              <span className="text-xs text-slate-400">{e.id.slice(0, 8)}…</span>
            </div>
            <p className="mt-1 capitalize text-slate-500">
              {e.sourceType.replace("_", " ")}
            </p>
            {e.detail && <p className="mt-1 text-slate-600">{e.detail}</p>}
          </div>
        ))}
      </SubSection>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold text-slate-700">{title}</h4>
      {children}
    </div>
  );
}

function EmptyState({ text = "None documented" }: { text?: string }) {
  return <p className="text-sm text-slate-500">{text}</p>;
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "active"
      ? "badge-active"
      : status === "stopped" || status === "resolved"
        ? "badge-danger"
        : "badge-warning";
  return <span className={cls}>{status}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
  const cls =
    severity === "severe"
      ? "badge-danger"
      : severity === "moderate"
        ? "badge-warning"
        : "badge-info";
  return <span className={cls}>{severity}</span>;
}
