import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Bus, Clock } from "lucide-react";
import { Footer } from "../../components/layout";

const TrackBus = () => {
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState("");
  const [trackingData, setTrackingData] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!bookingId) {
      alert("Please enter a booking ID");
      return;
    }

    // Mock tracking data
    setTrackingData({
      bookingId,
      busNumber: "BUS-1234",
      currentLocation: "Lahore",
      nextStop: "Islamabad",
      estimatedArrival: "2h 30m",
      status: "On Time",
      progress: 65,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <Bus className="w-8 h-8 mr-3" />
          Track Your Bus
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleTrack} className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Enter your Booking ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Track</span>
            </button>
          </form>
        </div>

        {trackingData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Tracking Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-semibold text-gray-800">
                    {trackingData.bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bus Number</p>
                  <p className="font-semibold text-gray-800">
                    {trackingData.busNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="font-semibold text-gray-800 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trackingData.currentLocation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Stop</p>
                  <p className="font-semibold text-gray-800">
                    {trackingData.nextStop}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Arrival</p>
                  <p className="font-semibold text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {trackingData.estimatedArrival}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-green-600">
                    {trackingData.status}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Journey Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${trackingData.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {trackingData.progress}% Complete
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackBus;
