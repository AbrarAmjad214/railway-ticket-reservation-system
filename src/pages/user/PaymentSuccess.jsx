import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { bookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");
  const [bookingCreated, setBookingCreated] = useState(false);
  const [createdBookings, setCreatedBookings] = useState([]);

  useEffect(() => {
    const createBookings = async () => {
      try {
        setLoading(true);

        console.log("PaymentSuccess: Starting booking creation process");
        console.log("Session ID:", sessionId);

        // Get booking data from localStorage
        const pendingBookingData = localStorage.getItem("pendingBooking");
        console.log(
          "Pending booking data from localStorage:",
          pendingBookingData
        );

        if (!pendingBookingData) {
          console.error("No booking data found in localStorage");
          console.log("All localStorage keys:", Object.keys(localStorage));
          setError("Booking data not found. Please contact support.");
          setLoading(false);
          return;
        }

        let bookingData;
        try {
          bookingData = JSON.parse(pendingBookingData);
          console.log("Parsed booking data:", bookingData);
        } catch (parseError) {
          console.error("Error parsing booking data:", parseError);
          setError("Invalid booking data format. Please contact support.");
          setLoading(false);
          return;
        }

        const {
          bus,
          selectedSeats,
          passengerInfo,
          schedule,
          from,
          to,
          date,
          scheduleId: savedScheduleId,
        } = bookingData;

        console.log("Extracted data:", {
          bus: bus?.operator || bus?.id,
          selectedSeatsCount: selectedSeats?.length,
          passengerInfoCount: passengerInfo?.length,
          schedule: schedule?._id || schedule?.id,
          savedScheduleId: savedScheduleId, // Explicitly saved scheduleId
          from,
          to,
          date,
        });

        console.log("Full schedule object from localStorage:", schedule);
        console.log("Saved scheduleId from localStorage:", savedScheduleId);

        if (!user) {
          setError("User not logged in. Please login and try again.");
          setLoading(false);
          return;
        }

        // Verify payment session (optional but recommended)
        try {
          const verifyRes = await fetch(
            `http://localhost:5000/api/payments/verify-session?session_id=${sessionId}`
          );
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            setDetails(verifyData);
          }
        } catch (e) {
          console.error("Payment verification error:", e);
          // Continue with booking creation even if verification fails
        }

        // Validate required data
        if (!bus) {
          console.error("Bus data missing");
          setError("Bus information missing. Please contact support.");
          setLoading(false);
          return;
        }

        if (!selectedSeats || selectedSeats.length === 0) {
          console.error("Selected seats missing");
          setError(
            "Selected seats information missing. Please contact support."
          );
          setLoading(false);
          return;
        }

        if (!passengerInfo || passengerInfo.length === 0) {
          console.error("Passenger info missing");
          setError("Passenger information missing. Please contact support.");
          setLoading(false);
          return;
        }

        // Create bookings for each passenger
        const bookings = [];
        const trainId = schedule?.train?._id || schedule?.train?.id || bus?.id;
        const scheduleId = schedule?._id || schedule?.id;

        console.log("Train ID:", trainId);
        console.log("Schedule ID (before fix):", scheduleId);
        console.log("Full Schedule object:", JSON.stringify(schedule, null, 2));
        console.log(
          "Schedule keys:",
          schedule ? Object.keys(schedule) : "schedule is null/undefined"
        );

        // Try multiple ways to get scheduleId
        let finalScheduleId = scheduleId;
        if (!finalScheduleId && schedule) {
          // Try different possible field names
          finalScheduleId =
            schedule._id ||
            schedule.id ||
            schedule.scheduleId ||
            (schedule.train && schedule.train.scheduleId) ||
            null;
        }

        // If still no scheduleId, use the explicitly saved scheduleId
        if (!finalScheduleId) {
          console.warn(
            "Schedule ID not found in schedule object, using saved scheduleId..."
          );
          // Use the explicitly saved scheduleId from bookingData
          finalScheduleId = savedScheduleId;
          console.log("Using saved scheduleId:", savedScheduleId);
        }

        // Final check: if still no scheduleId, try bookingData directly
        if (!finalScheduleId) {
          finalScheduleId =
            bookingData.scheduleId ||
            bookingData.schedule?._id ||
            bookingData.schedule?.id;
          console.log(
            "Final attempt - scheduleId from bookingData:",
            finalScheduleId
          );
        }

        // Last resort: if we have trainId and date, we could fetch schedule, but that's complex
        // For now, we'll require scheduleId to be present

        console.log("Final Schedule ID:", finalScheduleId);

        if (!trainId || !finalScheduleId) {
          console.error("Train or schedule ID missing", {
            trainId,
            scheduleId: finalScheduleId,
            scheduleObject: schedule,
            bookingDataKeys: Object.keys(bookingData),
          });
          setError(
            `Train or schedule information missing. Train ID: ${trainId}, Schedule ID: ${
              finalScheduleId || "undefined"
            }`
          );
          setLoading(false);
          return;
        }

        for (let i = 0; i < passengerInfo.length; i++) {
          const passenger = passengerInfo[i];
          const seat = selectedSeats[i];

          if (!seat || !passenger) {
            continue;
          }

          // Extract numeric seat number from seat object
          // seat.seatNumber is the numeric ID (1-50)
          // seat.number is the label like "1A", "2B", etc.
          let seatNumber;
          if (seat.seatNumber) {
            seatNumber = seat.seatNumber;
          } else if (seat.number) {
            // Extract number from "1A" -> 1, "12B" -> 12
            const match = seat.number.match(/^(\d+)/);
            seatNumber = match ? parseInt(match[1]) : i + 1;
          } else {
            seatNumber = i + 1;
          }

          try {
            const bookingPayload = {
              trainId: trainId,
              scheduleId: finalScheduleId, // Use the final scheduleId we found
              seatNumber: seatNumber,
              passengerName: passenger.name,
              passengerAge: parseInt(passenger.age) || 25,
            };

            console.log("Creating booking:", bookingPayload);
            const bookingRes = await bookingAPI.createBooking(bookingPayload);

            console.log("Booking response:", bookingRes);
            console.log("Booking response data:", bookingRes.data);

            // Backend returns { message, booking } structure
            const bookingData = bookingRes.data?.booking || bookingRes.data;

            console.log("Extracted booking data:", bookingData);
            console.log("Booking _id:", bookingData?._id);
            console.log("Booking id:", bookingData?.id);

            if (bookingData) {
              bookings.push(bookingData);
              console.log(`Booking created successfully for ${passenger.name}`);
              console.log("Pushed booking with _id:", bookingData._id);
            } else {
              console.error("No booking data in response:", bookingRes);
            }
          } catch (err) {
            console.error(
              `Error creating booking for passenger ${i + 1}:`,
              err
            );
            const errorMessage =
              err.response?.data?.message || err.message || "Unknown error";
            toast.error(
              `Failed to create booking for ${passenger.name}: ${errorMessage}`,
              {
                position: "top-right",
                autoClose: 5000,
              }
            );
          }
        }

        if (bookings.length > 0) {
          setBookingCreated(true);
          setCreatedBookings(bookings);

          // Clear pending booking data
          localStorage.removeItem("pendingBooking");

          toast.success("Bookings created successfully!", {
            position: "top-right",
            autoClose: 3000,
          });

          // Redirect to booking confirmation after 2 seconds
          setTimeout(() => {
            console.log(
              "Navigating to booking confirmation with booking:",
              bookings[0]
            );
            console.log("Booking _id:", bookings[0]?._id);
            console.log("Booking id:", bookings[0]?.id);

            navigate("/booking-confirmation", {
              state: {
                booking: bookings[0], // This should have _id from backend
                bus: bus,
                selectedSeats: selectedSeats,
                from: from,
                to: to,
                date: date,
                passengerInfo: passengerInfo,
              },
            });
          }, 2000);
        } else {
          setError(
            "Failed to create bookings. Please contact support with your payment ID."
          );
        }
      } catch (e) {
        console.error("Error creating bookings:", e);
        setError(
          "Payment successful but booking creation failed. Please contact support."
        );
        toast.error("Booking creation failed. Please contact support.", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      createBookings();
    } else {
      setError("Payment session ID not found.");
      setLoading(false);
    }
  }, [sessionId, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border">
        {loading ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-800">
                Processing Your Booking...
              </h1>
            </div>
            <p className="text-gray-600 mb-6">
              Please wait while we create your booking.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Creating bookings...</span>
              </div>
            </div>
          </>
        ) : bookingCreated ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Booking Confirmed!
              </h1>
            </div>
            <p className="text-gray-600 mb-6">
              Your payment has been completed and bookings have been created
              successfully.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-green-800 font-semibold mb-2">
                ✓ {createdBookings.length} booking(s) created successfully
              </p>
              <p className="text-xs text-green-700">
                Redirecting to booking confirmation...
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              {error ? (
                <AlertCircle className="w-10 h-10 text-orange-600" />
              ) : (
                <CheckCircle className="w-10 h-10 text-green-600" />
              )}
              <h1 className="text-2xl font-bold text-gray-800">
                {error ? "Payment Received" : "Payment Successful"}
              </h1>
            </div>
            <p className="text-gray-600 mb-6">
              {error
                ? "Your payment was successful, but there was an issue creating your booking."
                : "Thanks! Your payment has been completed successfully."}
            </p>

            <div className="bg-gray-50 border rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Session ID:</span>{" "}
                <span className="font-mono break-all">
                  {sessionId || "N/A"}
                </span>
              </p>

              {details && (
                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-semibold">Amount:</span>{" "}
                    {details?.amount || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Currency:</span>{" "}
                    {details?.currency || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {details?.status || "-"}
                  </p>
                </div>
              )}

              {error && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800 font-semibold mb-1">
                    ⚠️ Booking Creation Failed
                  </p>
                  <p className="text-xs text-orange-700">{error}</p>
                  <p className="text-xs text-orange-600 mt-2">
                    Please contact support with your Session ID for assistance.
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                to="/"
                className="flex-1 text-center py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition"
              >
                Go to Home
              </Link>

              <Link
                to="/my-bookings"
                className="flex-1 text-center py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition"
              >
                View Bookings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
