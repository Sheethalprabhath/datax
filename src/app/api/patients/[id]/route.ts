import { NextResponse } from "next/server";
import { getPatientRecord } from "@/lib/db/patients";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = getPatientRecord(id);

    if (!record) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("GET /api/patients/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to get patient" },
      { status: 500 }
    );
  }
}
