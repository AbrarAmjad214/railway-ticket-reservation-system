import api from "./axios";

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  getMe: () => api.get("/auth/me"),
  logout: () => api.get("/auth/logout"),
  getAllUsers: () => api.get("/auth/admin/users"),
  deleteUser: (id) => api.delete(`/auth/admin/users/${id}`),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  changePassword: (passwordData) => api.post("/auth/change-password", passwordData),
};