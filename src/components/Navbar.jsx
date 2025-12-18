import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import { AuthContext } from "../Context/AuthContext";
import useIsPremium from "../hooks/useIsPremium";
import useRole from "../hooks/useRole";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const { isPremium } = useIsPremium();
  const { role, roleLoading } = useRole(); // Gets 'admin' or 'user'
  const pathname = location.pathname;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = () => {
    logout();
    setMobileMenu(false);
    setIsDropdownOpen(false);
  };

  // --- STYLES ---
  const isActive = (route) =>
    pathname === route
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600 transition-colors";

  const mobileLinkStyle = (route) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      pathname === route
        ? "bg-blue-50 text-blue-600"
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-2">
            <figure className="bg-blue-600 p-2 rounded-lg">
              <img src="/1.svg" alt="Logo" className="w-6 h-6" />
            </figure>
            <span className="text-xl md:text-2xl font-bold text-blue-600 tracking-tight">
              Digital Life Lessons
            </span>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
            <Link to="/lessons" className={isActive("/lessons")}>
              Lessons
            </Link>

            {/* ROLE BASED LINKS: Only show for Standard Users (Not Admins) */}
            {user && !roleLoading && role !== "admin" && (
              <>
                <Link
                  to="/dashboard/add-lesson"
                  className={isActive("/dashboard/add-lesson")}
                >
                  Add Lesson
                </Link>
                <Link
                  to="/dashboard/my-lessons"
                  className={isActive("/dashboard/my-lessons")}
                >
                  My Lessons
                </Link>
              </>
            )}

            {/* Upgrade Link: Hide for Admins or Premium Users */}
            {user && !roleLoading && !isPremium && role !== "admin" && (
              <Link
                to="/pricing/upgrade"
                className={isActive("/pricing/upgrade")}
              >
                Upgrade
              </Link>
            )}

            <Link to="/about" className={isActive("/about")}>
              About
            </Link>
            <Link to="/contact" className={isActive("/contact")}>
              Contact
            </Link>
          </div>

          {/* --- DESKTOP AUTH / DROPDOWN --- */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 pr-3 rounded-full border border-gray-200 hover:shadow-md transition cursor-pointer"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-xs font-bold">
                      {user?.displayName?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.displayName || "User"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                      {/* Show Role Badge */}
                      <p className="text-[10px] uppercase font-bold text-blue-500 mt-1">
                        {role || "User"}
                      </p>
                    </div>

                    <div className="py-1">
                      {/* ADMIN DASHBOARD LINK */}
                      {role === "admin" && (
                        <Link
                          to="/dashboard/admin/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-semibold text-purple-600"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      {/* STANDARD DASHBOARD */}
                      <Link
                        to={
                          role === "admin"
                            ? "/dashboard/admin/profile"
                            : "/dashboard"
                        }
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Profile
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {mobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 z-40 max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenu(false)}
              className={mobileLinkStyle("/")}
            >
              Home
            </Link>
            <Link
              to="/lessons"
              onClick={() => setMobileMenu(false)}
              className={mobileLinkStyle("/lessons")}
            >
              Lessons
            </Link>

            {/* MOBILE: Standard User Links */}
            {user && !roleLoading && role !== "admin" && (
              <>
                <Link
                  to="/dashboard/add-lesson"
                  onClick={() => setMobileMenu(false)}
                  className={mobileLinkStyle("/dashboard/add-lesson")}
                >
                  Add Lesson
                </Link>
                <Link
                  to="/dashboard/my-lessons"
                  onClick={() => setMobileMenu(false)}
                  className={mobileLinkStyle("/dashboard/my-lessons")}
                >
                  My Lessons
                </Link>
              </>
            )}

            {/* MOBILE: Upgrade */}
            {user && !roleLoading && !isPremium && role !== "admin" && (
              <Link
                to="/pricing/upgrade"
                onClick={() => setMobileMenu(false)}
                className={mobileLinkStyle("/pricing/upgrade")}
              >
                Upgrade
              </Link>
            )}

            <Link
              to="/about"
              onClick={() => setMobileMenu(false)}
              className={mobileLinkStyle("/about")}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenu(false)}
              className={mobileLinkStyle("/contact")}
            >
              Contact
            </Link>

            {/* MOBILE: Account Section */}
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="px-3 flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Account
                  </p>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold">
                    {role || "User"}
                  </span>
                </div>

                {/* MOBILE: Admin Specific Link */}
                {role === "admin" && (
                  <Link
                    to="/dashboard/admin/profile"
                    onClick={() => setMobileMenu(false)}
                    className={mobileLinkStyle("/dashboard/admin/profile")}
                  >
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileMenu(false)}
                  className={mobileLinkStyle("/dashboard/profile")}
                >
                  Profile
                </Link>

                {role !== "admin" && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenu(false)}
                    className={mobileLinkStyle("/dashboard")}
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              {!user ? (
                <div className="grid grid-cols-2 gap-3 px-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenu(false)}
                    className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenu(false)}
                    className="flex justify-center items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="px-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex justify-center items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
