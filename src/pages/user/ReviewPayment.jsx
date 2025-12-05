import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Smartphone,
  Apple,
  Lock,
  ArrowLeft,
  Tag,
} from "lucide-react";
import { busBookingAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const ReviewPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, selectedSeats, from, to, date, passengers, passengerInfo } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  if (!bus || !selectedSeats || !passengerInfo) {
    navigate("/");
    return null;
  }

  const baseFare = selectedSeats.length * bus.price;
  const tax = Math.round(baseFare * 0.1);
  const subtotal = baseFare + tax;
  const total = subtotal - discount;

  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === "FIRST20") {
      setDiscount(Math.round(subtotal * 0.2));
      alert("Promo code applied! 20% discount");
    } else if (promoCode.toUpperCase() === "STUDENT15") {
      setDiscount(Math.round(subtotal * 0.15));
      alert("Promo code applied! 15% discount");
    } else if (promoCode) {
      alert("Invalid promo code");
      setPromoCode("");
    }
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const bookingData = {
        busId: bus.id,
        from,
        to,
        date,
        seats: selectedSeats.map((s) => s.number),
        passengers: passengerInfo,
        paymentMethod,
        totalAmount: total,
        promoCode: promoCode || undefined,
      };

      const response = await busBookingAPI.createBooking(bookingData);

      navigate("/booking-confirmation", {
        state: {
          booking: response.data,
          bus,
          selectedSeats,
          from,
          to,
          date,
          passengerInfo,
        },
      });
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Review & Payment
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trip Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Route</span>
                  <span className="font-semibold text-gray-800">
                    {from} → {to}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bus Operator</span>
                  <span className="font-semibold text-gray-800">
                    {bus.operator}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure</span>
                  <span className="font-semibold text-gray-800">
                    {bus.departureTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Arrival</span>
                  <span className="font-semibold text-gray-800">
                    {bus.arrivalTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Selected Seats
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Passenger Details
              </h2>
              <div className="space-y-3">
                {passengerInfo.map((passenger, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <p className="font-semibold text-gray-800">
                      {passenger.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {passenger.gender} • Age: {passenger.age} • CNIC:{" "}
                      {passenger.cnic}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    Credit/Debit Card
                  </span>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="jazzcash"
                    checked={paymentMethod === "jazzcash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Smartphone className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    JazzCash / Easypaisa
                  </span>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <Apple className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    Apple Pay / Google Pay
                  </span>
                </label>
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Payment Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Base Fare ({selectedSeats.length} seat
                    {selectedSeats.length !== 1 ? "s" : ""})
                  </span>
                  <span>Rs. {baseFare}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax & Charges</span>
                  <span>Rs. {tax}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {discount}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600">Rs. {total}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing}
                className={`
                  w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2
                  ${
                    processing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }
                `}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay Now</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewPayment;
