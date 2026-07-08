"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PatientContext, PatientRecord } from "@/lib/types";
import { PatientProfilePanel } from "@/components/PatientProfilePanel";
import { PatientWorkspace } from "@/components/PatientWorkspace";

export function PatientDetailClient({ patientId }: { patientId: string }) {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [context, setContext] = useState<PatientContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [patientId]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [recordRes, contextRes] = await Promise.all([
        fetch(`/api/patients/${patientId}`),
        fetch(`/api/patients/${patientId}/context`),
      ]);

      if (!recordRes.ok) throw new Error("Patient not found");
      const recordData = await recordRes.json();
      setRecord(recordData);

      if (contextRes.ok) {
        const contextData = await contextRes.json();
        setContext(contextData.context);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load patient");
    } finally {
      setLoading(false);
    }
  }

  async function regenerateContext() {
    const res = await fetch(`/api/patients/${patientId}/context`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setContext(data.context);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-12 text-slate-500">
        Loading patient...
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-12">
        <p className="text-red-600">{error || "Patient not found"}</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">
          Back to patients
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <PatientProfilePanel record={record} />
      <PatientWorkspace
        patientId={patientId}
        record={record}
        context={context}
        onRegenerateContext={regenerateContext}
      />
    </div>
  );
}
