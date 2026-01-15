import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Bus,
  Clock,
  Ticket,
  User,
  QrCode,
  Shield,
  Wifi,
  Headphones,
  Star,
  CheckCircle,
  Award,
  HelpCircle,
  ChevronDown,
  Target,
  Users as UsersIcon,
  Heart,
} from "lucide-react";
import { Footer } from "../../components/layout";
import { busAPI, cityAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchForm, setSearchForm] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [routesError, setRoutesError] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const res = await cityAPI.getAllCities();
        if (res.data && Array.isArray(res.data)) {
          // Extract city names from response
          const cityNames = res.data.map((city) => city.name).sort();
          setCities(cityNames);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Fallback to default cities if API fails
        setCities([
          "Karachi",
          "Lahore",
          "Islamabad",
          "Rawalpindi",
          "Quetta",
          "Peshawar",
          "Multan",
          "Faisalabad",
          "Sialkot",
          "Hyderabad",
        ]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch popular routes with proper error handling
  useEffect(() => {
    const fetchPopularRoutes = async () => {
      try {
        setLoadingRoutes(true);
        setRoutesError(null);
        const res = await busAPI.getPopularRoutes();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setPopularRoutes(res.data);
        } else {
          setPopularRoutes([]);
        }
      } catch (error) {
        console.error("Error fetching popular routes:", error);
        setRoutesError(
          error.response?.data?.message || "Failed to load popular routes"
        );
        setPopularRoutes([]);
      } finally {
        setLoadingRoutes(false);
      }
    };

    fetchPopularRoutes();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError("");

    // Validation
    if (!searchForm.from || !searchForm.to || !searchForm.date) {
      setSearchError("Please fill all required fields");
      return;
    }

    if (
      searchForm.from.trim().toLowerCase() ===
      searchForm.to.trim().toLowerCase()
    ) {
      setSearchError("Departure and destination cities cannot be the same");
      return;
    }

    const selectedDate = new Date(searchForm.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setSearchError("Please select a valid future date");
      return;
    }

    if (searchForm.passengers < 1 || searchForm.passengers > 10) {
      setSearchError("Number of passengers must be between 1 and 10");
      return;
    }

    // Navigate to search results
    navigate("/search", {
      state: {
        from: searchForm.from.trim(),
        to: searchForm.to.trim(),
        date: searchForm.date,
        passengers: searchForm.passengers,
      },
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book a bus ticket?",
      answer:
        "Simply enter your departure and destination cities, select your travel date and number of passengers, then click 'Search Buses'. Choose your preferred bus, select seats, fill in passenger details, and complete the payment.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking from the 'My Bookings' page. Cancellation policies vary depending on the bus operator and time of cancellation. Refunds are processed according to the cancellation policy.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept Credit/Debit cards, JazzCash, Easypaisa, and mobile wallet payments like Apple Pay and Google Pay. All transactions are secure and encrypted.",
    },
    {
      question: "How do I track my bus?",
      answer:
        "You can track your bus using the 'Track Bus' feature on the home page. Enter your booking ID to see real-time location updates and estimated arrival time.",
    },
    {
      question: "What if I miss my bus?",
      answer:
        "If you miss your bus, please contact our support team immediately. Refund policies vary by operator and circumstances. We'll do our best to help you with alternative arrangements.",
    },
    {
      question: "Can I change my seat after booking?",
      answer:
        "Seat changes are subject to availability and operator policies. Please contact our support team for assistance with seat changes. Changes may be allowed up to 2 hours before departure.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section with Search */}
      <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-down">
              Book Your Railway Ticket
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 animate-slide-up">
              Plan your journey with ease and enjoy safe, comfortable bus travel
              across Pakistan with fast booking and trusted operators.
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Info Text and View Schedules Button */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-white text-lg font-medium mb-1">
                  Book Your Railway Ticket Now
                </p>
                <p className="text-purple-100 text-sm">
                  Select your route and date to find available routes, or view
                  all schedules to plan your journey
                </p>
              </div>
              <button
                onClick={() => navigate("/all-schedules")}
                className="px-6 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Calendar className="w-5 h-5" />
                <span>View All Schedules</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="mb-12 bg-white rounded-xl shadow-lg p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-pink-600 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong className="text-indigo-600">Railway Ticketing</strong> is
              Pakistan's leading online bus booking platform, connecting
              travelers with reliable bus operators across the country. We are
              committed to providing a seamless, safe, and comfortable travel
              experience for all our customers.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With over{" "}
              <strong className="text-indigo-600">
                50,000 satisfied customers
              </strong>{" "}
              and partnerships with{" "}
              <strong className="text-indigo-600">100+ bus routes</strong>, we
              ensure that your journey is not just a trip, but a memorable
              experience. Our mission is to make bus travel accessible,
              affordable, and enjoyable for everyone.
            </p>
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex items-center">
                <Target className="w-6 h-6 text-indigo-600 mr-2" />
                <span className="text-gray-700 font-medium">Our Mission</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-pink-600 mr-2" />
                <span className="text-gray-700 font-medium">
                  Customer First
                </span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-gray-700 font-medium">
                  Trusted Service
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-6 text-center transform hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Safe Travel</h3>
              <p className="text-sm text-gray-600">Certified & insured buses</p>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-6 text-center transform hover:scale-110 transition-transform duration-300">
              <Award className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">Competitive rates</p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-6 text-center transform hover:scale-110 transition-transform duration-300">
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 text-center transform hover:scale-110 transition-transform duration-300">
              <Wifi className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Modern Fleet</h3>
              <p className="text-sm text-gray-600">Latest amenities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left animate-fade-in"
          >
            <Ticket className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              My Bookings
            </h3>
            <p className="text-gray-600">View and manage your bookings</p>
          </button>

          <button
            onClick={() => navigate("/track-bus")}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left animate-fade-in animation-delay-200"
          >
            <QrCode className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Track Bus
            </h3>
            <p className="text-gray-600">Track your bus in real-time</p>
          </button>

          <button
            onClick={() => {
              if (user) {
                // Show toast/alert if already logged in
                alert("You are already logged in!");
              } else {
                navigate("/login");
              }
            }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 text-left animate-fade-in animation-delay-400"
          >
            <User className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {user ? "Already Logged In" : "Login"}
            </h3>
            <p className="text-gray-600">
              {user
                ? `Welcome, ${user.name || user.email || "User"}!`
                : "Sign in to your account"}
            </p>
          </button>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Search Buses
              </h3>
              <p className="text-gray-600 text-sm">
                Enter your route and travel date to find available buses
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Select Seats
              </h3>
              <p className="text-gray-600 text-sm">
                Choose your preferred seats from the interactive seat map
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Enter Details
              </h3>
              <p className="text-gray-600 text-sm">
                Fill in passenger information and contact details
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Pay & Confirm
              </h3>
              <p className="text-gray-600 text-sm">
                Complete payment and receive instant booking confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Excellent service! The booking process was smooth and the bus
                was on time. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Ahmed Khan</p>
                  <p className="text-sm text-gray-600">Karachi</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Very comfortable journey with great amenities. The customer
                support was helpful throughout."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Fatima Ali</p>
                  <p className="text-sm text-gray-600">Lahore</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Best bus booking platform in Pakistan! Easy to use and reliable
                service."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Hassan Raza</p>
                  <p className="text-sm text-gray-600">Islamabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl p-8 mb-12 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="animate-count-up">
              <p className="text-5xl font-bold mb-2">50K+</p>
              <p className="text-purple-100">Happy Customers</p>
            </div>
            <div className="animate-count-up animation-delay-200">
              <p className="text-5xl font-bold mb-2">100+</p>
              <p className="text-purple-100">Bus Routes</p>
            </div>
            <div className="animate-count-up animation-delay-400">
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-purple-100">Daily Trips</p>
            </div>
            <div className="animate-count-up animation-delay-600">
              <p className="text-5xl font-bold mb-2">4.8</p>
              <p className="text-purple-100">Average Rating</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-pink-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ${
                      openFaq === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
