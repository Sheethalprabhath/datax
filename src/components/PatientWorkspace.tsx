"use client";

import { useState } from "react";
import type { PatientContext, PatientRecord } from "@/lib/types";
import { RawPatientData } from "@/components/RawPatientData";
import { DerivedContextPanel } from "@/components/DerivedContextPanel";
import { AgentChatPanel } from "@/components/AgentChatPanel";
import { SavedDraftsPanel } from "@/components/SavedDraftsPanel";

type TabId = "raw" | "context" | "agent" | "drafts";

const activeTabs: { id: TabId; label: string }[] = [
  { id: "raw", label: "Raw Patient Data" },
  { id: "context", label: "Derived Context" },
  { id: "agent", label: "Agent/Chat" },
  { id: "drafts", label: "Saved Drafts" },
];

const dummyTabs = [
  { label: "Care Plans" },
  { label: "Visits" },
  { label: "Tasks" },
  { label: "Labs" },
];

export function PatientWorkspace({
  patientId,
  record,
  context,
  onRegenerateContext,
}: {
  patientId: string;
  record: PatientRecord;
  context: PatientContext | null;
  onRegenerateContext: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("raw");

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50">
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex overflow-x-auto">
          {activeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-clinical-600 text-clinical-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
          {dummyTabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              disabled
              className="cursor-default whitespace-nowrap border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-300"
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === "context" && (
          <button
            type="button"
            onClick={onRegenerateContext}
            className="btn-secondary ml-2 shrink-0 text-xs"
          >
            Regenerate Context
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        {activeTab === "raw" && (
          <section className="section-card flex min-h-0 flex-1 flex-col overflow-hidden">
            <p className="mb-4 shrink-0 text-sm text-slate-500">
              Source-of-truth clinical data as stored in the system.
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <RawPatientData record={record} />
            </div>
          </section>
        )}

        {activeTab === "context" && (
          <section className="section-card flex min-h-0 flex-1 flex-col overflow-hidden border-clinical-200">
            <p className="mb-4 shrink-0 text-sm text-slate-500">
              Purpose-specific clinical context assembled from raw data — not a
              full record dump.
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {context ? (
                <DerivedContextPanel context={context} />
              ) : (
                <p className="text-sm text-slate-500">Context not available.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "agent" && (
          <section className="section-card flex min-h-0 flex-1 flex-col overflow-hidden border-purple-200">
            <p className="mb-4 shrink-0 text-sm text-slate-500">
              Bounded chat for draft clinical summaries. Outputs require
              clinician review.
            </p>
            <AgentChatPanel patientId={patientId} />
          </section>
        )}

        {activeTab === "drafts" && (
          <section className="section-card flex min-h-0 flex-1 flex-col overflow-hidden border-emerald-200">
            <p className="mb-4 shrink-0 text-sm text-slate-500">
              Preserved agent outputs with evidence references and task metadata.
            </p>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <SavedDraftsPanel patientId={patientId} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
