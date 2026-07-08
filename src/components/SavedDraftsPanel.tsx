"use client";

import { useEffect, useState } from "react";
import type { SavedDraft } from "@/lib/types";

export function SavedDraftsPanel({ patientId }: { patientId: string }) {
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDrafts();
  }, [patientId]);

  async function loadDrafts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/drafts`);
      const data = await res.json();
      setDrafts(data.drafts || []);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading saved drafts...</p>;
  }

  if (drafts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-emerald-200 bg-emerald-50/30 p-8 text-center">
        <p className="text-sm text-slate-600">No saved drafts yet.</p>
        <p className="mt-2 text-xs text-slate-500">
          Generate a draft in the Agent / Chat tab, then click &quot;Save
          Draft&quot; to preserve it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Clinician review required.</strong> Saved drafts are snapshots of
        agent-generated output — not final clinical documentation.
      </div>

      {drafts.map((draft) => (
        <article
          key={draft.id}
          className="rounded-lg border border-emerald-100 bg-white p-4 text-sm shadow-sm"
        >
          <header className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900">{draft.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                Task: {draft.taskRequested}
              </p>
              <p className="text-xs text-slate-400">
                Saved: {new Date(draft.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="badge-active">Saved Draft</span>
          </header>

          <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-4 font-sans text-sm text-slate-800">
            {draft.content}
          </pre>

          {draft.evidenceRefIds.length > 0 && (
            <div className="mt-3">
              <span className="text-xs font-semibold uppercase text-slate-500">
                Evidence References
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {draft.evidenceRefIds.map((id) => (
                  <span key={id} className="badge-info font-mono text-[10px]">
                    {id.slice(0, 8)}…
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
