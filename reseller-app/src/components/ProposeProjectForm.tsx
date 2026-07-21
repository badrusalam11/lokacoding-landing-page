import { useState, type FormEvent } from "react";
import { api, ApiError, type Project } from "../api/client";
import { useAuth } from "../context/AuthContext";

export function ProposeProjectForm({ onCreated }: { onCreated: (p: Project) => void }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setSubmitting(true);
    try {
      const project = await api.proposeProject(token, {
        clientName,
        clientContact,
        description,
        estimatedBudget: budget ? Number(budget) : undefined,
      });
      onCreated(project);
      setClientName("");
      setClientContact("");
      setDescription("");
      setBudget("");
      setOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Gagal mengajukan project.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-brand-blue px-5 py-2.5 font-semibold text-white transition hover:bg-brand-blue-dark"
      >
        + Propose Project
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-text">Ajukan Project Baru</h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-brand-muted hover:text-brand-text"
        >
          Batal
        </button>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-text">
        Nama Klien
        <input
          required
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="input"
          placeholder="PT Contoh Sejahtera"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-text">
        Kontak Klien (WhatsApp/Email)
        <input
          required
          value={clientContact}
          onChange={(e) => setClientContact(e.target.value)}
          className="input"
          placeholder="08xxxxxxxxxx atau email"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-text">
        Deskripsi Kebutuhan
        <textarea
          required
          minLength={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input min-h-24"
          placeholder="Ceritakan kebutuhan klien secara singkat..."
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-text">
        Estimasi Budget (opsional, Rp)
        <input
          type="number"
          min={0}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="input"
          placeholder="10000000"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-brand-blue px-5 py-2.5 font-semibold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
      >
        {submitting ? "Mengirim..." : "Ajukan Project"}
      </button>
    </form>
  );
}
