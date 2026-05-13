const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

let token = localStorage.getItem("atad_admin_token");

export async function adminLogin() {
  const phone = "+966555000000";
  try {
    await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, role: "admin" }),
    });
    const otpRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp: localStorage.getItem("atad_admin_otp") || "000000" }),
    });
    const data = await otpRes.json();
    if (data.success) {
      token = data.token;
      localStorage.setItem("atad_admin_token", token);
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
  patch: (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body) }),
  clearToken: () => adminLogout(),
};
