import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navbar, AdminLayout } from "./components/layout";
import { ErrorBoundary, AdminRoute, ProtectedRoute } from "./components/common";
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
  AllSchedules,
} from "./pages/user";
import {
  AdminDashboard,
  Trains,
  Schedules,
  Bookings,
  BookingForm,
  Users,
} from "./pages/dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PaymentSuccess from "./pages/user/PaymentSuccess";
import PaymentCancel from "./pages/user/PaymentCancel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/404" ||
    location.pathname === "/not-found" ||
    location.pathname.startsWith("/admin");

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {!hideNavbar && <Navbar />}
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/all-schedules" element={<AllSchedules />} />
            <Route path="/bus/:busId" element={<BusDetails />} />
            <Route path="/passenger-info" element={<PassengerInfo />} />
            <Route path="/review-payment" element={<ReviewPayment />} />
            <Route
              path="/booking-confirmation"
              element={<BookingConfirmation />}
            />
            <Route path="/ticket/:bookingId" element={<TicketView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<ContactSupport />} />
            <Route path="/track-bus" element={<TrackBus />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />

            {/* Protected User Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/trains"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Trains />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/schedules"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Schedules />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Bookings />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings/create"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <BookingForm />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
