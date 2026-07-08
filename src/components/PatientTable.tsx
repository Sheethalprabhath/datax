"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Patient } from "@/lib/types";

export function PatientTable({ patients }: { patients: Patient[] }) {
  const router = useRouter();

  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="sticky top-0 border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-700">
              <input type="checkbox" className="rounded border-slate-300" disabled />
            </th>
            <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
            <th className="px-4 py-3 font-semibold text-slate-700">MRN</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Sex</th>
            <th className="px-4 py-3 font-semibold text-slate-700">DOB</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="cursor-pointer transition hover:bg-clinical-50"
              onClick={() => router.push(`/patients/${patient.id}`)}
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="rounded border-slate-300" disabled />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/patients/${patient.id}`}
                  className="font-medium text-clinical-700 hover:text-clinical-800 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {patient.firstName} {patient.lastName}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{patient.mrn}</td>
              <td className="px-4 py-3">
                <span className="badge-info capitalize">{patient.sex}</span>
              </td>
              <td className="px-4 py-3 text-slate-600">{patient.dateOfBirth}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(patient.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
