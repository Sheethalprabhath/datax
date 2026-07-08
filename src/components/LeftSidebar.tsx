"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/SidebarContext";

const mainNavItems = [
  { label: "Search", icon: SearchIcon, disabled: true },
  { label: "Spaces", icon: GridIcon, disabled: true },
  { href: "/", label: "Patients", icon: UsersIcon, disabled: false },
  { label: "Schedule", icon: CalendarIcon, disabled: true },
  { label: "Messages", icon: MessageIcon, badge: 25, disabled: true },
  { label: "Tasks", icon: CheckSquareIcon, disabled: true },
  { label: "Faxes", icon: FaxIcon, disabled: true },
];

const quickLinks = [
  { label: "Get Started", icon: RocketIcon, disabled: true },
  { href: "/patients/new", label: "New Patient", icon: UserPlusIcon, disabled: false },
  { label: "Integrations", icon: PlugIcon, disabled: true },
  { label: "DoseSpot", icon: PillIcon, badge: 1, disabled: true },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { hovered, setHovered } = useSidebar();
  const expanded = hovered;

  function isActive(href: string) {
    if (href === "/") {
      return (
        pathname === "/" ||
        (pathname.startsWith("/patients/") && pathname !== "/patients/new")
      );
    }
    if (href === "/patients/new") return pathname === "/patients/new";
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={`group/sidebar flex shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white transition-all duration-200 ${
        expanded ? "w-52" : "w-14"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <nav className="flex flex-1 flex-col overflow-y-auto py-3">
        <div className="space-y-0.5 px-2">
          {mainNavItems.map((item) => (
            <NavItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              expanded={expanded}
              active={item.href ? isActive(item.href) : false}
              disabled={item.disabled}
            />
          ))}
        </div>

        {expanded && (
          <div className="mt-4 px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Links
            </p>
          </div>
        )}
        {!expanded && <div className="my-3 border-t border-slate-100" />}

        <div className="mt-1 space-y-0.5 px-2">
          {quickLinks.map((item) => (
            <NavItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              expanded={expanded}
              active={item.href ? pathname.startsWith(item.href) : false}
              disabled={item.disabled}
            />
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-2">
        <div
          className={`flex items-center ${expanded ? "gap-2" : "flex-col gap-2"}`}
        >
          {expanded ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clinical-600 text-xs font-bold text-white">
                EW
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-900">
                  Everett Williams
                </p>
                <button
                  type="button"
                  className="text-[10px] text-slate-500 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-clinical-600 text-xs font-bold text-white">
              EW
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  badge,
  expanded,
  active,
  disabled,
}: {
  href?: string;
  label: string;
  icon: React.ComponentType;
  badge?: number;
  expanded: boolean;
  active: boolean;
  disabled: boolean;
}) {
  const baseClass = `group flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition ${
    expanded ? "" : "justify-center"
  }`;

  const activeClass = active
    ? "bg-clinical-50 text-clinical-700"
    : disabled
      ? "cursor-default text-slate-300"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

  const iconClass = active
    ? "text-clinical-600"
    : disabled
      ? "text-slate-300"
      : "text-slate-400 group-hover:text-slate-600";

  const content = (
    <>
      <span className={`shrink-0 ${iconClass}`}>
        <Icon />
      </span>
      {expanded && (
        <>
          <span className="flex-1 truncate font-medium">{label}</span>
          {badge !== undefined && (
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
                disabled ? "bg-slate-300" : "bg-red-500"
              }`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </>
  );

  if (disabled || !href) {
    return (
      <button
        type="button"
        title={!expanded ? label : undefined}
        className={`${baseClass} ${activeClass} w-full`}
        onClick={(e) => e.preventDefault()}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      title={!expanded ? label : undefined}
      className={`${baseClass} ${activeClass}`}
    >
      {content}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766m0 0a5.25 5.25 0 0 1-.621-2.078A12.318 12.318 0 0 1 4.875 12c0-2.331.645-4.512 1.766-6.374a5.25 5.25 0 0 1 2.078-.621m0 0A12.318 12.318 0 0 1 10.875 4.5c2.331 0 4.512.645 6.374 1.766a5.25 5.25 0 0 1 2.078.621m0 0v.003" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function FaxIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.687 4.493 4.493 0 0 0 4.686-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

function PlugIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.611L5 14.5" />
    </svg>
  );
}
