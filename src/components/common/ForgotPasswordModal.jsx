import { useState } from "react";
import { X, Mail, KeyRound, Send, Loader2, AlertCircle } from "lucide-react";
import { authAPI } from "../../services/api";
import { toast } from "react-toastify";
import { isValidEmail } from "../../utils/formValidation";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setSent(false);
    setError("");
    onClose();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      const message = "Please enter your email address";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 3000 });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      const message = "Please enter a valid email address";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 3000 });
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.forgotPassword(trimmedEmail);
      setSent(true);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send reset email";
      setError(message);
      toast.error(message, { position: "top-right", autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8 text-white">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-10">
            <div className="p-3 bg-white/20 rounded-2xl shrink-0">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight">
                Forgot Password?
              </h2>
              <p className="text-sm text-purple-100 mt-2 leading-relaxed">
                Enter your registered email and we will send you a secure reset
                link.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Mail className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Check your email
              </h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed px-2">
                We sent a password reset link to{" "}
                <strong className="text-gray-800">{email}</strong>. Please check
                your inbox and spam folder.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="example@gmail.com"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white transition ${
                      error ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the same email you registered with.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto sm:min-w-[120px] py-3.5 px-5 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}