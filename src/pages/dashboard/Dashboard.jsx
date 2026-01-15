import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trainAPI, scheduleAPI, bookingAPI } from '../../services/api'
import { Train, Calendar, BookOpen, MapPin, Clock, Users, TrendingUp } from 'lucide-react'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalTrains: 0,
    totalSchedules: 0,
    userBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [upcomingSchedules, setUpcomingSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [trainsRes, schedulesRes, bookingsRes] = await Promise.all([
        trainAPI.getTrains(),
        scheduleAPI.getAllSchedules(),
        bookingAPI.getUserBookings(),
      ])

      setStats({
        totalTrains: trainsRes.data.length,
        totalSchedules: schedulesRes.data.schedules.length,
        userBookings: bookingsRes.data.length,
      })

      setRecentBookings(bookingsRes.data.slice(0, 3))
      setUpcomingSchedules(schedulesRes.data.schedules.slice(0, 3))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your railway booking activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Train className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Trains</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrains}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Schedules</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSchedules}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Your Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.userBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <Link
              to="/bookings"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.train?.trainName || 'Train'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Seat {booking.seatNumber} • {booking.schedule?.date ? new Date(booking.schedule.date).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.bookingStatus === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No bookings yet</p>
          )}
        </div>

        {/* Upcoming Schedules */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Schedules</h3>
            <Link
              to="/schedules"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {upcomingSchedules.length > 0 ? (
            <div className="space-y-3">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {schedule.train?.trainName || 'Train'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {schedule.startStation} → {schedule.endStation}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(schedule.date).toLocaleDateString()} • {schedule.departureTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">Rs. {schedule.ticketPrice}</p>
                    <p className="text-sm text-gray-600">{schedule.availableSeats} seats</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming schedules</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/trains"
            className="flex items-center justify-center space-x-2 p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <Train size={20} />
            <span>Browse Trains</span>
          </Link>

          <Link
            to="/schedules"
            className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar size={20} />
            <span>View Schedules</span>
          </Link>

          <Link
            to="/bookings"
            className="flex items-center justify-center space-x-2 p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BookOpen size={20} />
            <span>My Bookings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
