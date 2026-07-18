import type { ProjectStatus } from "../api/client";

const STYLES: Record<ProjectStatus, string> = {
  PENDING: "bg-slate-100 text-slate-600",
  REVIEWED: "bg-brand-blue-light text-brand-blue",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

const LABELS: Record<ProjectStatus, string> = {
  PENDING: "Menunggu",
  REVIEWED: "Ditinjau",
  IN_PROGRESS: "Diproses",
  COMPLETED: "Selesai",
  REJECTED: "Ditolak",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}

export const STATUS_OPTIONS: ProjectStatus[] = [
  "PENDING",
  "REVIEWED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
];

export const STATUS_LABELS = LABELS;
