import { NextResponse } from "next/server";
import { createPatient, listPatients } from "@/lib/db/patients";
import type { CreatePatientInput } from "@/lib/types";

export async function GET() {
  try {
    const patients = listPatients();
    return NextResponse.json({ patients });
  } catch (error) {
    console.error("GET /api/patients error:", error);
    return NextResponse.json(
      { error: "Failed to list patients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePatientInput;

    if (!body.mrn || !body.firstName || !body.lastName || !body.dateOfBirth) {
      return NextResponse.json(
        { error: "MRN, first name, last name, and date of birth are required" },
        { status: 400 }
      );
    }

    const record = createPatient(body);
    return NextResponse.json(record, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message.includes("UNIQUE")
        ? "A patient with this MRN already exists"
        : "Failed to create patient";
    console.error("POST /api/patients error:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
