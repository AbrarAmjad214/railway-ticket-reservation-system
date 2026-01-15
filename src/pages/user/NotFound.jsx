import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, Bus, MapPin, Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-white/20 leading-none animate-fade-in">
            404
          </h1>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Icon */}
          <div className="mb-6 animate-bounce">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-lg rounded-full border-4 border-white/30">
              <Compass className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-down">
            Page Not Found
          </h2>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 animate-slide-up">
            Oops! The page you're looking for seems to have taken a detour.
          </p>

          {/* Description */}
          <div className="mb-8 space-y-3">
            <p className="text-purple-100">
              The page you requested doesn't exist or has been moved.
            </p>
            <p className="text-purple-200 text-sm">
              Don't worry, let's get you back on track!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 bg-white text-indigo-600 font-semibold py-3.5 px-8 rounded-xl hover:bg-purple-50 hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-lg text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/30 hover:scale-105 transition-all duration-200 border-2 border-white/30"
            >
              <Search className="w-5 h-5" />
              <span>Search Trains</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-lg text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-white/30 hover:scale-105 transition-all duration-200 border-2 border-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Link
              to="/"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:scale-105"
            >
              <Home className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-sm text-white">Home</p>
            </Link>
            <Link
              to="/my-bookings"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:scale-105"
            >
              <Bus className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-sm text-white">Bookings</p>
            </Link>
            <Link
              to="/search"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:scale-105"
            >
              <MapPin className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-sm text-white">Search</p>
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 hover:bg-white/20 transition-all duration-200 border border-white/20 hover:scale-105"
            >
              <Compass className="w-6 h-6 text-white mx-auto mb-2" />
              <p className="text-sm text-white">Support</p>
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            🚌 Looks like this bus route doesn't exist! Let's find you a better one.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

