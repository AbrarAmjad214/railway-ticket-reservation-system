import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Eye,
  Download,
  X,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { busBookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Footer } from "../../components/layout";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await busBookingAPI.getUserBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      // Mock data for demo
      setBookings([
        {
          id: 1,
          bookingId: "BOOK-12345",
          from: "Karachi",
          to: "Lahore",
          date: new Date().toISOString(),
          departureTime: "08:00",
          arrivalTime: "20:30",
          busOperator: "Daewoo Express",
          seats: ["1A", "1B"],
          status: "confirmed",
          totalAmount: 5500,
        },
        {
          id: 2,
          bookingId: "BOOK-12346",
          from: "Islamabad",
          to: "Karachi",
          date: new Date(Date.now() + 86400000).toISOString(),
          departureTime: "10:00",
          arrivalTime: "22:00",
          busOperator: "Faisal Movers",
          seats: ["5C"],
          status: "pending",
          totalAmount: 2200,
        },
        {
            id: 1,
            bookingId: "BOOK-12345",
            from: "Karachi",
            to: "Lahore",
            date: new Date().toISOString(),
            departureTime: "08:00",
            arrivalTime: "20:30",
            busOperator: "Daewoo Express",
            seats: ["1A", "1B"],
            status: "confirmed",
            totalAmount: 5500,
          },
          {
            id: 2,
            bookingId: "BOOK-12346",
            from: "Islamabad",
            to: "Karachi",
            date: new Date(Date.now() + 86400000).toISOString(),
            departureTime: "10:00",
            arrivalTime: "22:00",
            busOperator: "Faisal Movers",
            seats: ["5C"],
            status: "pending",
            totalAmount: 2200,
          },
          {
            id: 1,
            bookingId: "BOOK-12345",
            from: "Karachi",
            to: "Lahore",
            date: new Date().toISOString(),
            departureTime: "08:00",
            arrivalTime: "20:30",
            busOperator: "Daewoo Express",
            seats: ["1A", "1B"],
            status: "confirmed",
            totalAmount: 5500,
          },
          {
            id: 2,
            bookingId: "BOOK-12346",
            from: "Islamabad",
            to: "Karachi",
            date: new Date(Date.now() + 86400000).toISOString(),
            departureTime: "10:00",
            arrivalTime: "22:00",
            busOperator: "Faisal Movers",
            seats: ["5C"],
            status: "pending",
            totalAmount: 2200,
          },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (booking) => {
    navigate(`/ticket/${booking.id}`, { state: { booking } });
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      const response = await busBookingAPI.downloadTicket(bookingId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again later.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await busBookingAPI.cancelBooking(bookingId);
      fetchBookings();
      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Cancellation failed:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Ticket className="w-8 h-8 mr-3" />
            My Bookings
          </h1>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Book a Ticket
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {booking.from} → {booking.to}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Booking ID: {booking.bookingId}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {booking.departureTime} - {booking.arrivalTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{booking.busOperator}</span>
                      </div>
                      <div className="text-gray-600">
                        <span className="text-sm">Seats: </span>
                        <span className="font-semibold">
                          {booking.seats.join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-800">
                      <span className="font-semibold">Total Amount: </span>
                      <span className="text-blue-600">
                        Rs. {booking.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleViewTicket(booking)}
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Ticket</span>
                    </button>
                    <button
                      onClick={() => handleDownloadTicket(booking.id)}
                      className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    {booking.status === "confirmed" ||
                    booking.status === "pending" ? (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;
