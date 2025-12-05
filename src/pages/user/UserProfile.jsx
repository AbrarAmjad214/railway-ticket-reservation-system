import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  Save,
  Users,
  Calendar,
  Ticket,
  Edit,
  Trash2,
  Camera,
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  MapPin,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { Footer } from "../../components/layout";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savedPassengers, setSavedPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    });

    // Load saved passengers (mock data)
    setSavedPassengers([
      {
        id: 1,
        name: "John Doe",
        age: 30,
        cnic: "12345-1234567-1",
        phone: "0300-1234567",
      },
      {
        id: 2,
        name: "Jane Doe",
        age: 28,
        cnic: "12345-1234567-2",
        phone: "0300-1234568",
      },
    ]);
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      alert("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password change failed:", error);
      alert("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePassenger = (id) => {
    if (
      window.confirm("Are you sure you want to delete this saved passenger?")
    ) {
      setSavedPassengers(savedPassengers.filter((p) => p.id !== id));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-2xl">
                {getInitials(user?.name)}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-indigo-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">
                {user?.name || "User"}
              </h1>
              <p className="text-xl text-purple-100 mb-4">{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">
                    {user?.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Verified Account</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{savedPassengers.length}</p>
                <p className="text-sm text-purple-100">Saved Passengers</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-purple-100">Total Bookings</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-purple-100">Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex space-x-2 mb-8 bg-white rounded-xl p-2 shadow-lg">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "password"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab("passengers")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "passengers"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Saved Passengers
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Profile Information
                  </h2>
                </div>
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-5 h-5" />
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Change Password */}
            {activeTab === "password" && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Change Password
                  </h2>
                </div>
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Saved Passengers */}
            {activeTab === "passengers" && (
              <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-teal-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Saved Passengers
                    </h2>
                  </div>
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>
                {savedPassengers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      No saved passengers yet
                    </p>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Add First Passenger
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedPassengers.map((passenger) => (
                      <div
                        key={passenger.id}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {passenger.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-lg">
                              {passenger.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                Age: {passenger.age}
                              </span>
                              <span className="flex items-center">
                                <Shield className="w-4 h-4 mr-1" />
                                {passenger.cnic}
                              </span>
                              <span className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {passenger.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePassenger(passenger.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/my-bookings")}
                    className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Ticket className="w-5 h-5" />
                      <span>My Bookings</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Book a Ticket</span>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Account Security */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Account Security
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">
                      Email Verified
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">
                      Phone Verified
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-sm text-gray-700">2FA Enabled</span>
                    <button className="text-indigo-600 text-sm font-medium hover:underline">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
