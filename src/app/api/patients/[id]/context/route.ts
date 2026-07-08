import { NextResponse } from "next/server";
import { buildPatientContext } from "@/lib/context/builder";
import {
  getLatestDerivedContext,
  getPatientRecord,
  saveDerivedContext,
} from "@/lib/db/patients";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const useCache = searchParams.get("cache") !== "false";

    const record = getPatientRecord(id);
    if (!record) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    if (useCache) {
      const cached = getLatestDerivedContext(id);
      if (cached) {
        return NextResponse.json({
          context: cached,
          cached: true,
        });
      }
    }

    const context = buildPatientContext(record);
    saveDerivedContext(id, context);

    return NextResponse.json({
      context,
      cached: false,
    });
  } catch (error) {
    console.error("GET /api/patients/[id]/context error:", error);
    return NextResponse.json(
      { error: "Failed to build patient context" },
      { status: 500 }
    );
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = getPatientRecord(id);

    if (!record) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const context = buildPatientContext(record);
    saveDerivedContext(id, context);

    return NextResponse.json({ context, regenerated: true });
  } catch (error) {
    console.error("POST /api/patients/[id]/context error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate patient context" },
      { status: 500 }
    );
  }
}
