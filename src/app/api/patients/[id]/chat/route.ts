import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  generateMockResponse,
  generateOpenAIResponse,
} from "@/lib/agent/service";
import {
  checkRequestSafety,
  CLINICIAN_REVIEW_NOTICE,
} from "@/lib/agent/safety";
import { buildPatientContext } from "@/lib/context/builder";
import {
  getPatientRecord,
  listAgentMessages,
  saveAgentMessage,
  saveDerivedContext,
} from "@/lib/db/patients";
import type { AgentResponse } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = listAgentMessages(id);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/patients/[id]/chat error:", error);
    return NextResponse.json(
      { error: "Failed to list chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { message: string };

    if (!body.message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const record = getPatientRecord(id);
    if (!record) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const userMessage = body.message.trim();
    saveAgentMessage(id, "user", userMessage, null);

    const safety = checkRequestSafety(userMessage);
    const context = buildPatientContext(record);
    saveDerivedContext(id, context);

    const now = new Date().toISOString();

    if (!safety.allowed) {
      const rejectedResponse: AgentResponse = {
        id: uuidv4(),
        patientId: id,
        taskRequested: userMessage,
        patientContextUsed: context,
        steps: [
          {
            step: 1,
            action: "Safety check",
            detail: "Request evaluated against supported task boundaries.",
          },
          {
            step: 2,
            action: "Request rejected",
            detail: safety.rejectionReason || "Unsupported request.",
          },
        ],
        draftOutput: "",
        evidenceRefIds: [],
        missingInformation: context.missingInformation,
        uncertaintyNotes: [
          "Request was not processed because it falls outside supported bounded tasks.",
        ],
        rejected: true,
        rejectionReason: safety.rejectionReason,
        clinicianReviewNotice: CLINICIAN_REVIEW_NOTICE,
        createdAt: now,
      };

      const assistantMsg = saveAgentMessage(
        id,
        "assistant",
        safety.rejectionReason || "Request not supported.",
        rejectedResponse
      );

      return NextResponse.json({ message: assistantMsg });
    }

    const task = safety.task || "handover_summary";
    const llmMode = process.env.LLM_MODE || "mock";

    const generated =
      llmMode === "openai" && process.env.OPENAI_API_KEY
        ? await generateOpenAIResponse(task, context, userMessage)
        : generateMockResponse(task, context);

    const agentResponse: AgentResponse = {
      id: uuidv4(),
      patientId: id,
      taskRequested: userMessage,
      patientContextUsed: context,
      steps: generated.steps,
      draftOutput: generated.output,
      evidenceRefIds: generated.evidenceRefIds,
      missingInformation: context.missingInformation,
      uncertaintyNotes: [
        "Output generated from available synthetic data only.",
        context.missingInformation.length > 0
          ? `${context.missingInformation.length} data gap(s) identified — see missing information section.`
          : "No obvious data gaps identified, but complete verification is still required.",
      ],
      rejected: false,
      rejectionReason: null,
      clinicianReviewNotice: CLINICIAN_REVIEW_NOTICE,
      createdAt: now,
    };

    const assistantMsg = saveAgentMessage(
      id,
      "assistant",
      generated.output,
      agentResponse
    );

    return NextResponse.json({
      message: assistantMsg,
      mode: llmMode === "openai" && process.env.OPENAI_API_KEY ? "openai" : "mock",
    });
  } catch (error) {
    console.error("POST /api/patients/[id]/chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
