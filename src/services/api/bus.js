import api from "./axios";

export const busAPI = {
  searchBuses: (params) => api.get("/bus/search", { params }),
  getBusById: (id) => api.get(`/bus/${id}`),
  getAvailableSeats: (busId, date) =>
    api.get(`/bus/${busId}/seats`, { params: { date } }),
  getPopularRoutes: () => api.get("/bus/popular-routes"),
  getAllBuses: () => api.get("/bus/list"),
};

