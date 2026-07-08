"use client";

import { useEffect, useState } from "react";
import type { AgentMessage, AgentResponse } from "@/lib/types";
import { SUPPORTED_TASK_SUGGESTIONS } from "@/lib/agent/safety";

export function AgentChatPanel({ patientId }: { patientId: string }) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    loadMessages();
  }, [patientId]);

  async function loadMessages() {
    const res = await fetch(`/api/patients/${patientId}/chat`);
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setLoading(true);
    setInput("");

    try {
      const res = await fetch(`/api/patients/${patientId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      await res.json();
      await loadMessages();
    } finally {
      setLoading(false);
    }
  }

  async function saveDraft(response: AgentResponse, messageId: string) {
    setSaveStatus("Saving...");
    const title =
      response.taskRequested.slice(0, 60) +
      (response.taskRequested.length > 60 ? "…" : "");

    const res = await fetch(`/api/patients/${patientId}/drafts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Draft: ${title}`,
        content: response.draftOutput,
        taskRequested: response.taskRequested,
        evidenceRefIds: response.evidenceRefIds,
        agentMessageId: messageId,
      }),
    });

    if (res.ok) {
      setSaveStatus("Draft saved! View it in the Saved Drafts tab.");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Failed to save draft");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        <strong>Bounded agent tasks only.</strong> Click a suggested question below
        to run a clinical review task. Outputs require clinician review and are
        not diagnoses or treatment plans.
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {SUPPORTED_TASK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => sendMessage(suggestion)}
            disabled={loading}
            className="rounded-lg border border-clinical-200 bg-white px-3 py-2 text-left text-xs text-clinical-700 transition hover:border-clinical-400 hover:bg-clinical-50 disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500">
            No messages yet. Try a suggested task above.
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onSaveDraft={
                msg.agentResponse && !msg.agentResponse.rejected
                  ? () => saveDraft(msg.agentResponse!, msg.id)
                  : undefined
              }
            />
          ))
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex shrink-0 gap-2"
      >
        <input
          className="input-field flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a bounded task..."
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </form>

      {saveStatus && (
        <p className="text-sm text-emerald-600">{saveStatus}</p>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  onSaveDraft,
}: {
  message: AgentMessage;
  onSaveDraft?: () => void;
}) {
  const isUser = message.role === "user";
  const response = message.agentResponse;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg bg-clinical-600 px-4 py-2 text-sm text-white">
          {message.content}
        </div>
      </div>
    );
  }

  if (response?.rejected) {
    return (
      <div className="max-w-[95%]">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
          <div className="font-semibold text-red-800">Request Not Supported</div>
          <p className="mt-2 text-red-700">{response.rejectionReason}</p>
          <AgentSteps steps={response.steps} />
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-lg bg-white p-3 text-sm text-slate-700">
        {message.content}
      </div>
    );
  }

  return (
    <div className="max-w-[95%] space-y-3">
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs font-medium text-purple-800">
        {response.clinicianReviewNotice}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
        <div className="mb-3 border-b border-slate-100 pb-3">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Task Requested
          </span>
          <p className="mt-1 font-medium">{response.taskRequested}</p>
        </div>

        <AgentSteps steps={response.steps} />

        <div className="mt-4">
          <span className="text-xs font-semibold uppercase text-slate-500">
            Draft Output
          </span>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 font-sans text-sm text-slate-800">
            {response.draftOutput}
          </pre>
        </div>

        {response.evidenceRefIds.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Evidence References
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {response.evidenceRefIds.map((id) => (
                <span key={id} className="badge-info font-mono text-[10px]">
                  {id.slice(0, 8)}…
                </span>
              ))}
            </div>
          </div>
        )}

        {response.uncertaintyNotes.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Uncertainty / Missing Info
            </span>
            <ul className="mt-1 text-sm text-slate-600">
              {response.uncertaintyNotes.map((n, i) => (
                <li key={i}>• {n}</li>
              ))}
            </ul>
          </div>
        )}

        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="btn-primary mt-4 text-xs"
          >
            Save Draft
          </button>
        )}
      </div>
    </div>
  );
}

function AgentSteps({ steps }: { steps: { step: number; action: string; detail: string }[] }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase text-slate-500">
        Agent Steps
      </span>
      <ol className="mt-2 space-y-2">
        {steps.map((s) => (
          <li key={s.step} className="flex gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clinical-100 text-xs font-bold text-clinical-700">
              {s.step}
            </span>
            <div>
              <div className="font-medium">{s.action}</div>
              <div className="text-slate-500">{s.detail}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
