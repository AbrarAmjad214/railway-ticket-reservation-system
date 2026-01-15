import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Clock,
  Wifi,
  Snowflake,
  Plug,
  ArrowRight,
  Users,
  Train,
} from "lucide-react";
import { busAPI, scheduleAPI, bookingAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const BusDetails = () => {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    from,
    to,
    date,
    passengers = 1,
    schedule,
    bus: busFromState,
  } = location.state || {};

  // Debug: Log schedule data
  useEffect(() => {
    console.log("BusDetails - Schedule from location.state:", schedule);
    console.log("BusDetails - Schedule _id:", schedule?._id);
    console.log("BusDetails - Full location.state:", location.state);
  }, [schedule, location.state]);

  const [train, setTrain] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookedSeatNumbers, setBookedSeatNumbers] = useState([]);

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        setLoading(true);

        // If schedule data is passed from AllSchedules, use it
        if (schedule && busFromState) {
          setTrain({
            id: busFromState.id,
            trainName:
              schedule.train?.trainName ||
              busFromState.operator ||
              "Green Line Express",
            trainNumber: schedule.train?.trainNumber || "GL-001",
            totalSeats: schedule.train?.totalSeats || 50,
            departureTime: schedule.departureTime,
            arrivalTime: schedule.arrivalTime,
            ticketPrice: schedule.ticketPrice,
            availableSeats: schedule.availableSeats,
            startStation: schedule.train?.startStation || from,
            endStation: schedule.train?.endStation || to,
          });

          // Fetch booked seats for this schedule
          if (schedule._id) {
            try {
              const bookedRes = await bookingAPI.getBookedSeats(schedule._id);
              setBookedSeatNumbers(bookedRes.data?.bookedSeats || []);
            } catch (error) {
              console.error("Error fetching booked seats:", error);
              setBookedSeatNumbers([]);
            }
          }
        } else {
          // Fallback: Try to fetch from API
          const res = await busAPI.getBusById(busId);
          setTrain({
            id: busId,
            trainName: res.data?.operator || "Green Line Express",
            trainNumber: res.data?.trainNumber || "GL-001",
            totalSeats: res.data?.totalSeats || 50,
            departureTime: res.data?.departureTime || "08:00",
            arrivalTime: res.data?.arrivalTime || "20:30",
            ticketPrice: res.data?.price || 2500,
            availableSeats: res.data?.availableSeats || 50,
            startStation: from,
            endStation: to,
          });
        }
      } catch (error) {
        console.error("Error fetching train data:", error);
        // Fallback mock data
        setTrain({
          id: busId,
          trainName: "Green Line Express",
          trainNumber: "GL-001",
          totalSeats: 50,
          departureTime: "08:00",
          arrivalTime: "20:30",
          ticketPrice: 2500,
          availableSeats: 50,
          startStation: from,
          endStation: to,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainData();
  }, [busId, date, schedule, busFromState, from, to]);

  // Generate seat layout when train data is available
  useEffect(() => {
    if (train && train.totalSeats) {
      const layout = generateTrainSeatLayout(
        train.totalSeats,
        bookedSeatNumbers
      );
      setSeats(layout);
    }
  }, [train, bookedSeatNumbers]);

  /**
   * Calculate Duration between departure and arrival times
   */
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

  /**
   * Generate Train Seat Layout with Dynamic Booking Status
   *
   * Logic:
   * 1. Total seats = train.totalSeats (e.g., 50 for Green Line Express)
   * 2. Booked seats = bookedSeatNumbers array (from API)
   * 3. Available seats = Total - Booked
   * 4. Layout: 2-2 configuration (typical train coach)
   *    - Each row has 4 seats: A, B (left side), C, D (right side)
   *    - Aisle in between
   *
   * Example for 50 seats:
   * - 12 rows × 4 seats = 48 seats
   * - 1 row × 2 seats = 2 seats
   * - Total = 50 seats
   *
   * Dynamic Booking:
   * - bookedSeats array contains seat numbers (1-50) that are already booked
   * - When generating layout, check if seatNumber is in bookedSeats
   * - If yes, mark as available: false (red color)
   * - If no, mark as available: true (green color)
   */
  const generateTrainSeatLayout = (totalSeats, bookedSeats = []) => {
    const layout = [];
    const seatsPerRow = 4;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);

    let seatCounter = 1;

    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        // Stop if we've created all seats
        if (seatCounter > totalSeats) break;

        const seatNumber = seatCounter;
        const seatLetter =
          col === 1 ? "A" : col === 2 ? "B" : col === 3 ? "C" : "D";
        const seatLabel = `${row}${seatLetter}`;

        // Check if this seat is booked
        const isBooked = bookedSeats.includes(seatNumber);

        layout.push({
          id: seatNumber.toString(),
          number: seatLabel,
          seatNumber: seatNumber, // Numeric seat number (1-50)
          row,
          col,
          available: !isBooked,
          type: col <= 2 ? "window" : "aisle",
        });

        seatCounter++;
      }
    }

    return layout;
  };

  const toggleSeat = (seat) => {
    if (!seat.available) return;

    if (selectedSeats.find((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= passengers) {
        alert(`You can only select ${passengers} seat(s)`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const calculateTotal = () => {
    if (!train) return 0;
    return selectedSeats.length * train.ticketPrice;
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }
    if (selectedSeats.length !== passengers) {
      alert(`Please select ${passengers} seat(s)`);
      return;
    }

    // Debug: Log before navigation
    console.log(
      "BusDetails - Navigating to PassengerInfo with schedule:",
      schedule
    );
    console.log("BusDetails - Schedule _id before navigation:", schedule?._id);

    navigate("/passenger-info", {
      state: {
        bus: {
          id: train.id,
          operator: train.trainName,
          operatorLogo: "🚂",
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          duration: calculateDuration(train.departureTime, train.arrivalTime),
          price: train.ticketPrice,
          amenities: ["wifi", "ac", "charging"],
          busType: "Express",
          trainNumber: train.trainNumber,
        },
        selectedSeats,
        from: train.startStation,
        to: train.endStation,
        date,
        passengers,
        schedule: schedule, // Pass schedule to PassengerInfo
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Train not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Trip Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Train className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {train.trainName}
                </h2>
                <p className="text-gray-600">
                  Train Number: {train.trainNumber} • {train.totalSeats} Seats
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Route</p>
              <p className="text-lg font-semibold text-gray-800">
                {train.startStation}{" "}
                <ArrowRight className="inline w-4 h-4 mx-2" />{" "}
                {train.endStation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Departure</p>
              <p className="text-lg font-semibold text-gray-800">
                {train.departureTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Arrival</p>
              <p className="text-lg font-semibold text-gray-800">
                {train.arrivalTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Seats</p>
              <p className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {train.availableSeats || 0} / {train.totalSeats}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {date ? new Date(date).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700">Amenities:</p>
            <div className="flex items-center text-gray-600">
              <Wifi className="w-4 h-4 mr-1" />
              <span className="text-sm">WiFi</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Snowflake className="w-4 h-4 mr-1" />
              <span className="text-sm">AC</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Plug className="w-4 h-4 mr-1" />
              <span className="text-sm">Charging Port</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Your Seats
              </h3>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 mb-6 pb-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Booked</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-200 border-2 border-blue-600 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">Selected</span>
                </div>
              </div>

              {/* Engine/Driver Area */}
              <div className="text-center mb-4">
                <div className="inline-block bg-gradient-to-r from-gray-200 to-gray-300 px-8 py-3 rounded-lg">
                  <Train className="w-6 h-6 text-gray-700 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-700">Engine</p>
                </div>
              </div>

              {/* Train Seat Grid - 2-2 Layout */}
              <div className="space-y-3">
                {seats.length > 0 &&
                  Array.from(
                    { length: Math.max(...seats.map((s) => s.row)) },
                    (_, rowIndex) => {
                      const row = rowIndex + 1;
                      const rowSeats = seats.filter((s) => s.row === row);

                      return (
                        <div
                          key={row}
                          className="flex items-center justify-center gap-4"
                        >
                          {/* Row Number */}
                          <span className="w-8 text-sm font-medium text-gray-600 text-center">
                            {row}
                          </span>

                          {/* Left Side Seats (A, B) */}
                          <div className="flex gap-2">
                            {rowSeats
                              .filter((s) => s.col <= 2)
                              .map((seat) => {
                                const isSelected = selectedSeats.find(
                                  (s) => s.id === seat.id
                                );
                                return (
                                  <button
                                    key={seat.id}
                                    onClick={() => toggleSeat(seat)}
                                    disabled={!seat.available}
                                    className={`
                                      w-12 h-12 rounded-lg border-2 transition-all transform hover:scale-110
                                      ${
                                        !seat.available
                                          ? "bg-red-100 border-red-400 cursor-not-allowed opacity-60"
                                          : isSelected
                                          ? "bg-blue-500 border-blue-700 text-white shadow-lg scale-110"
                                          : "bg-green-100 border-green-500 hover:bg-green-200 hover:border-green-600"
                                      }
                                    `}
                                    title={`Seat ${seat.number} (${seat.seatNumber})`}
                                  >
                                    <span className="text-xs font-bold">
                                      {seat.number.slice(-1)}
                                    </span>
                                  </button>
                                );
                              })}
                          </div>

                          {/* Aisle */}
                          <div className="w-8 border-t-2 border-dashed border-gray-300"></div>

                          {/* Right Side Seats (C, D) */}
                          <div className="flex gap-2">
                            {rowSeats
                              .filter((s) => s.col > 2)
                              .map((seat) => {
                                const isSelected = selectedSeats.find(
                                  (s) => s.id === seat.id
                                );
                                return (
                                  <button
                                    key={seat.id}
                                    onClick={() => toggleSeat(seat)}
                                    disabled={!seat.available}
                                    className={`
                                      w-12 h-12 rounded-lg border-2 transition-all transform hover:scale-110
                                      ${
                                        !seat.available
                                          ? "bg-red-100 border-red-400 cursor-not-allowed opacity-60"
                                          : isSelected
                                          ? "bg-blue-500 border-blue-700 text-white shadow-lg scale-110"
                                          : "bg-green-100 border-green-500 hover:bg-green-200 hover:border-green-600"
                                      }
                                    `}
                                    title={`Seat ${seat.number} (${seat.seatNumber})`}
                                  >
                                    <span className="text-xs font-bold">
                                      {seat.number.slice(-1)}
                                    </span>
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>

              {/* Aisle indicator */}
              <div className="text-center mt-6 pt-4 border-t">
                <p className="text-sm text-gray-600 font-medium">Aisle</p>
              </div>
            </div>
          </div>

          {/* Fare Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Fare Breakdown
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Base Fare ({selectedSeats.length} seat
                    {selectedSeats.length !== 1 ? "s" : ""})
                  </span>
                  <span>
                    Rs. {selectedSeats.length * (train.ticketPrice || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax & Charges</span>
                  <span>
                    Rs.{" "}
                    {Math.round(
                      selectedSeats.length * (train.ticketPrice || 0) * 0.1
                    )}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600">
                    Rs. {calculateTotal() + Math.round(calculateTotal() * 0.1)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Selected Seats ({selectedSeats.length}/{passengers})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {seat.number}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={selectedSeats.length !== passengers}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition-colors
                  ${
                    selectedSeats.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : selectedSeats.length === passengers
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusDetails;
