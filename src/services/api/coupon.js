import api from "./axios";

export const couponAPI = {
  validateCoupon: (code, subtotal) =>
    api.post("/coupons/validate", { code, subtotal }),
  getCoupons: () => api.get("/coupons/admin/list"),
  createCoupon: (data) => api.post("/coupons/admin", data),
  updateCoupon: (id, data) => api.put(`/coupons/admin/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/admin/${id}`),
};