import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { ProposeProjectForm } from "../components/ProposeProjectForm";
import { StatusBadge, STATUS_OPTIONS, STATUS_LABELS } from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { api, ApiError, type Project, type ProjectStatus } from "../api/client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(value: number | null) {
  if (!value) return "-";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(
    value,
  );
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .listProjects(token)
      .then(setProjects)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Gagal memuat data."))
      .finally(() => setLoading(false));
  }, [token]);

  if (!user) return null;

  const isAdmin = user.role === "ADMIN";

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-text">
              {isAdmin ? "Dashboard Admin" : "Dashboard Reseller"}
            </h1>
            <p className="mt-1 text-brand-muted">
              {isAdmin
                ? "Pantau seluruh leads & project yang diajukan reseller."
                : "Ajukan project baru dan pantau statusnya di sini."}
            </p>
          </div>
          {!isAdmin && (
            <ProposeProjectForm onCreated={(p) => setProjects((prev) => [p, ...prev])} />
          )}
        </div>

        <div className="mt-8">
          {loading && <p className="text-brand-muted">Memuat project...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && projects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-border bg-white p-10 text-center text-brand-muted">
              Belum ada project.{" "}
              {isAdmin ? "Menunggu pengajuan dari reseller." : "Ajukan project pertamamu."}
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="flex flex-col gap-3">
              {projects.map((p) =>
                isAdmin ? (
                  <AdminProjectRow
                    key={p.id}
                    project={p}
                    onUpdated={(updated) =>
                      setProjects((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                    }
                  />
                ) : (
                  <ResellerProjectRow key={p.id} project={p} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResellerProjectRow({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-brand-border bg-white p-5">
      <div>
        <div className="font-semibold text-brand-text">{project.clientName}</div>
        <div className="text-sm text-brand-muted">{project.clientContact}</div>
        <p className="mt-2 max-w-xl text-sm text-brand-text">{project.description}</p>
        {project.adminNote && (
          <p className="mt-2 rounded-lg bg-brand-blue-light px-3 py-2 text-sm text-brand-blue">
            Catatan admin: {project.adminNote}
          </p>
        )}
        <div className="mt-2 text-xs text-brand-muted">
          Diajukan {formatDate(project.createdAt)} · Estimasi {formatBudget(project.estimatedBudget)}
        </div>
      </div>
      <StatusBadge status={project.status} />
    </div>
  );
}

function AdminProjectRow({
  project,
  onUpdated,
}: {
  project: Project;
  onUpdated: (p: Project) => void;
}) {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(status: ProjectStatus) {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateProjectStatus(token, project.id, { status });
      onUpdated(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengubah status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-brand-border bg-white p-5">
      <div>
        <div className="font-semibold text-brand-text">{project.clientName}</div>
        <div className="text-sm text-brand-muted">{project.clientContact}</div>
        <p className="mt-2 max-w-xl text-sm text-brand-text">{project.description}</p>
        <div className="mt-2 text-xs text-brand-muted">
          Diajukan {formatDate(project.createdAt)} · Estimasi {formatBudget(project.estimatedBudget)}
        </div>
        {project.reseller && (
          <div className="mt-2 text-xs text-brand-muted">
            Reseller: <span className="font-medium text-brand-text">{project.reseller.name}</span> (
            {project.reseller.email})
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={project.status} />
        <select
          value={project.status}
          disabled={saving}
          onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
          className="input py-1.5 text-sm"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
