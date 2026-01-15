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
  AlertTriangle,
} from "lucide-react";
import { bookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Footer } from "../../components/layout";
import { toast } from "react-toastify";

const MyBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSameDateModal, setShowSameDateModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings();
      console.log("Bookings response:", response.data);
      // Backend returns array directly, not wrapped in data
      setBookings(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (booking) => {
    navigate(`/ticket/${booking._id}`, { state: { booking } });
  };

  const handleDownloadTicket = async (bookingId) => {
    try {
      const response = await bookingAPI.downloadTicket(bookingId);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Ticket downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Download failed. Please try again later.");
    }
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const bookingDate = new Date(dateString);
    const today = new Date();

    // Set time to midnight for both dates to compare only dates
    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return bookingDate.getTime() === today.getTime();
  };

  const isPastDate = (dateString) => {
    if (!dateString) return false;
    const bookingDate = new Date(dateString);
    const today = new Date();

    // Set time to midnight for both dates
    bookingDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return bookingDate.getTime() < today.getTime();
  };

  const handleCancelClick = (booking) => {
    const bookingDate = booking.schedule?.date;

    // Check if booking is for today
    if (isToday(bookingDate)) {
      setBookingToCancel(booking);
      setShowSameDateModal(true);
      return;
    }

    // Check if booking is for past date
    if (isPastDate(bookingDate)) {
      toast.error("Cannot cancel past bookings");
      return;
    }

    // Future booking - show confirmation modal
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      await bookingAPI.cancelBooking(bookingToCancel._id);
      toast.success("Booking cancelled successfully");
      setShowCancelModal(false);
      setBookingToCancel(null);
      fetchBookings();
    } catch (error) {
      console.error("Cancellation failed:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleCancelClose = () => {
    setShowCancelModal(false);
    setShowSameDateModal(false);
    setBookingToCancel(null);
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
            {bookings?.map((booking) => {
              const bookingDate = booking.schedule?.date;
              const isBookingToday = isToday(bookingDate);
              const isBookingPast = isPastDate(bookingDate);

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {booking.train?.startStation || "N/A"} →{" "}
                            {booking.train?.endStation || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Booking ID: {booking._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Train: {booking.train?.trainName || "N/A"} (
                            {booking.train?.trainNumber || "N/A"})
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {bookingDate
                              ? new Date(bookingDate).toLocaleDateString()
                              : "N/A"}
                            {isBookingToday && (
                              <span className="ml-1 text-orange-600 font-semibold">
                                (Today)
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            {booking.schedule?.departureTime || "N/A"} -{" "}
                            {booking.schedule?.arrivalTime || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Seat: {booking.seatNumber}
                          </span>
                        </div>
                        <div className="text-gray-600">
                          <span className="text-sm">Passenger: </span>
                          <span className="font-semibold">
                            {booking.passengerName} ({booking.passengerAge} yrs)
                          </span>
                        </div>
                      </div>

                      <div className="text-gray-800">
                        <span className="font-semibold">Ticket Price: </span>
                        <span className="text-blue-600">
                          Rs.{" "}
                          {booking.schedule?.ticketPrice?.toLocaleString() ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="text-gray-600 text-sm mt-2">
                        Payment Status:{" "}
                        <span
                          className={`font-semibold ${
                            booking.paymentStatus === "paid"
                              ? "text-green-600"
                              : booking.paymentStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {booking.paymentStatus?.toUpperCase() || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {booking.bookingStatus === "confirmed" && (
                        <button
                          onClick={() => handleCancelClick(booking)}
                          className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      {booking.bookingStatus === "confirmed" && (
                        <button
                          onClick={() => handleDownloadTicket(booking._id)}
                          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal (for future bookings) */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Cancel Booking
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">
                    {bookingToCancel._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Train:</span>
                  <span className="font-medium">
                    {bookingToCancel.train?.trainName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {bookingToCancel.schedule?.date
                      ? new Date(
                          bookingToCancel.schedule.date
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium">
                    {bookingToCancel.seatNumber || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Same Date Modal (for today's bookings) */}
      {showSameDateModal && bookingToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Cannot Cancel Today's Booking
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Aaj ki booking cancel nahi ho sakti. Sirf future bookings cancel
              ki ja sakti hain.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-medium">
                    {bookingToCancel._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-orange-600">
                    {bookingToCancel.schedule?.date
                      ? new Date(
                          bookingToCancel.schedule.date
                        ).toLocaleDateString()
                      : "N/A"}{" "}
                    (Today)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Train:</span>
                  <span className="font-medium">
                    {bookingToCancel.train?.trainName || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCancelClose}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              OK, I Understand
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyBookings;
