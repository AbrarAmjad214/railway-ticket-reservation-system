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
import { busBookingAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, bus, selectedSeats, from, to, date, passengerInfo } =
    location.state || {};

  const [qrCode, setQrCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate("/");
      return;
    }

    // Generate QR code (in real app, this would come from backend)
    generateQRCode(booking.bookingId || booking.id);

    // Simulate email and SMS sending
    setTimeout(() => setEmailSent(true), 1000);
    setTimeout(() => setSmsSent(true), 2000);
  }, [booking, navigate]);

  const generateQRCode = (bookingId) => {
    // Simple QR code generation (in production, use a library like qrcode.react)
    // For now, we'll create a simple representation
    setQrCode(`QR-${bookingId}`);
  };

  const handleDownloadPDF = async () => {
    try {
      if (booking.id) {
        const response = await busBookingAPI.downloadTicket(booking.id);
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `ticket-${booking.bookingId || booking.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Download feature will be available after booking confirmation");
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again later.");
    }
  };

  if (!booking) {
    return null;
  }

  const bookingId = booking.bookingId || booking.id || "BOOK-" + Date.now();

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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
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
        </div>

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
            <div className="flex items-center justify-between">
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
            </div>
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
