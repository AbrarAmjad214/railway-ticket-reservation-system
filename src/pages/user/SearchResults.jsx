import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, Bus, Wifi, Snowflake, Plug, Filter, X } from "lucide-react";
import { busAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, passengers } = location.state || {};

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    departureTime: "",
    busType: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    if (!from || !to || !date) {
      navigate("/");
      return;
    }

    // Fetch buses
    busAPI
      .searchBuses({ from, to, date })
      .then((res) => {
        const busData = res.data || [];
        setBuses(busData);
        setFilteredBuses(busData);
        setLoading(false);
      })
      .catch(() => {
        // Mock data for demo
        setBuses([
          {
            id: 1,
            operator: "Daewoo Express",
            operatorLogo: "🚌",
            departureTime: "08:00",
            arrivalTime: "20:30",
            duration: "12h 30m",
            seatType: "AC",
            price: 2500,
            amenities: ["wifi", "ac", "charging"],
            busType: "Luxury",
          },
          {
            id: 2,
            operator: "Faisal Movers",
            operatorLogo: "🚌",
            departureTime: "10:00",
            arrivalTime: "22:00",
            duration: "12h 00m",
            seatType: "Economy",
            price: 2000,
            amenities: ["wifi", "ac"],
            busType: "Standard",
          },
          {
            id: 3,
            operator: "Niazi Express",
            operatorLogo: "🚌",
            departureTime: "14:00",
            arrivalTime: "02:30",
            duration: "12h 30m",
            seatType: "Business",
            price: 3500,
            amenities: ["wifi", "ac", "charging", "recliner"],
            busType: "Luxury",
          },
        ]);
        setFilteredBuses([
          {
            id: 1,
            operator: "Daewoo Express",
            operatorLogo: "🚌",
            departureTime: "08:00",
            arrivalTime: "20:30",
            duration: "12h 30m",
            seatType: "AC",
            price: 2500,
            amenities: ["wifi", "ac", "charging"],
            busType: "Luxury",
          },
          {
            id: 2,
            operator: "Faisal Movers",
            operatorLogo: "🚌",
            departureTime: "10:00",
            arrivalTime: "22:00",
            duration: "12h 00m",
            seatType: "Economy",
            price: 2000,
            amenities: ["wifi", "ac"],
            busType: "Standard",
          },
          {
            id: 3,
            operator: "Niazi Express",
            operatorLogo: "🚌",
            departureTime: "14:00",
            arrivalTime: "02:30",
            duration: "12h 30m",
            seatType: "Business",
            price: 3500,
            amenities: ["wifi", "ac", "charging", "recliner"],
            busType: "Luxury",
          },
        ]);
        setLoading(false);
      });
  }, [from, to, date, navigate]);

  useEffect(() => {
    let filtered = [...buses];

    if (filters.departureTime) {
      const time = filters.departureTime;
      filtered = filtered.filter((bus) => {
        const busTime = parseInt(bus.departureTime.split(":")[0]);
        if (time === "morning") return busTime >= 6 && busTime < 12;
        if (time === "afternoon") return busTime >= 12 && busTime < 18;
        if (time === "evening") return busTime >= 18 && busTime < 24;
        return true;
      });
    }

    if (filters.busType) {
      filtered = filtered.filter((bus) => bus.busType === filters.busType);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (bus) => bus.price >= parseInt(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (bus) => bus.price <= parseInt(filters.maxPrice)
      );
    }

    setFilteredBuses(filtered);
  }, [filters, buses]);

  const handleSelectSeats = (busId) => {
    navigate(`/bus/${busId}`, {
      state: { from, to, date, passengers },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {from} → {to} | {new Date(date).toLocaleDateString()} | {passengers}{" "}
            {passengers === 1 ? "passenger" : "passengers"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h2>
                <button
                  onClick={() =>
                    setFilters({
                      departureTime: "",
                      busType: "",
                      minPrice: "",
                      maxPrice: "",
                    })
                  }
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time
                  </label>
                  <select
                    value={filters.departureTime}
                    onChange={(e) =>
                      setFilters({ ...filters, departureTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Times</option>
                    <option value="morning">Morning (6 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                    <option value="evening">Evening (6 PM - 12 AM)</option>
                  </select>
                </div>

                {/* Bus Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus Type
                  </label>
                  <select
                    value={filters.busType}
                    onChange={(e) =>
                      setFilters({ ...filters, busType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Standard">Standard</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Listings */}
          <div className="lg:col-span-3">
            {filteredBuses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No buses found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search again
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">
                            {bus.operatorLogo}
                          </span>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {bus.operator}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {bus.busType} • {bus.seatType}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Departure</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {bus.departureTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Arrival</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {bus.arrivalTime}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="text-lg font-semibold text-gray-800 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {bus.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-lg font-semibold text-blue-600">
                              Rs. {bus.price}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {bus.amenities.includes("wifi") && (
                            <div className="flex items-center text-gray-600">
                              <Wifi className="w-4 h-4 mr-1" />
                              <span className="text-sm">WiFi</span>
                            </div>
                          )}
                          {bus.amenities.includes("ac") && (
                            <div className="flex items-center text-gray-600">
                              <Snowflake className="w-4 h-4 mr-1" />
                              <span className="text-sm">AC</span>
                            </div>
                          )}
                          {bus.amenities.includes("charging") && (
                            <div className="flex items-center text-gray-600">
                              <Plug className="w-4 h-4 mr-1" />
                              <span className="text-sm">Charging</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6">
                        <button
                          onClick={() => handleSelectSeats(bus.id)}
                          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                          Select Seats
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
