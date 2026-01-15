import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  ArrowLeft,
  Tag,
  MapPin,
  Calendar,
  Clock,
  Users,
  Bus,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

function ReviewPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);

  const stripePromise = loadStripe(import.meta.env.NEXT_STRIPE_PUBLISHABLE_KEY);

  // Get data from location.state (passed from PassengerInfo)
  const {
    bus,
    selectedSeats,
    from,
    to,
    date,
    passengerInfo,
    schedule: scheduleFromState,
  } = location.state || {};

  // Debug: Log schedule from location.state
  useEffect(() => {
    console.log(
      "ReviewPayment - Schedule from location.state:",
      scheduleFromState
    );
    console.log("ReviewPayment - Schedule _id:", scheduleFromState?._id);
    console.log("ReviewPayment - Full location.state:", location.state);
  }, [scheduleFromState, location.state]);

  useEffect(() => {
    // Redirect to home if required data is missing
    if (
      !bus ||
      !selectedSeats ||
      !selectedSeats.length ||
      !passengerInfo ||
      !passengerInfo.length
    ) {
      navigate("/");
    }
  }, [bus, selectedSeats, passengerInfo, navigate]);

  // Return null if data is not available (will redirect)
  if (
    !bus ||
    !selectedSeats ||
    !selectedSeats.length ||
    !passengerInfo ||
    !passengerInfo.length
  ) {
    return null;
  }

  // Format time for display (handle both "08:00" and "08:00 AM" formats)
  const formatTime = (time) => {
    if (!time) return "N/A";
    // If already formatted with AM/PM, return as is
    if (time.includes("AM") || time.includes("PM")) return time;
    // Otherwise, try to format it
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const baseFare = selectedSeats.length * (bus.price || 0);
  const tax = Math.round(baseFare * 0.1);
  const subtotal = baseFare + tax;
  const total = subtotal - discount;

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "FIRST20") {
      setDiscount(Math.round(subtotal * 0.2));
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === "STUDENT15") {
      setDiscount(Math.round(subtotal * 0.15));
      setPromoApplied(true);
    } else if (promoCode) {
      alert("Invalid promo code");
      setPromoCode("");
      setPromoApplied(false);
    }
  };

  const handleContinueToPayment = async () => {
    try {
      setProcessing(true);

      // Save booking data to localStorage for payment success page
      // Use schedule from state (already extracted above)
      const schedule = scheduleFromState || location.state?.schedule;

      // If schedule is still not found, log error
      if (!schedule) {
        console.error(
          "CRITICAL: Schedule object is missing from location.state!"
        );
        console.error("location.state:", location.state);
        console.error("scheduleFromState:", scheduleFromState);
        toast.error(
          "Schedule information is missing. Please try booking again from the beginning."
        );
        setProcessing(false);
        return;
      }

      console.log("Schedule from location.state:", schedule);
      console.log("Schedule _id:", schedule?._id);
      console.log("Schedule id:", schedule?.id);
      console.log(
        "Schedule keys:",
        schedule ? Object.keys(schedule) : "schedule is null/undefined"
      );

      // Extract scheduleId explicitly to ensure it's preserved
      const scheduleId = schedule?._id || schedule?.id || null;

      if (!scheduleId) {
        console.error(
          "WARNING: Schedule ID is missing! Schedule object:",
          schedule
        );
        toast.error("Schedule information is missing. Please try again.");
        return;
      }

      const bookingData = {
        bus,
        from,
        to,
        date,
        selectedSeats,
        passengerInfo,
        pricing: { baseFare, tax, discount, total },
        schedule: schedule, // Full schedule object
        scheduleId: scheduleId, // Explicitly save scheduleId as backup
      };

      console.log("Saving booking data to localStorage:", {
        busId: bus?.id,
        scheduleId: scheduleId,
        scheduleHasId: !!(schedule?._id || schedule?.id),
        scheduleObjectKeys: schedule ? Object.keys(schedule) : [],
        scheduleObject: schedule, // Log full schedule object
      });

      // Verify schedule object before saving
      if (!schedule || !scheduleId) {
        console.error(
          "ERROR: Schedule or scheduleId is missing before saving!"
        );
        console.error("Schedule:", schedule);
        console.error("ScheduleId:", scheduleId);
        toast.error(
          "Schedule information is missing. Please try again from the beginning."
        );
        return;
      }

      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
      console.log("Booking data saved successfully");

      // Verify it was saved correctly
      const verifySaved = localStorage.getItem("pendingBooking");
      if (verifySaved) {
        const parsed = JSON.parse(verifySaved);
        console.log("Verification - Saved scheduleId:", parsed.scheduleId);
        console.log("Verification - Saved schedule _id:", parsed.schedule?._id);
      }

      // Verify data was saved
      const savedData = localStorage.getItem("pendingBooking");
      if (!savedData) {
        console.error("Failed to save booking data to localStorage");
        toast.error("Failed to save booking data. Please try again.");
        return;
      }

      const payload = {
        bus,
        from,
        to,
        date,
        selectedSeats,
        passengerInfo,
        pricing: { baseFare, tax, discount, total },
        promoCode: promoApplied ? promoCode : null,
      };

      console.log("Creating Stripe checkout session with payload:", payload);

      const res = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Payment session creation failed:", data);
        toast.error(data?.message || "Failed to start payment");
        // Don't remove localStorage on error - keep data for retry
        return;
      }

      console.log("Stripe session created successfully:", data);

      // Option A: Stripe returns a URL (recommended)
      if (data?.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        window.location.href = data.url;
        return;
      }

      // Option B: If you return sessionId instead
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error("Error in handleContinueToPayment:", err);
      toast.error("Something went wrong while creating payment session.");
      // Don't remove localStorage on error - keep data for retry
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Review Your Booking
          </h1>
          <p className="text-gray-600">
            Please review your details before proceeding to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <Bus className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">
                    Trip Details
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Route</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {from} → {to}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Travel Date</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Bus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Bus Operator</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {bus.operator || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-indigo-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Departure</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTime(bus.departureTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Arrival</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTime(bus.arrivalTime)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Selected Seats
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedSeats.map((seat, idx) => (
                  <div key={seat.id} className="relative group">
                    <div className="px-5 py-3 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-md group-hover:shadow-lg transition-all">
                      {seat.number}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Total {selectedSeats.length} seats selected
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Passenger Details
                </h2>
              </div>
              <div className="space-y-4">
                {passengerInfo.map((p, i) => (
                  <div
                    key={p.id || i}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-lg mb-2">
                          {p.name || "N/A"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span>
                            <span className="font-medium">Gender:</span>{" "}
                            {p.gender
                              ? p.gender.charAt(0).toUpperCase() +
                                p.gender.slice(1)
                              : "N/A"}
                          </span>
                          <span>
                            <span className="font-medium">Age:</span>{" "}
                            {p.age || "N/A"}
                          </span>
                          <span>
                            <span className="font-medium">CNIC:</span>{" "}
                            {p.cnic || "N/A"}
                          </span>
                          {p.phone && (
                            <span>
                              <span className="font-medium">Phone:</span>{" "}
                              {p.phone}
                            </span>
                          )}
                          {p.email && (
                            <span>
                              <span className="font-medium">Email:</span>{" "}
                              {p.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <CreditCard className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Secure Payment with Stripe
                  </h3>
                  <p className="text-gray-600 mb-3">
                    You will be redirected to Stripe secure payment page to
                    complete your transaction.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span>
                      256-bit SSL encryption ensures your payment is safe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Payment Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    Base Fare ({selectedSeats.length} × Rs. {bus.price || 0})
                  </span>
                  <span className="font-semibold">
                    Rs. {baseFare.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax & Service (10%)</span>
                  <span className="font-semibold">
                    Rs. {tax.toLocaleString()}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Discount Applied</span>
                    </div>
                    <span className="font-bold">-Rs. {discount}</span>
                  </div>
                )}

                <div className="border-t-2 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">
                    Total Amount
                  </span>
                  <span className="text-3xl font-bold text-indigo-600">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Tag className="w-5 h-5 text-orange-600" />
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={promoApplied}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono uppercase ${
                      promoApplied
                        ? "bg-gray-100 text-gray-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    disabled={promoApplied || !promoCode}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      promoApplied
                        ? "bg-green-500 text-white cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                    }`}
                  >
                    {promoApplied ? "Applied" : "Apply"}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Promo code applied successfully!
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Try: FIRST20 or STUDENT15
                </p>
              </div>

              <button
                onClick={handleContinueToPayment}
                disabled={processing}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 ${
                  processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transform hover:scale-105"
                }`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6" />
                    <span>Continue to Pay</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Your payment is 100% secure</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Protected by Stripe Payment Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPayment;
