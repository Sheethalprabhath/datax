import { PatientDetailClient } from "@/components/PatientDetailClient";

export const dynamic = "force-dynamic";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PatientDetailClient patientId={id} />;
}
