import Link from "next/link";

import { PatientTable } from "@/components/PatientTable";
import { listPatients } from "@/lib/db/patients";



export const dynamic = "force-dynamic";



export function PatientListContent() {

  const patients = listPatients();



  return (

    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50">

      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">

        <h1 className="text-xl font-bold text-slate-900">Patients</h1>

        <p className="mt-1 text-sm text-slate-600">

          Select a patient to view their record, context, and agent workspace.

        </p>

      </div>



      {patients.length === 0 ? (

        <div className="flex-1 overflow-y-auto p-6">

          <div className="section-card py-12 text-center">

            <p className="text-slate-600">No patients yet.</p>

            <p className="mt-2 text-sm text-slate-500">

              Create a synthetic patient to get started.

            </p>

            <Link href="/patients/new" className="btn-primary mt-4 inline-flex">

              Create First Patient

            </Link>

          </div>

        </div>

      ) : (

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-6">

          <div className="mb-3 flex shrink-0 flex-wrap items-center gap-2">

            <ToolbarButton icon={FilterIcon} label="Filter" />

            <ToolbarButton icon={ExportIcon} label="Export" />

            <ToolbarButton icon={DeleteIcon} label="Delete" />

            <ToolbarButton icon={BulkIcon} label="Bulk" />

          </div>



          <PatientTable patients={patients} />

          <div className="mt-3 flex shrink-0 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm text-slate-500">
              Showing 1–{patients.length} of {patients.length} patients
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="btn-secondary px-2 py-1 text-xs opacity-50"
              >
                ← Prev
              </button>
              <button
                type="button"
                className="rounded px-2.5 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: "var(--identity-colorscheme-color-primary-action)" }}
              >
                1
              </button>
              <button
                type="button"
                disabled
                className="btn-secondary px-2 py-1 text-xs opacity-50"
              >
                Next →
              </button>
            </div>
          </div>

        </div>

      )}

    </div>

  );

}



function ToolbarButton({

  icon: Icon,

  label,

}: {

  icon: React.ComponentType;

  label: string;

}) {

  return (

    <button

      type="button"

      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"

    >

      <Icon />

      {label}

    </button>

  );

}



function FilterIcon() {

  return (

    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>

      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />

    </svg>

  );

}



function ExportIcon() {

  return (

    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>

      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />

    </svg>

  );

}



function DeleteIcon() {

  return (

    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>

      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />

    </svg>

  );

}



function BulkIcon() {

  return (

    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>

      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />

    </svg>

  );

}

