import axios from "axios";
import { config } from "@/config";
import { Vehicle, Part, Clothing, SearchResult, AuthResponse, VerifyResponse } from "@/types";
import { useAuthStore } from "@/store";
import { saveToken, getStoredToken, clearToken } from "@/lib/tokenStorage";

const api = axios.create({
  baseURL: config.apiUrl + "/api",
  withCredentials: true,
});

// The token travels as an httpOnly cookie by default. Browsers that block
// cross-site cookies (Safari/iOS, content blockers, private mode) never send
// it, so we also attach the token stored at login as a Bearer header.
api.interceptors.request.use((request) => {
  const token = getStoredToken();
  if (token) request.headers.set("Authorization", `Bearer ${token}`);
  return request;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      const isAuthRoute = err.config?.url?.includes("/auth/");
      if (!isAuthRoute) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(err);
  }
);

export const vehicleService = {
  getAll: () => api.get<Vehicle[]>("/vehicles").then((r) => r.data),
  getById: (id: string) => api.get<Vehicle>(`/vehicles/${id}`).then((r) => r.data),
  create: (data: Partial<Vehicle>) => api.post<Vehicle>("/vehicles", data).then((r) => r.data),
  update: (id: string, data: Partial<Vehicle>) =>
    api.put<Vehicle>(`/vehicles/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/vehicles/${id}`).then((r) => r.data),
};

export const partService = {
  getAll: () => api.get<Part[]>("/parts").then((r) => r.data),
  getById: (id: string) => api.get<Part>(`/parts/${id}`).then((r) => r.data),
  create: (data: Partial<Part>) => api.post<Part>("/parts", data).then((r) => r.data),
  update: (id: string, data: Partial<Part>) =>
    api.put<Part>(`/parts/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/parts/${id}`).then((r) => r.data),
};

export const clothingService = {
  getAll: () => api.get<Clothing[]>("/clothing").then((r) => r.data),
  getById: (id: string) => api.get<Clothing>(`/clothing/${id}`).then((r) => r.data),
  create: (data: Partial<Clothing>) => api.post<Clothing>("/clothing", data).then((r) => r.data),
  update: (id: string, data: Partial<Clothing>) =>
    api.put<Clothing>(`/clothing/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/clothing/${id}`).then((r) => r.data),
};

export const searchService = {
  globalSearch: (q: string) =>
    api.get<SearchResult>("/search", { params: { q } }).then((r) => r.data),
};

export const authService = {
  login: async (email: string, password: string) => {
    const data = await api
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data);
    saveToken(data.token);
    return data;
  },
  verify: () => api.get<VerifyResponse>("/auth/verify").then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }).then((r) => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/password", { currentPassword, newPassword }).then((r) => r.data),
  logout: async () => {
    try {
      return await api.post("/auth/logout").then((r) => r.data);
    } finally {
      clearToken();
    }
  },
};

export const uploadService = {
  uploadImages: (files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.post<{ urls: string[] }>("/upload", form).then((r) => r.data);
  },
  deleteImage: (url: string) =>
    api.post("/upload/delete", { url }).then((r) => r.data),
};
