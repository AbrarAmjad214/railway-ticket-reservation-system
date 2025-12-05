import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Clock, Wifi, Snowflake, Plug, ArrowRight, Users } from "lucide-react";
import { busAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const BusDetails = () => {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { from, to, date, passengers } = location.state || {};

  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bus details
    busAPI
      .getBusById(busId)
      .then((res) => {
        setBus(res.data);
        return busAPI.getAvailableSeats(busId, date);
      })
      .then((res) => {
        setSeats(res.data || generateSeatLayout());
        setLoading(false);
      })
      .catch(() => {
        // Mock data
        setBus({
          id: busId,
          operator: "Daewoo Express",
          operatorLogo: "🚌",
          departureTime: "08:00",
          arrivalTime: "20:30",
          duration: "12h 30m",
          seatType: "AC",
          price: 2500,
          amenities: ["wifi", "ac", "charging"],
          busType: "Luxury",
          from,
          to,
        });
        setSeats(generateSeatLayout());
        setLoading(false);
      });
  }, [busId, date]);

  const generateSeatLayout = () => {
    // Generate a 2-2 seat layout (typical bus layout)
    const layout = [];
    const rows = 15;
    const seatsPerRow = 4;

    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        const seatNumber = `${row}${
          col === 1 ? "A" : col === 2 ? "B" : col === 3 ? "C" : "D"
        }`;
        layout.push({
          id: seatNumber,
          number: seatNumber,
          row,
          col,
          available: Math.random() > 0.3, // 70% available
          type: col <= 2 ? "window" : "aisle",
        });
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
    if (!bus) return 0;
    return selectedSeats.length * bus.price;
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

    navigate("/passenger-info", {
      state: {
        bus,
        selectedSeats,
        from,
        to,
        date,
        passengers,
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

  if (!bus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Bus not found
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
              <span className="text-4xl mr-4">{bus.operatorLogo}</span>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {bus.operator}
                </h2>
                <p className="text-gray-600">
                  {bus.busType} • {bus.seatType}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Route</p>
              <p className="text-lg font-semibold text-gray-800">
                {from} <ArrowRight className="inline w-4 h-4 mx-2" /> {to}
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
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700">Amenities:</p>
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
                <span className="text-sm">Charging Port</span>
              </div>
            )}
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

              {/* Driver Area */}
              <div className="text-center mb-4">
                <div className="inline-block bg-gray-200 px-8 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Driver</p>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="space-y-2">
                {seats.length > 0 &&
                  Array.from(
                    { length: Math.max(...seats.map((s) => s.row)) },
                    (_, rowIndex) => {
                      const row = rowIndex + 1;
                      const rowSeats = seats.filter((s) => s.row === row);
                      const maxRow = Math.max(...seats.map((s) => s.row));
                      return (
                        <div
                          key={row}
                          className="flex items-center justify-center space-x-2"
                        >
                          <span className="w-8 text-sm font-medium text-gray-600">
                            {row}
                          </span>
                          <div className="flex space-x-2">
                            {rowSeats.map((seat) => {
                              const isSelected = selectedSeats.find(
                                (s) => s.id === seat.id
                              );
                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => toggleSeat(seat)}
                                  disabled={!seat.available}
                                  className={`
                                w-10 h-10 rounded border-2 transition-all
                                ${
                                  !seat.available
                                    ? "bg-gray-300 border-gray-400 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-blue-200 border-blue-600"
                                    : "bg-green-100 border-green-500 hover:bg-green-200"
                                }
                              `}
                                  title={seat.number}
                                >
                                  <span className="text-xs font-medium">
                                    {seat.number.slice(-1)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          {row === Math.floor(maxRow / 2) && (
                            <div className="w-16"></div>
                          )}
                        </div>
                      );
                    }
                  )}
              </div>

              {/* Aisle indicator */}
              <div className="text-center mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Aisle</p>
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
                  <span>Rs. {selectedSeats.length * bus.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax & Charges</span>
                  <span>
                    Rs. {Math.round(selectedSeats.length * bus.price * 0.1)}
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
                    selectedSeats.length === passengers
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
