import { useState, useEffect } from 'react'
import { bookingAPI } from '../services/api'
import { BookOpen, Calendar, MapPin, Clock, X, CheckCircle, AlertCircle } from 'lucide-react'

const Bookings = ({ user }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings()
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await bookingAPI.cancelBooking(bookingId)
      // Refresh bookings
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <X className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          View and manage your train ticket bookings
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.train?.trainName || 'Train'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Booking ID: {booking._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(booking.bookingStatus)}
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Train Details</p>
                  <p className="text-sm text-gray-600">{booking.train?.trainNumber}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {booking.train?.startStation} → {booking.train?.endStation}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Schedule</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {booking.schedule?.date ? new Date(booking.schedule.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {booking.schedule?.departureTime} - {booking.schedule?.arrivalTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Passenger Details</p>
                  <p className="text-sm text-gray-600">{booking.passengerName}</p>
                  <p className="text-sm text-gray-600">Age: {booking.passengerAge}</p>
                  <p className="text-sm text-gray-600">Seat: {booking.seatNumber}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Payment</p>
                  <p className="text-sm text-gray-600">Rs. {booking.schedule?.ticketPrice || 0}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : booking.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>

              {booking.bookingStatus === 'confirmed' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn btn-danger"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        </div>
      )}
    </div>
  )
}

export default Bookings
