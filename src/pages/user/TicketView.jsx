import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  QrCode,
  Download,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { busBookingAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const TicketView = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const [ticketData, setTicketData] = useState(booking);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (booking) {
      return;
    }

    // Fetch booking details
    busBookingAPI
      .getBookingById(bookingId)
      .then((res) => {
        setTicketData(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Mock data
        setTicketData({
          id: bookingId,
          bookingId: `BOOK-${bookingId}`,
          from: "Karachi",
          to: "Lahore",
          date: new Date().toISOString(),
          departureTime: "08:00",
          arrivalTime: "20:30",
          busOperator: "Daewoo Express",
          seats: ["1A", "1B"],
          passengers: [
            {
              name: "John Doe",
              age: 30,
              cnic: "12345-1234567-1",
              phone: "0300-1234567",
              email: "john@example.com",
            },
          ],
          pickupAddress: "Karachi Bus Terminal, Saddar",
          dropoffAddress: "Lahore Bus Terminal, Thokar Niaz Baig",
          totalAmount: 5500,
        });
        setLoading(false);
      });
  }, [bookingId, booking]);

  const handleDownloadPDF = async () => {
    try {
      const response = await busBookingAPI.downloadTicket(ticketData.id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${ticketData.bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Ticket not found
          </h2>
          <button
            onClick={() => navigate("/my-bookings")}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back to bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => navigate("/my-bookings")}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </button>

        {/* Ticket Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 border-2 border-blue-200">
          {/* Header */}
          <div className="text-center mb-6 pb-6 border-b">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bus Ticket
            </h1>
            <p className="text-lg text-gray-600">
              Booking ID: {ticketData.bookingId}
            </p>
          </div>

          {/* QR Code */}
          <div className="text-center mb-6">
            <QrCode className="w-8 h-8 text-gray-600 mx-auto mb-4" />
            <div className="bg-gray-100 p-8 rounded-lg inline-block">
              <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">QR Code</p>
                  <p className="text-sm font-mono text-gray-700">
                    QR-{ticketData.bookingId}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Scan at boarding</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Route Details
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">From</p>
                  <p className="font-semibold text-gray-800">
                    {ticketData.from}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticketData.pickupAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">To</p>
                  <p className="font-semibold text-gray-800">{ticketData.to}</p>
                  <p className="text-xs text-gray-500">
                    {ticketData.dropoffAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Travel Details
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(ticketData.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Departure</p>
                  <p className="font-semibold text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {ticketData.departureTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Arrival</p>
                  <p className="font-semibold text-gray-800 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {ticketData.arrivalTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Operator */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Bus Operator</h3>
            <p className="text-gray-800">{ticketData.busOperator}</p>
          </div>

          {/* Seats */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Selected Seats</h3>
            <div className="flex flex-wrap gap-2">
              {ticketData.seats?.map((seat, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          {/* Passenger Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Passenger Details
            </h3>
            <div className="space-y-3">
              {ticketData.passengers?.map((passenger, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  <p className="font-semibold text-gray-800">
                    {passenger.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Age: {passenger.age} • CNIC: {passenger.cnic}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    <span className="mr-4">{passenger.phone}</span>
                    <Mail className="w-4 h-4 mr-1" />
                    <span>{passenger.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-blue-600">
              Rs. {ticketData.totalAmount}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketView;
