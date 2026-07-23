import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api, ApiError, type Reseller } from "../api/client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .listResellers(token)
      .then(setResellers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Gagal memuat data."))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-extrabold text-brand-text">Kelola Reseller</h1>
        <p className="mt-1 text-brand-muted">Aktifkan atau nonaktifkan akun reseller.</p>

        <div className="mt-8">
          {loading && <p className="text-brand-muted">Memuat reseller...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && resellers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-border bg-white p-10 text-center text-brand-muted">
              Belum ada reseller terdaftar.
            </div>
          )}

          {!loading && !error && resellers.length > 0 && (
            <div className="flex flex-col gap-3">
              {resellers.map((r) => (
                <ResellerRow
                  key={r.id}
                  reseller={r}
                  onUpdated={(updated) =>
                    setResellers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResellerRow({
  reseller,
  onUpdated,
}: {
  reseller: Reseller;
  onUpdated: (r: Reseller) => void;
}) {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await api.setResellerActive(token, reseller.id, !reseller.isActive);
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
        <div className="font-semibold text-brand-text">{reseller.name}</div>
        <div className="text-sm text-brand-muted">{reseller.email}</div>
        {reseller.phone && <div className="text-sm text-brand-muted">{reseller.phone}</div>}
        <div className="mt-2 text-xs text-brand-muted">Terdaftar {formatDate(reseller.createdAt)}</div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            reseller.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
        >
          {reseller.isActive ? "Aktif" : "Nonaktif"}
        </span>
        <button
          type="button"
          disabled={saving}
          onClick={handleToggle}
          className="rounded-full border border-brand-border px-4 py-1.5 text-sm font-medium text-brand-text transition hover:border-brand-blue hover:text-brand-blue disabled:opacity-50"
        >
          {reseller.isActive ? "Nonaktifkan" : "Aktifkan"}
        </button>
      </div>
    </div>
  );
}
