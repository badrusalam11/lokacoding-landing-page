import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-brand-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-extrabold tracking-tight text-brand-text">
          Loka<span className="text-brand-blue">Coding</span>{" "}
          <span className="text-sm font-medium text-brand-muted">Reseller</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <Link to="/dashboard" className="text-brand-text hover:text-brand-blue">
                Dashboard
              </Link>
              <span className="hidden text-brand-muted sm:inline">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-brand-border px-4 py-1.5 text-brand-text transition hover:border-brand-blue hover:text-brand-blue"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-brand-text hover:text-brand-blue">
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-brand-blue px-4 py-1.5 text-white transition hover:bg-brand-blue-dark"
              >
                Daftar Reseller
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
