import api from "./axios";

export const busBookingAPI = {
  createBooking: (bookingData) => api.post("/bus-booking/create", bookingData),
  getUserBookings: () => api.get("/bus-booking/user"),
  getBookingById: (id) => api.get(`/bus-booking/${id}`),
  cancelBooking: (id) => api.post(`/bus-booking/cancel/${id}`),
  downloadTicket: (id) =>
    api.get(`/bus-booking/${id}/download`, { responseType: "blob" }),
};

// Legacy train booking APIs (if needed)
export const bookingAPI = {
  createBooking: (bookingData) => api.post("/booking/create", bookingData),
  getUserBookings: () => api.get("/booking/user"),
  cancelBooking: (id) => api.post(`/booking/cancel/${id}`),
  getAllBookings: () => api.get("/booking/admin/all"),
};

