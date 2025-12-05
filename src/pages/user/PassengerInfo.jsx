import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { User, Phone, Mail, CreditCard, Plus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Footer } from "../../components/layout";

const PassengerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bus, selectedSeats, from, to, date, passengers } =
    location.state || {};

  const [passengerForms, setPassengerForms] = useState([]);

  useEffect(() => {
    if (!bus || !selectedSeats || selectedSeats.length === 0) {
      navigate("/");
      return;
    }

    // Initialize passenger forms
    const initialForms = Array.from({ length: passengers }, (_, index) => ({
      id: index + 1,
      name: user?.name || "",
      gender: "",
      age: "",
      cnic: "",
      phone: user?.phone || "",
      email: user?.email || "",
    }));
    setPassengerForms(initialForms);
  }, [bus, selectedSeats, passengers, user, navigate]);

  const updatePassenger = (index, field, value) => {
    const updated = [...passengerForms];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerForms(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all forms
    for (const form of passengerForms) {
      if (
        !form.name ||
        !form.gender ||
        !form.age ||
        !form.cnic ||
        !form.phone ||
        !form.email
      ) {
        alert("Please fill all fields for all passengers");
        return;
      }
      if (!/^\d{13}$/.test(form.cnic.replace(/-/g, ""))) {
        alert("Please enter a valid 13-digit CNIC");
        return;
      }
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
        alert("Please enter a valid email address");
        return;
      }
    }

    navigate("/review-payment", {
      state: {
        bus,
        selectedSeats,
        from,
        to,
        date,
        passengers,
        passengerInfo: passengerForms,
      },
    });
  };

  if (!bus || !selectedSeats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Passenger Information
        </h1>

        {/* Selected Seats Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

        <form onSubmit={handleSubmit}>
          {passengerForms.map((passenger, index) => (
            <div
              key={passenger.id}
              className="bg-white rounded-lg shadow-md p-6 mb-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Passenger {index + 1} - Seat {selectedSeats[index]?.number}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={passenger.name}
                    onChange={(e) =>
                      updatePassenger(index, "name", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={passenger.gender}
                    onChange={(e) =>
                      updatePassenger(index, "gender", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={passenger.age}
                    onChange={(e) =>
                      updatePassenger(index, "age", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNIC / ID Number *
                  </label>
                  <input
                    type="text"
                    placeholder="12345-1234567-1"
                    value={passenger.cnic}
                    onChange={(e) =>
                      updatePassenger(index, "cnic", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 12345-1234567-1
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={passenger.phone}
                    onChange={(e) =>
                      updatePassenger(index, "phone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) =>
                      updatePassenger(index, "email", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default PassengerInfo;
