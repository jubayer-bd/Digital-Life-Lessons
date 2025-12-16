import React from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";

const Forbidden = () => {
  const navigate = useNavigate();

  // Custom SVG Icons (No dependencies)
  const Icons = {
    Lock: ({ className }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    ArrowLeft: ({ className }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    ),
    Home: ({ className }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-base-100 shadow-2xl rounded-3xl p-8 md:p-12 text-center border border-base-300 relative overflow-hidden"
      >
        {/* Decorative Background Blob */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-error/60 via-error to-error/60"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-error/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Icons.Lock className="w-12 h-12" />
        </motion.div>

        {/* Text Content */}
        <h1 className="text-7xl font-black text-base-content/10 mb-2">403</h1>
        <h2 className="text-3xl font-bold text-base-content mb-3">
          Access Restricted
        </h2>
        <p className="text-base-content/60 mb-8">
          You don't have permission to access this area. This page is restricted
          to <span className="font-semibold text-error">Administrators</span>{" "}
          only.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline border-base-300 hover:bg-base-200 hover:border-base-400 gap-2 rounded-xl"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="btn btn-primary gap-2 rounded-xl text-white shadow-lg shadow-primary/30"
          >
            <Icons.Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Forbidden;
