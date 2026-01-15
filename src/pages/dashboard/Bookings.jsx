import { useState, useEffect } from "react";
import { bookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  User,
  Train,
  CheckCircle,
  X,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAllBookings();
      console.log("Bookings API Response:", response);
      // Backend returns array directly, axios wraps it in response.data
      const bookingsData = response.data || [];
      console.log("Bookings Data:", bookingsData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
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
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleCancelClose = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600 mt-2">
            View and manage all train ticket bookings
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Passenger
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Train className="w-4 h-4 text-orange-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.train?.trainName || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {booking.train?.startStation || "N/A"} →{" "}
                            {booking.train?.endStation || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {booking.schedule?.date
                            ? new Date(booking.schedule.date).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {booking.schedule?.departureTime || "N/A"} -{" "}
                          {booking.schedule?.arrivalTime || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{booking.passengerName || "N/A"}</div>
                        <div className="text-gray-500">
                          Age: {booking.passengerAge || "N/A"} | Seat:{" "}
                          {booking.seatNumber || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs. {booking.schedule?.ticketPrice || 0}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : booking.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.paymentStatus || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(booking.bookingStatus)}
                        <span
                          className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                            booking.bookingStatus
                          )}`}
                        >
                          {booking.bookingStatus
                            ? booking.bookingStatus.charAt(0).toUpperCase() +
                              booking.bookingStatus.slice(1)
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {booking.bookingStatus === "confirmed" && (
                        <button
                          onClick={() => handleCancelClick(booking)}
                          className="text-red-600 hover:text-red-900 px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel Booking"
                        >
                          Cancel
                        </button>
                      )}
                      {booking.bookingStatus === "cancelled" && (
                        <span className="text-xs text-gray-400">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bookings found
                    </h3>
                    <p className="text-gray-600">
                      There are no bookings in the system yet
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Cancel Booking</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking?
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Booking ID:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {bookingToCancel._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {bookingToCancel.user?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Train:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {bookingToCancel.train?.trainName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Seat:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {bookingToCancel.seatNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Rs. {bookingToCancel.schedule?.ticketPrice || 0}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                This action cannot be undone. The seat will be released and the user will be notified.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCancelClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
