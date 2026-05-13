const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";

let token = localStorage.getItem("atad_token");

function getToken() {
  return token;
}

function setToken(t) {
  token = t;
  if (t) localStorage.setItem("atad_token", t);
  else localStorage.removeItem("atad_token");
}

async function request(endpoint, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const json = await res.json();

  if (!json.success) {
    const err = new Error(json.error?.message || "Request failed");
    err.code = json.error?.code;
    err.status = res.status;
    err.details = json.error?.details;
    throw err;
  }

  return json.data;
}

export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: (url, body) => request(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: "DELETE" }),

  // Auth helpers
  getToken,
  setToken,
  clearToken: () => setToken(null),
};
