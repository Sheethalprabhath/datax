"use client";

import { useState } from "react";
import type { PatientRecord } from "@/lib/types";
import { getSamplePatientForRecord } from "@/lib/samplePatient";
import { useSidebar } from "@/components/SidebarContext";

function calcAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

const actionBtnStyle = {
  color: "var(--identity-colorscheme-color-primary-action)",
};

export function PatientProfilePanel({ record }: { record: PatientRecord }) {
  const { collapsed } = useSidebar();
  const [expanded, setExpanded] = useState(true);
  const { patient, conditions, medications, allergies, observations } = record;
  const sample = getSamplePatientForRecord(
    patient.mrn,
    patient.firstName,
    patient.lastName
  );

  const labs = observations.filter((o) => o.type === "lab");
  const vitals = observations.filter((o) => o.type === "vital");
  const smokingNote = observations.find(
    (o) =>
      o.display.toLowerCase().includes("smok") ||
      o.display.toLowerCase().includes("tobacco")
  );

  return (
    <aside
      className={`flex shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? "w-80" : "w-[300px]"
      }`}
    >
      <div className="shrink-0 border-b border-slate-100 px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinical-100"
               style={{ color: "var(--identity-colorscheme-color-primary-action)" }}>
            <PersonIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h2>
                <p className="text-xs text-slate-500">
                  Patient since {formatDate(patient.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  title="Add"
                  className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-slate-100"
                  style={actionBtnStyle}
                >
                  <PlusIcon />
                </button>
                <button
                  type="button"
                  title={expanded ? "Collapse" : "Expand"}
                  onClick={() => setExpanded((prev) => !prev)}
                  className="flex h-7 w-7 items-center justify-center rounded transition hover:bg-slate-100"
                  style={actionBtnStyle}
                >
                  <ChevronIcon expanded={expanded} />
                </button>
              </div>
            </div>
            <dl className="mt-2.5 space-y-0.5 text-xs leading-relaxed text-slate-600">
              <div className="flex gap-1">
                <dt className="font-medium text-slate-500">DOB:</dt>
                <dd>
                  {patient.dateOfBirth} (Age: {calcAge(patient.dateOfBirth)}Y)
                </dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-medium text-slate-500">Gender:</dt>
                <dd className="capitalize">{patient.sex}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="font-medium text-slate-500">MRN:</dt>
                <dd>{patient.mrn}</dd>
              </div>
              {sample && (
                <>
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-500">Phone:</dt>
                    <dd>{sample.phone}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-500">Email:</dt>
                    <dd className="truncate">{sample.email}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-500">Address:</dt>
                    <dd>
                      {sample.address.street}, {sample.address.city},{" "}
                      {sample.address.state} {sample.address.zip}
                    </dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-500">Language:</dt>
                    <dd>{sample.language}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt className="font-medium text-slate-500">Physician:</dt>
                    <dd>{sample.primaryPhysician}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="scrollbar-hide flex-1 divide-y divide-slate-100 overflow-y-auto">
          {sample?.emergencyContact && (
            <ProfileSection title="Emergency Contact">
              <div className="text-xs text-slate-600">
                <p className="font-medium text-slate-800">
                  {sample.emergencyContact.name} ({sample.emergencyContact.relationship})
                </p>
                <p>{sample.emergencyContact.phone}</p>
              </div>
            </ProfileSection>
          )}

          <ProfileSection title="Insurance">
            <div className="text-xs text-slate-600">
              {sample?.insurance ? (
                <>
                  <p className="font-medium text-slate-800">
                    {sample.insurance.provider}
                  </p>
                  <p>Policy: {sample.insurance.policyNumber}</p>
                  <span className="badge-active mt-1">
                    {sample.insurance.status.toUpperCase()}
                  </span>
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-800">
                    Shire Mutual Insurance Co.
                  </p>
                  <p>Group: FELLOWSHIP-001</p>
                  <span className="badge-active mt-1">ACTIVE</span>
                </>
              )}
            </div>
          </ProfileSection>

          <ProfileSection title="Allergies">
            {allergies.length === 0 ? (
              <EmptyText />
            ) : (
              <ul className="space-y-2">
                {allergies.map((a) => (
                  <li key={a.id} className="text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-800">{a.substance}</span>
                      <span
                        className={
                          a.severity === "severe" ? "badge-danger" : "badge-warning"
                        }
                      >
                        {a.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-500">{a.reaction}</p>
                  </li>
                ))}
              </ul>
            )}
          </ProfileSection>

          <ProfileSection title="Problems">
            {conditions.length === 0 ? (
              <EmptyText />
            ) : (
              <ul className="space-y-2">
                {conditions.map((c) => (
                  <li key={c.id} className="text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-800">{c.name}</span>
                      <span
                        className={
                          c.status === "active" ? "badge-active" : "badge-info"
                        }
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ProfileSection>

          <ProfileSection title="Medications">
            {medications.length === 0 ? (
              <EmptyText />
            ) : (
              <ul className="space-y-2">
                {medications.map((m) => (
                  <li key={m.id} className="text-xs">
                    <p className="font-medium text-slate-800">{m.name}</p>
                    <p className="text-slate-500">
                      {m.dose} · {m.frequency} · {m.route}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </ProfileSection>

          <ProfileSection title="Labs">
            {labs.length === 0 && !sample?.labs.length ? (
              <EmptyText />
            ) : (
              <ul className="space-y-2">
                {labs.map((l) => (
                  <li key={l.id} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{l.display}</span>
                      <span className="text-slate-600">
                        {l.value}
                        {l.unit ? ` ${l.unit}` : ""}
                      </span>
                    </div>
                  </li>
                ))}
                {labs.length === 0 &&
                  sample?.labs.map((l) => (
                    <li key={l.name} className="text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{l.name}</span>
                        <span className="text-slate-600">{l.value}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </ProfileSection>

          <ProfileSection title="Smoking Status">
            <p className="text-xs text-slate-600">
              {smokingNote
                ? `${smokingNote.value}${smokingNote.unit ? ` ${smokingNote.unit}` : ""}`
                : sample?.socialHistory.smoking ?? "Former smoker — quit 2018"}
            </p>
          </ProfileSection>

          <ProfileSection title="Vitals">
            {vitals.length === 0 && !sample?.vitals ? (
              <EmptyText />
            ) : vitals.length > 0 ? (
              <ul className="space-y-2">
                {vitals.map((v) => (
                  <li key={v.id} className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-800">{v.display}</span>
                      <span className="text-slate-600">
                        {v.value}
                        {v.unit ? ` ${v.unit}` : ""}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              sample?.vitals && (
                <ul className="space-y-1 text-xs text-slate-600">
                  <li className="flex justify-between">
                    <span className="font-medium text-slate-800">Blood Pressure</span>
                    <span>{sample.vitals.bloodPressure}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-slate-800">Pulse</span>
                    <span>{sample.vitals.pulse}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-slate-800">Weight</span>
                    <span>{sample.vitals.weight}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-slate-800">BMI</span>
                    <span>{sample.vitals.bmi}</span>
                  </li>
                </ul>
              )
            )}
          </ProfileSection>

          <ProfileSection title="Pharmacies">
            <div className="text-xs text-slate-600">
              {sample?.pharmacies ? (
                <>
                  <p className="font-medium text-slate-800">{sample.pharmacies.name}</p>
                  <p>{sample.pharmacies.address}</p>
                  <p className="text-slate-500">{sample.pharmacies.status}</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-800">
                    Rivendell Community Pharmacy
                  </p>
                  <p>123 Elven Way, Middle-earth</p>
                  <p className="text-slate-500">Preferred · Active</p>
                </>
              )}
            </div>
          </ProfileSection>
        </div>
      )}
    </aside>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const actionColor = "var(--identity-colorscheme-color-primary-action)";

  return (
    <section className="px-4 py-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span style={{ color: actionColor }}>
            <ChevronDownIcon />
          </span>
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-900">
            {title}
          </h3>
        </div>
        <button
          type="button"
          title="Add"
          className="flex h-5 w-5 items-center justify-center rounded transition hover:bg-slate-100"
          style={{ color: actionColor }}
        >
          <PlusIcon />
        </button>
      </div>
      {children}
    </section>
  );
}

function EmptyText() {
  return <p className="text-xs text-slate-400">None documented</p>;
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
