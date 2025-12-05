import { Component } from "react";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
              {/* Animated Error Icon */}
              <div className="mb-6 animate-bounce">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're sorry, but something unexpected happened. Don't worry, we're on it!
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-8 p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-left">
                  <div className="flex items-center mb-2">
                    <Bug className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-semibold text-red-800">Error Details:</span>
                  </div>
                  <p className="text-sm text-red-700 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-sm text-red-600 cursor-pointer hover:text-red-700">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
                <Link
                  to="/"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  <span>Go Home</span>
                </Link>
              </div>

              {/* Help Text */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  If this problem persists, please contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

