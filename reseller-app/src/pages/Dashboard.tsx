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

interface EditFields {
  clientName: string;
  clientContact: string;
  description: string;
  estimatedBudget: string;
}

function toEditFields(project: Project): EditFields {
  return {
    clientName: project.clientName,
    clientContact: project.clientContact,
    description: project.description,
    estimatedBudget: project.estimatedBudget != null ? String(project.estimatedBudget) : "",
  };
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

  function handleUpdated(updated: Project) {
    setProjects((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
  }

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
                  <AdminProjectRow key={p.id} project={p} onUpdated={handleUpdated} />
                ) : (
                  <ResellerProjectRow key={p.id} project={p} onUpdated={handleUpdated} />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResellerProjectRow({
  project,
  onUpdated,
}: {
  project: Project;
  onUpdated: (p: Project) => void;
}) {
  const { token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<EditFields>(() => toEditFields(project));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit() {
    setFields(toEditFields(project));
    setError(null);
    setEditing(true);
  }

  async function handleSave() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateProject(token, project.id, {
        clientName: fields.clientName,
        clientContact: fields.clientContact,
        description: fields.description,
        estimatedBudget: fields.estimatedBudget ? Number(fields.estimatedBudget) : undefined,
      });
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-white p-5">
        <input
          className="input"
          value={fields.clientName}
          onChange={(e) => setFields((f) => ({ ...f, clientName: e.target.value }))}
          placeholder="Nama klien"
        />
        <input
          className="input"
          value={fields.clientContact}
          onChange={(e) => setFields((f) => ({ ...f, clientContact: e.target.value }))}
          placeholder="Kontak klien"
        />
        <textarea
          className="input"
          rows={3}
          value={fields.description}
          onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
          placeholder="Deskripsi project"
        />
        <input
          className="input"
          type="number"
          value={fields.estimatedBudget}
          onChange={(e) => setFields((f) => ({ ...f, estimatedBudget: e.target.value }))}
          placeholder="Estimasi budget"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-full bg-brand-blue px-4 py-1.5 text-sm text-white transition hover:bg-brand-blue-dark disabled:opacity-50"
          >
            Simpan
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => setEditing(false)}
            className="rounded-full border border-brand-border px-4 py-1.5 text-sm text-brand-text hover:border-brand-blue hover:text-brand-blue"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

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
        {project.developmentSummary && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Update perkembangan: {project.developmentSummary}
          </p>
        )}
        <div className="mt-2 text-xs text-brand-muted">
          Diajukan {formatDate(project.createdAt)} · Estimasi {formatBudget(project.estimatedBudget)}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={project.status} />
        <button
          type="button"
          onClick={startEdit}
          className="rounded-full border border-brand-border px-4 py-1.5 text-sm text-brand-text transition hover:border-brand-blue hover:text-brand-blue"
        >
          Edit
        </button>
      </div>
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

  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState<EditFields>(() => toEditFields(project));

  const [summary, setSummary] = useState(project.developmentSummary ?? "");
  const [summarySaving, setSummarySaving] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

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

  function startEdit() {
    setFields(toEditFields(project));
    setError(null);
    setEditing(true);
  }

  async function handleSaveEdit() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await api.updateProject(token, project.id, {
        clientName: fields.clientName,
        clientContact: fields.clientContact,
        description: fields.description,
        estimatedBudget: fields.estimatedBudget ? Number(fields.estimatedBudget) : undefined,
      });
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSummary() {
    if (!token) return;
    setSummarySaving(true);
    setSummaryError(null);
    try {
      const updated = await api.updateProjectSummary(token, project.id, summary);
      onUpdated(updated);
    } catch (err) {
      setSummaryError(err instanceof ApiError ? err.message : "Gagal menyimpan ringkasan.");
    } finally {
      setSummarySaving(false);
    }
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-white p-5">
        <input
          className="input"
          value={fields.clientName}
          onChange={(e) => setFields((f) => ({ ...f, clientName: e.target.value }))}
          placeholder="Nama klien"
        />
        <input
          className="input"
          value={fields.clientContact}
          onChange={(e) => setFields((f) => ({ ...f, clientContact: e.target.value }))}
          placeholder="Kontak klien"
        />
        <textarea
          className="input"
          rows={3}
          value={fields.description}
          onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
          placeholder="Deskripsi project"
        />
        <input
          className="input"
          type="number"
          value={fields.estimatedBudget}
          onChange={(e) => setFields((f) => ({ ...f, estimatedBudget: e.target.value }))}
          placeholder="Estimasi budget"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveEdit}
            className="rounded-full bg-brand-blue px-4 py-1.5 text-sm text-white transition hover:bg-brand-blue-dark disabled:opacity-50"
          >
            Simpan
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => setEditing(false)}
            className="rounded-full border border-brand-border px-4 py-1.5 text-sm text-brand-text hover:border-brand-blue hover:text-brand-blue"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-brand-border bg-white p-5">
      <div className="max-w-xl flex-1">
        <div className="font-semibold text-brand-text">{project.clientName}</div>
        <div className="text-sm text-brand-muted">{project.clientContact}</div>
        <p className="mt-2 text-sm text-brand-text">{project.description}</p>
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

        <div className="mt-4">
          <label className="text-xs font-medium text-brand-muted">Ringkasan perkembangan</label>
          <textarea
            className="input mt-1"
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Update perkembangan pengerjaan project..."
          />
          {summaryError && <p className="mt-1 text-sm text-red-600">{summaryError}</p>}
          <button
            type="button"
            disabled={summarySaving}
            onClick={handleSaveSummary}
            className="mt-2 rounded-full border border-brand-border px-4 py-1.5 text-sm text-brand-text transition hover:border-brand-blue hover:text-brand-blue disabled:opacity-50"
          >
            Simpan Ringkasan
          </button>
        </div>
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
        <button
          type="button"
          onClick={startEdit}
          className="rounded-full border border-brand-border px-4 py-1.5 text-sm text-brand-text transition hover:border-brand-blue hover:text-brand-blue"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
