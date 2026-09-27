const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/me", { token }),

  getPosts: () => request("/posts"),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (formData, token) => request("/posts", { method: "POST", body: formData, token, isForm: true }),

  rateFarmer: (payload, token) => request("/ratings", { method: "POST", body: payload, token }),
  getFarmerRatings: (farmerId) => request(`/farmers/${farmerId}/ratings`),

  sendContact: (payload) => request("/contact", { method: "POST", body: payload }),
};

export const ASSET_BASE = BASE_URL.replace(/\/api\/?$/, "");
