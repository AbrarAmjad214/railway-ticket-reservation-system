import { useState } from "react";
import { Mail, Phone, MessageSquare, HelpCircle, Send } from "lucide-react";
import { Footer } from "../../components/layout";

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: "How do I book a bus ticket?",
      answer:
        "You can book a ticket by searching for buses on the home page, selecting your preferred bus and seats, filling in passenger details, and completing the payment.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        'Yes, you can cancel your booking from the "My Bookings" page. Cancellation policies may vary depending on the bus operator and time of cancellation.',
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept Credit/Debit cards, JazzCash, Easypaisa, and mobile wallet payments like Apple Pay and Google Pay.",
    },
    {
      question: "How do I track my bus?",
      answer:
        'You can track your bus using the "Track Bus" feature on the home page. Enter your booking ID to see real-time location updates.',
    },
    {
      question: "What if I miss my bus?",
      answer:
        "If you miss your bus, please contact our support team immediately. Refund policies vary by operator and circumstances.",
    },
    {
      question: "Can I change my seat after booking?",
      answer:
        "Seat changes are subject to availability and operator policies. Please contact support for assistance with seat changes.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, send to backend
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact Support
          </h1>
          <p className="text-xl text-blue-100">
            We're here to help you 24/7. Get in touch with our support team.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Phone</p>
                    <p className="text-gray-600">+92 300 1234567</p>
                    <p className="text-gray-600">+92 21 12345678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-gray-600">support@railwayticket.com</p>
                    <p className="text-gray-600">info@railwayticket.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">Live Chat</p>
                    <p className="text-gray-600">Available 24/7</p>
                    <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Business Hours
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">Monday - Friday:</span> 9:00
                  AM - 6:00 PM
                </p>
                <p>
                  <span className="font-semibold">Saturday:</span> 10:00 AM -
                  4:00 PM
                </p>
                <p>
                  <span className="font-semibold">Sunday:</span> Closed
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form & FAQs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Send us a Message
              </h2>
              {submitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  Thank you for contacting us! We'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={6}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Live Chat Widget Placeholder */}

            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="border-b pb-4 last:border-0">
                    <summary className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600">
                      {faq.question}
                    </summary>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactSupport;
