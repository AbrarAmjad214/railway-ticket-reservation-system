import api from "./axios";

export const trainAPI = {
  getTrains: () => api.get("/train/list"),
  getTrainById: (id) => api.get(`/train/${id}`),
  addTrain: (trainData) => api.post("/train/admin/train", trainData),
  updateTrain: (id, trainData) => api.put(`/train/admin/${id}`, trainData),
  deleteTrain: (id) => api.delete(`/train/admin/${id}`),
};
