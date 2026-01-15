import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Calendar,
  Clock,
  MapPin,
  Train,
  Users,
  DollarSign,
  Filter,
  Search,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";
import { scheduleAPI } from "../../services/api";
import { Footer } from "../../components/layout";
import { useAuth } from "../../context/AuthContext";

const AllSchedules = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    date: "",
    from: "",
    to: "",
    search: "",
  });
  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await scheduleAPI.getAllSchedules();

      if (res.data && res.data.schedules) {
        const scheduleData = res.data.schedules;
        setSchedules(scheduleData);
        setFilteredSchedules(scheduleData);
      } else {
        setSchedules([]);
        setFilteredSchedules([]);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError(err.response?.data?.message || "Failed to load schedules");
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...schedules];

    // Filter by date
    if (filters.date) {
      const filterDate = new Date(filters.date).toISOString().split("T")[0];
      filtered = filtered.filter((schedule) => {
        const scheduleDate = new Date(schedule.date)
          .toISOString()
          .split("T")[0];
        return scheduleDate === filterDate;
      });
    }

    // Filter by from station
    if (filters.from) {
      filtered = filtered.filter((schedule) => {
        const fromStation = schedule.train?.startStation?.toLowerCase() || "";
        return fromStation.includes(filters.from.toLowerCase());
      });
    }

    // Filter by to station
    if (filters.to) {
      filtered = filtered.filter((schedule) => {
        const toStation = schedule.train?.endStation?.toLowerCase() || "";
        return toStation.includes(filters.to.toLowerCase());
      });
    }

    // Filter by search (train name, number, route)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((schedule) => {
        const trainName = schedule.train?.trainName?.toLowerCase() || "";
        const trainNumber = schedule.train?.trainNumber?.toLowerCase() || "";
        const startStation = schedule.train?.startStation?.toLowerCase() || "";
        const endStation = schedule.train?.endStation?.toLowerCase() || "";

        return (
          trainName.includes(searchTerm) ||
          trainNumber.includes(searchTerm) ||
          startStation.includes(searchTerm) ||
          endStation.includes(searchTerm)
        );
      });
    }

    setFilteredSchedules(filtered);
  }, [filters, schedules]);

  const clearFilters = () => {
    setFilters({
      date: "",
      from: "",
      to: "",
      search: "",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "N/A";
    return time;
  };

  const handleBookNow = (schedule) => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login first to book a ticket!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    // Open passenger count modal
    setSelectedSchedule(schedule);
    setPassengerCount(1);
    setIsPassengerModalOpen(true);
  };

  const handleConfirmPassengers = () => {
    if (!selectedSchedule) return;

    // Validate passenger count
    if (passengerCount < 1 || passengerCount > 10) {
      toast.error("Please enter a valid number between 1 and 10", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Convert schedule to bus format for compatibility
    const bus = {
      id: selectedSchedule.train?._id || selectedSchedule.train?.id,
      operator: selectedSchedule.train?.trainName || "Unknown",
      operatorLogo: "🚌",
      departureTime: selectedSchedule.departureTime,
      arrivalTime: selectedSchedule.arrivalTime,
      duration: calculateDuration(
        selectedSchedule.departureTime,
        selectedSchedule.arrivalTime
      ),
      seatType: "AC",
      price: selectedSchedule.ticketPrice,
      amenities: ["wifi", "ac", "charging"],
      busType: "Standard",
      trainNumber: selectedSchedule.train?.trainNumber,
    };

    // Close modal
    setIsPassengerModalOpen(false);

    // Debug: Log before navigation
    console.log(
      "AllSchedules - Navigating to BusDetails with schedule:",
      selectedSchedule
    );
    console.log("AllSchedules - Schedule _id:", selectedSchedule?._id);
    console.log(
      "AllSchedules - Schedule keys:",
      selectedSchedule
        ? Object.keys(selectedSchedule)
        : "schedule is null/undefined"
    );

    // Navigate to bus details page for seat selection
    navigate(`/bus/${bus.id}`, {
      state: {
        from: selectedSchedule.train?.startStation,
        to: selectedSchedule.train?.endStation,
        date: new Date(selectedSchedule.date).toISOString().split("T")[0],
        passengers: passengerCount,
        schedule: selectedSchedule, // Pass full schedule object
        bus: bus,
      },
    });
  };

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return "N/A";
    try {
      const [depHours, depMins] = departure.split(":").map(Number);
      const [arrHours, arrMins] = arrival.split(":").map(Number);

      let depMinutes = depHours * 60 + depMins;
      let arrMinutes = arrHours * 60 + arrMins;

      // Handle next day arrival
      if (arrMinutes < depMinutes) {
        arrMinutes += 24 * 60;
      }

      const totalMinutes = arrMinutes - depMinutes;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${hours}h ${minutes}m`;
    } catch (error) {
      return "N/A";
    }
  };

  // Get unique stations for filter dropdowns
  const uniqueStations = Array.from(
    new Set(
      schedules
        .flatMap((schedule) => [
          schedule.train?.startStation,
          schedule.train?.endStation,
        ])
        .filter(Boolean)
    )
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            All Bus Schedules
          </h1>
          <p className="text-gray-600">
            View all available bus routes and schedules
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-1">
                  Error Loading Schedules
                </h3>
                <p className="text-red-600 text-sm mb-3">{error}</p>
                <button
                  onClick={fetchSchedules}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Search
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                placeholder="Search by train name, number, or route..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* From Station */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                From
              </label>
              <input
                type="text"
                value={filters.from}
                onChange={(e) =>
                  setFilters({ ...filters, from: e.target.value })
                }
                placeholder="Departure city..."
                list="from-stations"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="from-stations">
                {uniqueStations.map((station) => (
                  <option key={station} value={station} />
                ))}
              </datalist>
            </div>

            {/* To Station */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                To
              </label>
              <input
                type="text"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                placeholder="Destination city..."
                list="to-stations"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <datalist id="to-stations">
                {uniqueStations.map((station) => (
                  <option key={station} value={station} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredSchedules.length}</span>{" "}
              of <span className="font-semibold">{schedules.length}</span>{" "}
              schedules
            </p>
          </div>
        </div>

        {/* Schedules List */}
        {filteredSchedules.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Train className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Schedules Found
            </h3>
            <p className="text-gray-600 mb-4">
              {schedules.length === 0
                ? "No schedules available at the moment."
                : "Try adjusting your filters to see more results."}
            </p>
            {schedules.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Train Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Train className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {schedule.train?.trainName || "Unknown Train"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Train Number: {schedule.train?.trainNumber || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-semibold text-gray-800">
                            {schedule.train?.startStation || "N/A"}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">To</p>
                          <p className="font-semibold text-gray-800">
                            {schedule.train?.endStation || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Schedule Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-semibold text-gray-800">
                            {formatDate(schedule.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Departure</p>
                          <p className="font-semibold text-gray-800">
                            {formatTime(schedule.departureTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Arrival</p>
                          <p className="font-semibold text-gray-800">
                            {formatTime(schedule.arrivalTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Available Seats
                          </p>
                          <p className="font-semibold text-gray-800">
                            {schedule.availableSeats || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Price & Action */}
                  <div className="lg:border-l lg:pl-6 flex flex-col items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Ticket Price</p>
                      <p className="text-3xl font-bold text-blue-600">
                        Rs. {schedule.ticketPrice?.toLocaleString() || "0"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookNow(schedule)}
                      className="w-full lg:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Book Now
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Passenger Count Modal */}
      <Modal
        isOpen={isPassengerModalOpen}
        onRequestClose={() => setIsPassengerModalOpen(false)}
        contentLabel="Select Number of Passengers"
        className="fixed inset-0 flex items-center justify-center z-50 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
        ariaHideApp={false}
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={() => setIsPassengerModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Select Passengers
                </h2>
                <p className="text-gray-600 text-sm">
                  How many passengers are traveling?
                </p>
              </div>
            </div>

            {selectedSchedule && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Route</p>
                <p className="font-semibold text-gray-800">
                  {selectedSchedule.train?.startStation} →{" "}
                  {selectedSchedule.train?.endStation}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Date: {formatDate(selectedSchedule.date)}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Number of Passengers (1-10)
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (passengerCount > 1) {
                    setPassengerCount(passengerCount - 1);
                  }
                }}
                disabled={passengerCount <= 1}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={passengerCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 10) {
                    setPassengerCount(value);
                  }
                }}
                className="flex-1 px-4 py-3 border-2 border-blue-500 rounded-lg text-center text-2xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (passengerCount < 10) {
                    setPassengerCount(passengerCount + 1);
                  }
                }}
                disabled={passengerCount >= 10}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Select between 1 and 10 passengers
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsPassengerModalOpen(false)}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPassengers}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default AllSchedules;
