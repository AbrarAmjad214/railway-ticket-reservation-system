import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const busBookingAPI = {
  getUserBookings: () => api.get("/booking/my-bookings"),
  downloadTicket: (bookingId) =>
    api.get(`/booking/${bookingId}/ticket`, { responseType: "blob" }),
  cancelBooking: (bookingId) => api.patch(`/booking/${bookingId}/cancel`),
};
