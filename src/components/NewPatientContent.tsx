"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRandomSamplePatientFormData } from "@/lib/samplePatient";

interface ConditionInput {
  name: string;
  status: "active" | "resolved" | "inactive";
  onsetDate: string;
  notes: string;
}

interface MedicationInput {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  status: "active" | "stopped" | "on-hold";
  startDate: string;
}

interface AllergyInput {
  substance: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe" | "unknown";
}

interface ObservationInput {
  type: "vital" | "lab" | "note" | "other";
  code: string;
  display: string;
  value: string;
  unit: string;
  recordedAt: string;
}

export function NewPatientContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mrn, setMrn] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other" | "unknown">(
    "unknown"
  );
  const [conditions, setConditions] = useState<ConditionInput[]>([]);
  const [medications, setMedications] = useState<MedicationInput[]>([]);
  const [allergies, setAllergies] = useState<AllergyInput[]>([]);
  const [observations, setObservations] = useState<ObservationInput[]>([]);

  function loadSample() {
    const sample = getRandomSamplePatientFormData();
    setMrn(sample.mrn);
    setFirstName(sample.firstName);
    setLastName(sample.lastName);
    setDateOfBirth(sample.dateOfBirth);
    setSex(sample.sex);
    setConditions(sample.conditions);
    setMedications(sample.medications);
    setAllergies(sample.allergies);
    setObservations(sample.observations);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mrn,
          firstName,
          lastName,
          dateOfBirth,
          sex,
          conditions: conditions.filter((c) => c.name.trim()),
          medications: medications.filter((m) => m.name.trim()),
          allergies: allergies.filter((a) => a.substance.trim()),
          observations: observations.filter((o) => o.display.trim()),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create patient");

      router.push(`/patients/${data.patient.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Create Synthetic Patient
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter mock patient data for demonstration purposes only.
        </p>
      </div>

      <div className="mb-4">
        <button type="button" onClick={loadSample} className="btn-secondary">
           Sample Patient
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <section className="section-card">
          <h2 className="section-title mb-4">Demographics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">MRN *</label>
              <input
                className="input-field"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                required
                placeholder="SYN-10001"
              />
            </div>
            <div>
              <label className="label-text">Date of Birth *</label>
              <input
                type="date"
                className="input-field"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-text">First Name *</label>
              <input
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-text">Last Name *</label>
              <input
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-text">Sex</label>
              <select
                className="input-field"
                value={sex}
                onChange={(e) => setSex(e.target.value as typeof sex)}
              >
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <RepeatableSection
          title="Conditions"
          items={conditions}
          onAdd={() =>
            setConditions([
              ...conditions,
              { name: "", status: "active", onsetDate: "", notes: "" },
            ])
          }
          onRemove={(i) => setConditions(conditions.filter((_, idx) => idx !== i))}
          renderItem={(item, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-2">
              <input
                className="input-field"
                placeholder="Condition name"
                value={item.name}
                onChange={(e) => {
                  const next = [...conditions];
                  next[i].name = e.target.value;
                  setConditions(next);
                }}
              />
              <select
                className="input-field"
                value={item.status}
                onChange={(e) => {
                  const next = [...conditions];
                  next[i].status = e.target.value as ConditionInput["status"];
                  setConditions(next);
                }}
              >
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
                <option value="inactive">Inactive</option>
              </select>
              <input
                type="date"
                className="input-field"
                placeholder="Onset date"
                value={item.onsetDate}
                onChange={(e) => {
                  const next = [...conditions];
                  next[i].onsetDate = e.target.value;
                  setConditions(next);
                }}
              />
              <input
                className="input-field"
                placeholder="Notes"
                value={item.notes}
                onChange={(e) => {
                  const next = [...conditions];
                  next[i].notes = e.target.value;
                  setConditions(next);
                }}
              />
            </div>
          )}
        />

        <RepeatableSection
          title="Medications"
          items={medications}
          onAdd={() =>
            setMedications([
              ...medications,
              {
                name: "",
                dose: "",
                frequency: "",
                route: "oral",
                status: "active",
                startDate: "",
              },
            ])
          }
          onRemove={(i) =>
            setMedications(medications.filter((_, idx) => idx !== i))
          }
          renderItem={(item, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <input
                className="input-field"
                placeholder="Medication name"
                value={item.name}
                onChange={(e) => {
                  const next = [...medications];
                  next[i].name = e.target.value;
                  setMedications(next);
                }}
              />
              <input
                className="input-field"
                placeholder="Dose"
                value={item.dose}
                onChange={(e) => {
                  const next = [...medications];
                  next[i].dose = e.target.value;
                  setMedications(next);
                }}
              />
              <input
                className="input-field"
                placeholder="Frequency"
                value={item.frequency}
                onChange={(e) => {
                  const next = [...medications];
                  next[i].frequency = e.target.value;
                  setMedications(next);
                }}
              />
            </div>
          )}
        />

        <RepeatableSection
          title="Allergies"
          items={allergies}
          onAdd={() =>
            setAllergies([
              ...allergies,
              { substance: "", reaction: "", severity: "unknown" },
            ])
          }
          onRemove={(i) => setAllergies(allergies.filter((_, idx) => idx !== i))}
          renderItem={(item, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-3">
              <input
                className="input-field"
                placeholder="Substance"
                value={item.substance}
                onChange={(e) => {
                  const next = [...allergies];
                  next[i].substance = e.target.value;
                  setAllergies(next);
                }}
              />
              <input
                className="input-field"
                placeholder="Reaction"
                value={item.reaction}
                onChange={(e) => {
                  const next = [...allergies];
                  next[i].reaction = e.target.value;
                  setAllergies(next);
                }}
              />
              <select
                className="input-field"
                value={item.severity}
                onChange={(e) => {
                  const next = [...allergies];
                  next[i].severity = e.target.value as AllergyInput["severity"];
                  setAllergies(next);
                }}
              >
                <option value="unknown">Unknown</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          )}
        />

        <RepeatableSection
          title="Observations"
          items={observations}
          onAdd={() =>
            setObservations([
              ...observations,
              {
                type: "vital",
                code: "",
                display: "",
                value: "",
                unit: "",
                recordedAt: new Date().toISOString().split("T")[0],
              },
            ])
          }
          onRemove={(i) =>
            setObservations(observations.filter((_, idx) => idx !== i))
          }
          renderItem={(item, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-4">
              <select
                className="input-field"
                value={item.type}
                onChange={(e) => {
                  const next = [...observations];
                  next[i].type = e.target.value as ObservationInput["type"];
                  setObservations(next);
                }}
              >
                <option value="vital">Vital</option>
                <option value="lab">Lab</option>
                <option value="note">Note</option>
                <option value="other">Other</option>
              </select>
              <input
                className="input-field"
                placeholder="Display name"
                value={item.display}
                onChange={(e) => {
                  const next = [...observations];
                  next[i].display = e.target.value;
                  setObservations(next);
                }}
              />
              <input
                className="input-field"
                placeholder="Value"
                value={item.value}
                onChange={(e) => {
                  const next = [...observations];
                  next[i].value = e.target.value;
                  setObservations(next);
                }}
              />
              <input
                className="input-field"
                placeholder="Unit"
                value={item.unit}
                onChange={(e) => {
                  const next = [...observations];
                  next[i].unit = e.target.value;
                  setObservations(next);
                }}
              />
            </div>
          )}
        />

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Patient"}
          </button>
          <Link href="/" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function RepeatableSection<T>({
  title,
  items,
  onAdd,
  onRemove,
  renderItem,
}: {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <section className="section-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title">{title}</h2>
        <button type="button" onClick={onAdd} className="btn-secondary text-xs">
          + Add
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">None added.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-100 p-3">
              {renderItem(item, i)}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
