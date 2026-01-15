import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Mail,
  MessageSquare,
  QrCode,
  Ticket,
} from "lucide-react";
import { bookingAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};

  // Handle nested booking object structure
  // Backend returns { message, booking }, so we need to extract the actual booking
  // Check if booking is nested: { booking: {...}, message: "..." }
  let booking = stateData.booking;
  if (booking && booking.booking) {
    // If booking has a nested 'booking' property, use that
    booking = booking.booking;
  }

  const { bus, selectedSeats, from, to, date, passengerInfo } = stateData;

  const [qrCode, setQrCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate("/");
      return;
    }

    // Debug: Log booking object
    console.log("BookingConfirmation - Full location.state:", location.state);
    console.log("BookingConfirmation - stateData.booking:", stateData.booking);
    console.log("BookingConfirmation - Extracted booking:", booking);
    console.log("BookingConfirmation - Booking _id:", booking?._id);
    console.log("BookingConfirmation - Booking id:", booking?.id);
    console.log(
      "BookingConfirmation - Booking keys:",
      booking ? Object.keys(booking) : []
    );

    // Check if booking is nested
    if (stateData.booking?.booking) {
      console.log("BookingConfirmation - Found nested booking object");
      console.log(
        "BookingConfirmation - Nested booking _id:",
        stateData.booking.booking._id
      );
    }

    // Generate QR code (in real app, this would come from backend)
    const bookingIdForQR = booking._id || booking.id || booking.bookingId;
    generateQRCode(bookingIdForQR);

    // Simulate email and SMS sending
    setTimeout(() => setEmailSent(true), 1000);
    setTimeout(() => setSmsSent(true), 2000);

    // Clear saved passenger info from localStorage after successful booking
    if (bus && selectedSeats && date) {
      const seatIds = selectedSeats.map((s) => s.id).join("-");
      const storageKey = `passengerInfo_${bus.id}_${seatIds}_${date}`;
      localStorage.removeItem(storageKey);
    }
  }, [booking, navigate, bus, selectedSeats, date]);

  const generateQRCode = (bookingId) => {
    // Simple QR code generation (in production, use a library like qrcode.react)
    // For now, we'll create a simple representation
    setQrCode(`QR-${bookingId}`);
  };

  const handleDownloadPDF = async () => {
    try {
      console.log("Full location.state:", location.state);
      console.log("Booking object:", booking);
      console.log(
        "Booking keys:",
        booking ? Object.keys(booking) : "booking is null"
      );

      // Handle nested booking structure
      // If booking has a 'booking' property, use that
      const actualBooking = booking?.booking || booking;

      // Try multiple ways to get booking ID
      const bookingId =
        actualBooking?._id ||
        actualBooking?.id ||
        actualBooking?.bookingId ||
        booking?._id ||
        booking?.id ||
        booking?.bookingId ||
        null;

      console.log("Actual booking:", actualBooking);
      console.log("Extracted booking ID:", bookingId);

      if (!bookingId) {
        console.error("Booking ID not found in booking object:", booking);
        alert("Booking ID not found. Please try again or contact support.");
        return;
      }

      // Convert to string if it's an object
      const bookingIdString = bookingId.toString
        ? bookingId.toString()
        : String(bookingId);
      console.log("Booking ID string:", bookingIdString);

      const response = await bookingAPI.downloadTicket(bookingIdString);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${bookingIdString.slice(-8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Download failed:", error);
      console.error("Error response:", error.response);
      alert(
        error.response?.data?.message ||
          "Download failed. Please try again later."
      );
    }
  };

  if (!booking) {
    return null;
  }

  // Get booking ID for display
  const bookingId =
    booking._id || booking.id || booking.bookingId || "BOOK-" + Date.now();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Your ticket has been booked successfully
          </p>
        </div>

        {/* Booking ID */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Booking ID / Ticket Number
          </p>
          <p className="text-3xl font-bold text-blue-600">{bookingId}</p>
        </div>

        {/* QR Code */}
        {/* <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <QrCode className="w-8 h-8 text-gray-600 mx-auto mb-4" />
          <div className="bg-gray-100 p-8 rounded-lg inline-block mb-4">
            <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">QR Code</p>
                <p className="text-sm font-mono text-gray-700">{qrCode}</p>
                <p className="text-xs text-gray-400 mt-2">Scan at boarding</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Trip Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Ticket className="w-5 h-5 mr-2" />
            Trip Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-semibold text-gray-800">
                {from} → {to}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bus Operator</p>
              <p className="font-semibold text-gray-800">{bus?.operator}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Departure Time</p>
              <p className="font-semibold text-gray-800">
                {bus?.departureTime}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Seats */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Selected Seats
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedSeats?.map((seat) => (
              <span
                key={seat.id}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
              >
                {seat.number}
              </span>
            ))}
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Passenger Details
          </h2>
          <div className="space-y-3">
            {passengerInfo?.map((passenger, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <p className="font-semibold text-gray-800">{passenger.name}</p>
                <p className="text-sm text-gray-600">
                  {passenger.gender} • Age: {passenger.age} • CNIC:{" "}
                  {passenger.cnic}
                </p>
                <p className="text-sm text-gray-600">
                  Phone: {passenger.phone} • Email: {passenger.email}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Confirmation Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail
                  className={`w-5 h-5 mr-3 ${
                    emailSent ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span className="text-gray-700">Email Confirmation</span>
              </div>
              {emailSent ? (
                <span className="text-green-600 font-semibold">Sent</span>
              ) : (
                <span className="text-gray-400">Sending...</span>
              )}
            </div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare
                  className={`w-5 h-5 mr-3 ${
                    smsSent ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span className="text-gray-700">SMS Confirmation</span>
              </div>
              {smsSent ? (
                <span className="text-green-600 font-semibold">Sent</span>
              ) : (
                <span className="text-gray-400">Sending...</span>
              )}
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Ticket className="w-5 h-5" />
            <span>View My Bookings</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
