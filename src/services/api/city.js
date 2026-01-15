import api from "./axios";

export const cityAPI = {
  getAllCities: () => api.get("/cities"),
  getCityByName: (name) => api.get(`/cities/${name}`),
};
