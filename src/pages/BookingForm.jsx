import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { scheduleAPI, bookingAPI } from '../services/api'
import { Train, Calendar, Clock, MapPin, User, Users, CreditCard, AlertCircle } from 'lucide-react'

const BookingForm = ({ user }) => {
  const { scheduleId } = useParams()
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState(null)
  const [availableSeats, setAvailableSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    passengerName: user?.name || '',
    passengerAge: '',
    seatNumber: '',
  })

  useEffect(() => {
    fetchScheduleDetails()
  }, [scheduleId])

  const fetchScheduleDetails = async () => {
    try {
      const scheduleResponse = await scheduleAPI.getAllSchedules()
      const foundSchedule = scheduleResponse.data.schedules.find(s => s._id === scheduleId)

      if (!foundSchedule) {
        setError('Schedule not found')
        return
      }

      setSchedule(foundSchedule)

      // Generate available seats (simplified - in real app, you'd get this from backend)
      const seats = []
      for (let i = 1; i <= foundSchedule.availableSeats; i++) {
        seats.push(i)
      }
      setAvailableSeats(seats)
    } catch (error) {
      console.error('Error fetching schedule:', error)
      setError('Failed to load schedule details')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBookingLoading(true)

    try {
      const bookingData = {
        trainId: schedule.train._id,
        scheduleId: schedule._id,
        seatNumber: parseInt(formData.seatNumber),
        passengerName: formData.passengerName,
        passengerAge: parseInt(formData.passengerAge),
      }

      await bookingAPI.createBooking(bookingData)
      navigate('/bookings', { state: { message: 'Booking created successfully!' } })
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !schedule) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (schedule.availableSeats === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Seats Available</h3>
        <p className="text-gray-600">This train is fully booked.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Your Ticket</h1>
        <p className="text-gray-600 mt-2">
          Complete your booking for this train schedule
        </p>
      </div>

      {/* Schedule Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Train className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">{schedule.train?.trainName}</p>
              <p className="text-sm text-gray-600">{schedule.train?.trainNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">
                {schedule.train?.startStation} → {schedule.train?.endStation}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">
                {new Date(schedule.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-gray-900">
                {schedule.departureTime} - {schedule.arrivalTime}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-primary-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-primary-900">Total Price</span>
            <span className="text-2xl font-bold text-primary-600">Rs. {schedule.ticketPrice}</span>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger Information</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center space-x-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passengerName" className="label">
              Passenger Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="passengerName"
                name="passengerName"
                type="text"
                required
                className="input pl-10"
                placeholder="Enter passenger name"
                value={formData.passengerName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="passengerAge" className="label">
              Passenger Age
            </label>
            <input
              id="passengerAge"
              name="passengerAge"
              type="number"
              required
              min="1"
              max="120"
              className="input"
              placeholder="Enter age"
              value={formData.passengerAge}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="seatNumber" className="label">
              Select Seat Number
            </label>
            <select
              id="seatNumber"
              name="seatNumber"
              required
              className="input"
              value={formData.seatNumber}
              onChange={handleChange}
            >
              <option value="">Choose a seat</option>
              {availableSeats.map((seat) => (
                <option key={seat} value={seat}>
                  Seat {seat}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">
              {availableSeats.length} seats available
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/schedules')}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={bookingLoading}
              className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allow"
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
