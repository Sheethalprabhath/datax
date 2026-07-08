"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface PatientSummary {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
}

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isPatientsActive =
    pathname === "/" ||
    (pathname.startsWith("/patients/") && pathname !== "/patients/new");
  const isNewPatientActive = pathname === "/patients/new";
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setPatients([]));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? patients.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
        );
      })
    : [];

  function selectPatient(id: string) {
    setQuery("");
    setShowResults(false);
    router.push(`/patients/${id}`);
  }

  return (
    <header className="shrink-0 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-clinical-600 text-sm font-bold text-white">
            DX
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-semibold text-slate-900">DataX</div>
            <div className="text-xs text-slate-500">Synthetic patient data only</div>
          </div>
        </Link>

        <div className="flex flex-1 items-center justify-center gap-3">
          <div ref={searchRef} className="relative w-full max-w-md">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search patients..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="input-field pl-9"
            />
            {showResults && query.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-500">No patients found</p>
                ) : (
                  filtered.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPatient(p.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50"
                    >
                      <span className="font-medium text-slate-900">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="text-slate-500">MRN: {p.mrn}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href="/"
            className={`btn-secondary hidden shrink-0 sm:inline-flex ${isPatientsActive ? "nav-btn-active" : ""}`}
          >
            Patients
          </Link>
          <Link
            href="/patients/new"
            className={`btn-secondary hidden shrink-0 sm:inline-flex ${isNewPatientActive ? "nav-btn-active" : ""}`}
          >
            New Patient
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-clinical-500 to-clinical-700 text-xs font-bold text-white">
            EW
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:inline">
            Everett Williams
          </span>
        </div>
      </div>
    </header>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}
