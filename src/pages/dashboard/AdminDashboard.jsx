import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authAPI, trainAPI, scheduleAPI, bookingAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import {
  Users,
  Train,
  Calendar,
  BookOpen,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrains: 0,
    totalSchedules: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, trainsRes, schedulesRes, bookingsRes] =
        await Promise.all([
          authAPI.getAllUsers(),
          trainAPI.getTrains(),
          scheduleAPI.getAllSchedules(),
          bookingAPI.getAllBookings(),
        ]);

      // Handle different response structures
      const users = usersRes.data?.users || usersRes.data || [];
      const trains = trainsRes.data || [];
      const schedules = schedulesRes.data?.schedules || schedulesRes.data || [];
      const bookings = bookingsRes.data || [];

      const totalRevenue = bookings.reduce((sum, booking) => {
        return booking.paymentStatus === "paid"
          ? sum + (booking.schedule?.ticketPrice || 0)
          : sum;
      }, 0);

      setStats({
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalTrains: Array.isArray(trains) ? trains.length : 0,
        totalSchedules: Array.isArray(schedules) ? schedules.length : 0,
        totalBookings: Array.isArray(bookings) ? bookings.length : 0,
        totalRevenue,
      });

      setRecentBookings(Array.isArray(bookings) ? bookings.slice(0, 5) : []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage your railway ticketing system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Train className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Trains</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTrains}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Schedules
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSchedules}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs. {stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h3>
            <Link
              to="/admin/bookings"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.user?.name || "User"} -{" "}
                      {booking.train?.trainName || "Train"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Seat {booking.seatNumber} •{" "}
                      {booking.schedule?.date
                        ? new Date(booking.schedule.date).toLocaleDateString()
                        : ""}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.passengerName} • Age: {booking.passengerAge}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      Rs. {booking.schedule?.ticketPrice || 0}
                    </p>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        booking.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : booking.paymentStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No bookings yet</p>
          )}
        </div>

        {/* Management Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Management Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Manage Users</span>
              </div>
              <span className="text-blue-600">→</span>
            </Link>

            <Link
              to="/admin/trains"
              className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Train className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Manage Trains
                </span>
              </div>
              <span className="text-green-600">→</span>
            </Link>

            <Link
              to="/admin/schedules"
              className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">
                  Manage Schedules
                </span>
              </div>
              <span className="text-purple-600">→</span>
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center justify-between p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">
                  Manage Bookings
                </span>
              </div>
              <span className="text-orange-600">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
