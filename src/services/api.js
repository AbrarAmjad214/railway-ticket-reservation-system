import axios from 'axios'

// const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
// const API_BASE_URL = 'http://localhost:5000/api'
const API_BASE_URL = 'https://railway-ticket-reservation-system-b.vercel.app/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.get('/auth/logout'),
  getAllUsers: () => api.get('/auth/admin/users'),
}

export const trainAPI = {
  getTrains: () => api.get('/train/list'),
  addTrain: (trainData) => api.post('/train/admin/train', trainData),
  getTrainById: (id) => api.get(`/train/${id}`),
}

export const scheduleAPI = {
  getSchedulesByTrain: (trainId) => api.get(`/schedule/train/${trainId}`),
  addSchedule: (scheduleData) => api.post('/schedule/admin/schedule', scheduleData),
  getAllSchedules: () => api.get('/schedule/admin/all'),
  getAvailableSeats: (scheduleId) => api.get(`/schedule/availability/${scheduleId}`),
}

export const bookingAPI = {
  createBooking: (bookingData) => api.post('/booking/create', bookingData),
  getUserBookings: () => api.get('/booking/user'),
  cancelBooking: (id) => api.post(`/booking/cancel/${id}`),
  getAllBookings: () => api.get('/booking/admin/all'),
}

export default api
