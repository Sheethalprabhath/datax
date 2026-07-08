import { NextResponse } from "next/server";
import { listDrafts, saveDraft } from "@/lib/db/patients";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const drafts = listDrafts(id);
    return NextResponse.json({ drafts });
  } catch (error) {
    console.error("GET /api/patients/[id]/drafts error:", error);
    return NextResponse.json(
      { error: "Failed to list drafts" },
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
    const body = (await request.json()) as {
      title: string;
      content: string;
      taskRequested: string;
      evidenceRefIds: string[];
      agentMessageId?: string;
    };

    if (!body.title?.trim() || !body.content?.trim() || !body.taskRequested?.trim()) {
      return NextResponse.json(
        { error: "Title, content, and taskRequested are required" },
        { status: 400 }
      );
    }

    const draft = saveDraft(
      id,
      body.title.trim(),
      body.content.trim(),
      body.taskRequested.trim(),
      body.evidenceRefIds || [],
      body.agentMessageId || null
    );

    return NextResponse.json({ draft }, { status: 201 });
  } catch (error) {
    console.error("POST /api/patients/[id]/drafts error:", error);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}
