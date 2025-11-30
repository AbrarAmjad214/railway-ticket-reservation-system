import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { scheduleAPI } from '../services/api'
import { Calendar, Clock, MapPin, IndianRupee, Users, Train } from 'lucide-react'

const Schedules = () => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await scheduleAPI.getAllSchedules()
      setSchedules(response.data.schedules)
    } catch (error) {
      console.error('Error fetching schedules:', error)
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Train Schedules</h1>
          <p className="text-gray-600 mt-2">
            View all available train schedules and book your tickets
          </p>
        </div>
      </div>

      {schedules.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schedules.map((schedule) => (
            <div key={schedule._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <Train className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {schedule.train?.trainName || 'Train'}
                    </h3>
                    <p className="text-sm text-gray-600">{schedule.train?.trainNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    Rs. {schedule.ticketPrice}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{schedule.train?.startStation} → {schedule.train?.endStation}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(schedule.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{schedule.departureTime} - {schedule.arrivalTime}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{schedule.availableSeats} seats available</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/book/${schedule._id}`}
                  className={`flex-1 btn btn-primary ${
                    schedule.availableSeats === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={(e) => schedule.availableSeats === 0 && e.preventDefault()}
                >
                  {schedule.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </Link>

                <button
                  className="btn btn-secondary"
                  onClick={() => {/* View details modal */}}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules available</h3>
          <p className="text-gray-600">Schedules will be added soon.</p>
        </div>
      )}
    </div>
  )
}

export default Schedules
