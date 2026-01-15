import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border">
        <div className="flex items-center gap-3 mb-4">
          <XCircle className="w-10 h-10 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-800">Payment Cancelled</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made.
        </p>

        <div className="flex gap-3">
          <Link
            to="/"
            className="flex-1 text-center py-3 rounded-xl font-semibold bg-gray-900 text-white hover:bg-black transition"
          >
            Back to Home
          </Link>

          <Link
            to="/review-payment"
            className="flex-1 text-center py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
