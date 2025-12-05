import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./components/layout";
import { ErrorBoundary } from "./components/common";
import {
  Home,
  SearchResults,
  BusDetails,
  PassengerInfo,
  ReviewPayment,
  BookingConfirmation,
  MyBookings,
  TicketView,
  Login,
  Register,
  UserProfile,
  ContactSupport,
  TrackBus,
  NotFound,
} from "./pages/user";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/404" ||
    location.pathname === "/not-found";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {!hideNavbar && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/bus/:busId" element={<BusDetails />} />
            <Route path="/passenger-info" element={<PassengerInfo />} />
            <Route path="/review-payment" element={<ReviewPayment />} />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/ticket/:bookingId" element={<TicketView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/contact" element={<ContactSupport />} />
            <Route path="/track-bus" element={<TrackBus />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
