const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const TOKEN_KEY = "skillfolio-access-token";

export type AuthResponse = {
  access_token: string;
  token_type: string;
  profile_name: string;
};

export type EvidenceRecord = {
  id: string;
  title: string;
  type: "course" | "project" | "competition" | "credential";
  source: string;
  date: string;
  status: "Verified" | "Pending" | "Needs Review";
  skills: string[];
  detail: string;
};

export type Recommendation = {
  match: { id: string; title: string; org: string; kind: "Internship" | "Team"; domain: string; summary: string };
  score: number;
  matched_skills: string[];
  gaps: { skill: string; suggestion: string }[];
  fairness_note: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(body?.detail ?? `API request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result;
}

export async function signup(email: string, password: string, name: string): Promise<AuthResponse> {
  const result = await request<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result;
}

export function logout(): void {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    void fetch(`${API_URL}/api/auth/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  }
  localStorage.removeItem(TOKEN_KEY);
}

export function hasSession(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export async function apiFetch<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function createEvidence(payload: Omit<EvidenceRecord, "id" | "status">): Promise<EvidenceRecord> {
  return request<EvidenceRecord>("/api/evidence", { method: "POST", body: JSON.stringify(payload) });
}
