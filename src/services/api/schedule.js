import api from "./axios";

export const scheduleAPI = {
  getAllSchedules: () => api.get("/schedule/all"),
  getScheduleByTrainId: (trainId) => api.get(`/schedule/train/${trainId}`),
  getAvailableSeats: (scheduleId) => api.get(`/schedule/availability/${scheduleId}`),
  addSchedule: (scheduleData) => api.post("/schedule/admin/schedule", scheduleData),
  updateSchedule: (id, scheduleData) => api.put(`/schedule/admin/${id}`, scheduleData),
  deleteSchedule: (id) => api.delete(`/schedule/admin/${id}`),
};
