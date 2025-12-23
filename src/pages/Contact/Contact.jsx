import React from "react";
import { Mail, Phone, MapPin, Briefcase } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 sm:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            We are here to answer your questions and assist you on your learning
            journey. Choose the best method that fits your need.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
          {/* Contact Info Column */}
          <div className="bg-blue-600 text-white rounded-3xl p-6 sm:p-10 lg:p-12 space-y-8 sm:space-y-10 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold border-b border-blue-400/50 pb-4">
              Direct Contact Channels
            </h2>

            <div className="space-y-6">
              {/* Support */}
              <div className="flex items-start gap-4">
                <Mail className="flex-shrink-0 w-6 h-6 mt-1 text-blue-200" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">
                    General Support
                  </h3>
                  <p className="text-blue-200 text-sm sm:text-base">
                    For platform help, lesson access, or feedback.
                  </p>
                  <a
                    href="mailto:support@digitallifelessons.com"
                    className="text-white font-medium underline hover:text-blue-100 transition"
                  >
                    support@digitallifelessons.com
                  </a>
                </div>
              </div>

              {/* Business */}
              <div className="flex items-start gap-4">
                <Briefcase className="flex-shrink-0 w-6 h-6 mt-1 text-blue-200" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">
                    Partnerships & Media
                  </h3>
                  <p className="text-blue-200 text-sm sm:text-base">
                    For press, instructors, or business proposals.
                  </p>
                  <a
                    href="mailto:partnerships@digitallifelessons.com"
                    className="text-white font-medium underline hover:text-blue-100 transition"
                  >
                    partnerships@digitallifelessons.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="flex-shrink-0 w-6 h-6 mt-1 text-blue-200" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">
                    Call Us
                  </h3>
                  <p className="text-blue-200 text-sm sm:text-base">
                    Monday – Friday, 9:00 AM – 5:00 PM (GMT+6)
                  </p>
                  <span className="text-white font-medium">
                    +880 1234-567890
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Map */}
            <div className="pt-6 border-t border-blue-400/50">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="flex-shrink-0 w-6 h-6 mt-1 text-blue-200" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">
                    Our Base Location
                  </h3>
                  <p className="text-blue-200">Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-inner w-full h-56 sm:h-64">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.0097779776!2d90.3364491790403!3d23.78077774133967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4e13.1!3m3!1m2!1s0x3755b8b087029b81%3A0x8d56b0f195228ed8!2sDhaka!5e0!3m2!1sen!2sbd!4v1703310000000!5m2!1sen!2sbd"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 space-y-6 shadow-xl border border-gray-100 h-fit">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pb-2 border-b border-gray-100">
              Send a Direct Message
            </h2>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                placeholder="I have a question about premium content"
                className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                rows="5"
                placeholder="Tell us what's on your mind..."
                className="w-full border border-gray-300 rounded-lg px-4 sm:px-5 py-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition shadow-md focus:ring-4 focus:ring-blue-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
