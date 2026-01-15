import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Clock,
  Bus,
  Wifi,
  Snowflake,
  Plug,
  Filter,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { busAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, passengers } = location.state || {};

  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNoBusesAvailable, setIsNoBusesAvailable] = useState(false);
  const [filters, setFilters] = useState({
    departureTime: "",
    busType: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch buses with proper error handling
  const fetchBuses = async () => {
    if (!from || !to || !date) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setIsNoBusesAvailable(false);

      const res = await busAPI.searchBuses({ from, to, date });

      const busData = res.data || [];

      if (!Array.isArray(busData)) {
        throw new Error("Invalid response format from server");
      }

      // Check if buses array is empty
      if (busData.length === 0) {
        setIsNoBusesAvailable(true);
        setBuses([]);
        setFilteredBuses([]);
      } else {
        setBuses(busData);
        setFilteredBuses(busData);
        setIsNoBusesAvailable(false);
      }
    } catch (err) {
      console.error("Error fetching buses:", err);

      // Handle 404 error - No buses available
      if (err.response?.status === 404) {
        setIsNoBusesAvailable(true);
        setError(null);
        setBuses([]);
        setFilteredBuses([]);
      } else {
        // Handle other errors (network, 500, etc.)
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch buses. Please try again later.";
        setError(errorMessage);
        setIsNoBusesAvailable(false);
        setBuses([]);
        setFilteredBuses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
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
    if (!busId) {
      alert("Invalid bus selection. Please try again.");
      return;
    }
    navigate(`/bus/${busId}`, {
      state: { from, to, date, passengers },
    });
  };

  const handleRetry = () => {
    fetchBuses();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Searching for buses...</p>
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
            {from} → {to} | {date ? new Date(date).toLocaleDateString() : "N/A"}{" "}
            | {passengers || 1} {passengers === 1 ? "passenger" : "passengers"}
          </p>
        </div>

        {/* Error Message - Only show for actual errors, not for no buses available */}
        {error && !isNoBusesAvailable && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-1">
                  Error Loading Buses
                </h3>
                <p className="text-red-600 text-sm mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Buses Available Message */}
        {isNoBusesAvailable && !loading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Bus className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-blue-800 font-semibold mb-2 text-lg">
                  No Buses Available
                </h3>
                <p className="text-blue-700 mb-4">
                  Sorry, there are no buses available for the route{" "}
                  <span className="font-semibold">
                    {from} → {to}
                  </span>{" "}
                  on{" "}
                  <span className="font-semibold">
                    {date
                      ? new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "selected date"}
                  </span>
                  .
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Search Different Route
                  </button>
                  <button
                    onClick={handleRetry}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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
            {error && !isNoBusesAvailable ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Unable to Load Buses
                </h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retry Search
                </button>
              </div>
            ) : isNoBusesAvailable || filteredBuses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isNoBusesAvailable ? "No Buses Available" : "No buses found"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isNoBusesAvailable
                    ? `No buses are available for the route ${from} → ${to} on ${
                        date
                          ? new Date(date).toLocaleDateString()
                          : "selected date"
                      }. Please try a different date or route.`
                    : buses.length === 0
                    ? "No buses are available for this route on the selected date. Please try a different date or route."
                    : "No buses match your current filters. Try adjusting your filters or search again."}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {buses.length > 0 && !isNoBusesAvailable && (
                    <button
                      onClick={() =>
                        setFilters({
                          departureTime: "",
                          busType: "",
                          minPrice: "",
                          maxPrice: "",
                        })
                      }
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Search Different Route
                  </button>
                  {!isNoBusesAvailable && (
                    <button
                      onClick={handleRetry}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <div
                    key={bus.id || bus._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-3">
                            {bus.operatorLogo || "🚌"}
                          </span>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-800">
                              {bus.operator ||
                                bus.operatorName ||
                                "Unknown Operator"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {bus.busType || "Standard"} •{" "}
                              {bus.seatType || "Regular"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Departure</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {bus.departureTime || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Arrival</p>
                            <p className="text-lg font-semibold text-gray-800">
                              {bus.arrivalTime || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="text-lg font-semibold text-gray-800 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {bus.duration || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="text-lg font-semibold text-blue-600">
                              Rs. {bus.price || bus.ticketPrice || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {bus.amenities && Array.isArray(bus.amenities) && (
                            <>
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
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6">
                        <button
                          onClick={() => handleSelectSeats(bus.id || bus._id)}
                          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={!bus.id && !bus._id}
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
