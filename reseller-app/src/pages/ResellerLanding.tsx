import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

const steps = [
  {
    title: "Daftar sebagai Reseller",
    desc: "Buat akun reseller gratis, tanpa biaya pendaftaran atau target minimum.",
  },
  {
    title: "Ajukan Project Klien",
    desc: "Temukan klien yang butuh jasa pembuatan web, mobile, atau SaaS, lalu ajukan lewat dashboard.",
  },
  {
    title: "Kami Yang Kerjakan",
    desc: "Tim Loka Coding menangani proses development, komunikasi teknis, hingga project selesai.",
  },
  {
    title: "Terima Komisi",
    desc: "Setiap project yang berhasil closing, kamu dapat komisi dari nilai project tersebut.",
  },
];

const benefits = [
  { label: "Komisi Kompetitif", value: "Hingga 20%", desc: "dari nilai project yang berhasil kamu bawa" },
  { label: "Tanpa Modal", value: "Rp 0", desc: "gratis daftar, tidak perlu keahlian teknis" },
  { label: "Transparan", value: "Real-time", desc: "pantau status setiap project lewat dashboard" },
];

export default function ResellerLanding() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <div className="mx-auto mb-5 w-fit rounded-full bg-brand-blue-light px-4 py-1.5 text-sm font-semibold text-brand-blue">
          Program Reseller Loka Coding
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
          Dapatkan Komisi Menarik,{" "}
          <span className="text-brand-blue">Jual Jasa Software</span> Tanpa Coding
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-muted">
          Bergabunglah sebagai mitra reseller Loka Coding. Bawa klien yang butuh aplikasi
          web, mobile, atau SaaS — kami yang urus pengerjaannya, kamu terima komisinya.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/register"
            className="rounded-full bg-brand-blue px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-brand-blue-dark"
          >
            Daftar sebagai Reseller →
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-brand-border px-6 py-3 font-semibold text-brand-text transition hover:border-brand-blue hover:text-brand-blue"
          >
            Sudah punya akun? Masuk
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.label} className="rounded-2xl border border-brand-border bg-white p-6 text-center">
              <div className="text-3xl font-extrabold text-brand-blue">{b.value}</div>
              <div className="mt-1 font-semibold text-brand-text">{b.label}</div>
              <div className="mt-1 text-sm text-brand-muted">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-3xl font-extrabold text-brand-text">
          Cara Kerjanya
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-brand-muted">
          Empat langkah sederhana dari daftar sampai terima komisi.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-brand-border bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue-light font-bold text-brand-blue">
                {i + 1}
              </div>
              <div className="mt-4 font-semibold text-brand-text">{s.title}</div>
              <div className="mt-1 text-sm text-brand-muted">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl bg-brand-dark-bg p-10 text-center text-white sm:p-14">
          <h2 className="text-3xl font-extrabold">Siap jadi mitra kami?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/70">
            Daftar sekarang, ajukan project pertamamu, dan mulai hasilkan komisi dari
            jaringanmu sendiri.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-full bg-brand-blue px-6 py-3 font-semibold text-white transition hover:bg-brand-blue-dark"
          >
            Daftar sebagai Reseller →
          </Link>
        </div>
      </section>
    </div>
  );
}
