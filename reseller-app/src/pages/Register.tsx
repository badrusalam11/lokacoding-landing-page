import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^(\+62|62|0)8[0-9]{8,12}$/;

function validate(values: { name: string; email: string; phone: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim().replace(/[\s-]/g, "");

  if (!name) {
    errors.name = "Nama lengkap wajib diisi.";
  } else if (name.length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  }

  if (!email) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!phone) {
    errors.phone = "No. WhatsApp wajib diisi.";
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = "Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx.";
  }

  if (!values.password) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  }

  return errors;
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const fieldErrors = validate({ name, email, phone, password });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, phone: phone.trim() });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Gagal terhubung ke server. Periksa koneksi internet kamu dan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="text-2xl font-extrabold text-brand-text">Daftar sebagai Reseller</h1>
        <p className="mt-1 text-brand-muted">
          Gratis, tanpa biaya pendaftaran. Mulai ajukan project setelah daftar.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
          <Field label="Nama Lengkap" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              placeholder="Nama kamu"
            />
          </Field>
          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              placeholder="email@contoh.com"
            />
          </Field>
          <Field label="No. WhatsApp" error={errors.phone}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`input ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              placeholder="08xxxxxxxxxx"
            />
          </Field>
          <Field label="Password" error={errors.password}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
              placeholder="Minimal 8 karakter"
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark disabled:opacity-60"
          >
            {submitting ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-brand-blue">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-text">
      {label}
      {children}
      {error && <span className="text-xs font-normal text-red-600">{error}</span>}
    </label>
  );
}
