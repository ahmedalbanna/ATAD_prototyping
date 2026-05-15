const BASE_URL = import.meta.env.VITE_API_URL || "http://185.190.140.93:3001/api/v1";

let token = localStorage.getItem("atad_admin_token");

export async function adminLogin(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      const d = data.data;
      token = d.token;
      localStorage.setItem("atad_admin_token", token);
      localStorage.setItem("atad_admin_user", JSON.stringify(d.user));
    }
    return data.success;
  } catch {
    return false;
  }
}

export function adminLogout() {
  token = null;
  localStorage.removeItem("atad_admin_token");
}

export function isAdminLoggedIn() {
  return !!token;
}

async function request(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Request failed");
  return json.data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: "DELETE" }),
  clearToken: () => adminLogout(),
};
