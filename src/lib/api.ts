const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const TOKEN_KEY = "skillfolio-access-token";

export type AuthResponse = {
  access_token: string;
  token_type: string;
  profile_name: string;
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Invalid email or password");
  const result = (await response.json()) as AuthResponse;
  localStorage.setItem(TOKEN_KEY, result.access_token);
  return result;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function hasSession(): boolean {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export async function apiFetch<T>(path: string): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (response.status === 401) {
    logout();
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return (await response.json()) as T;
}
