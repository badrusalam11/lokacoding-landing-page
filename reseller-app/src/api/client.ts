// Empty string means same-origin (production, behind the Caddy reverse proxy).
// In local dev, VITE_API_URL points straight at the backend dev server.
const API_URL = import.meta.env.VITE_API_URL || "";

export type Role = "RESELLER" | "ADMIN";

export type ProjectStatus =
  | "PENDING"
  | "REVIEWED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
}

export interface Project {
  id: string;
  clientName: string;
  clientContact: string;
  description: string;
  estimatedBudget: number | null;
  status: ProjectStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
  resellerId: string;
  reseller?: { id: string; name: string; email: string; phone: string | null };
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(data.error), res.status);
  }

  return data as T;
}

function extractErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  // zod's `.flatten()` shape: { formErrors: string[], fieldErrors: { [key]: string[] } }
  if (error && typeof error === "object") {
    const flat = error as { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
    const messages = [
      ...(flat.formErrors ?? []),
      ...Object.values(flat.fieldErrors ?? {}).flat(),
    ];
    if (messages.length > 0) return messages.join(" ");
  }

  return "Terjadi kesalahan, coba lagi.";
}

export const api = {
  register: (body: { name: string; email: string; password: string; phone: string }) =>
    request<{ token: string; user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body,
    }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body,
    }),

  me: (token: string) => request<AuthUser>("/api/auth/me", { token }),

  listProjects: (token: string) => request<Project[]>("/api/projects", { token }),

  proposeProject: (
    token: string,
    body: {
      clientName: string;
      clientContact: string;
      description: string;
      estimatedBudget?: number;
    },
  ) => request<Project>("/api/projects", { method: "POST", token, body }),

  updateProjectStatus: (
    token: string,
    id: string,
    body: { status: ProjectStatus; adminNote?: string },
  ) => request<Project>(`/api/projects/${id}/status`, { method: "PATCH", token, body }),
};

export { ApiError };
