import { useState, useEffect } from 'react'
import { trainAPI } from '../services/api'
import { Train, MapPin, Users, Plus } from 'lucide-react'

const Trains = () => {
  const [trains, setTrains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrains()
  }, [])

  const fetchTrains = async () => {
    try {
      const response = await trainAPI.getTrains()
      setTrains(response.data)
    } catch (error) {
      console.error('Error fetching trains:', error)
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
          <h1 className="text-3xl font-bold text-gray-900">Available Trains</h1>
          <p className="text-gray-600 mt-2">
            Browse all available trains in our network
          </p>
        </div>
      </div>

      {trains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trains.map((train) => (
            <div key={train._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Train className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {train.trainName}
                  </h3>
                  <p className="text-sm text-gray-600">{train.trainNumber}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{train.startStation} → {train.endStation}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{train.totalSeats} seats</span>
                </div>
              </div>

              {train.routeStations && train.routeStations.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Route Stations:</p>
                  <div className="flex flex-wrap gap-1">
                    {train.routeStations.map((station, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                      >
                        {station}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Train className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trains available</h3>
          <p className="text-gray-600">Trains will be added soon.</p>
        </div>
      )}
    </div>
  )
}

export default Trains
