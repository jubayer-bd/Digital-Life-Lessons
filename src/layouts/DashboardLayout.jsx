import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom"; // Use react-router-dom
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import { IoBookSharp } from "react-icons/io5";

// --- 🎨 Custom SVG Icon Components ---
const Icons = {
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
  Book: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  Heart: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  Plus: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  ),
  Users: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Settings: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  LogOut: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Menu: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
};

const DashBoardLayout = () => {
  const [open, setOpen] = useState(true); // Default open on desktop is usually better
  const { user, logout } = useAuth();
  const { role } = useRole();

  // --- Configuration ---
  const getRoleSpecificLinks = () => {
    // 1. Common Links (Everyone sees these)
    const commonLinks = [
      { to: "/dashboard", icon: Icons.Home, label: "Overview" },
      { to: "/dashboard/my-lessons", icon: Icons.Book, label: "My Lessons" },
      { to: "/dashboard/saved-lessons", icon: Icons.Heart, label: "Saved" },
      { to: "/dashboard/add-lesson", icon: Icons.Plus, label: "Create Lesson" },
    ];

    // 2. Admin Links
    const adminLinks = [
      {
        to: "/dashboard/users-management",
        icon: Icons.Users,
        label: "Manage Users",
      },
      {
        to: "/dashboard/all-lessons",
        icon: Icons.Book,
        label: "All Lessons (Admin)",
      },
    ];

    if (role === "admin") return [...commonLinks, ...adminLinks];
    return commonLinks;
  };

  const navItems = getRoleSpecificLinks();

  // --- Styles ---
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group overflow-hidden relative ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200 font-medium"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  // --- Animation Variants ---
  const sidebarVariants = {
    open: {
      width: 280,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    closed: {
      width: 88,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const textVariants = {
    open: { opacity: 1, x: 0, display: "block", transition: { duration: 0.3 } },
    closed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
      transitionEnd: { display: "none" },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans selection:bg-blue-100">
      {/* 🔮 Sidebar */}
      <motion.aside
        initial="open"
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col shadow-xl"
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 flex-shrink-0">
              <IoBookSharp className="w-6 h-6" />
            </div>
            <motion.span
              variants={textVariants}
              className="text-xl font-bold tracking-tight text-gray-800"
            >
              Digital Life
            </motion.span>
          </div>
        </div>

        {/* User Card (Sidebar) */}
        <div className="px-4 py-6">
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 ${
              !open && "justify-center p-2"
            }`}
          >
            <div className="avatar flex-shrink-0">
              <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm overflow-hidden">
                <img
                  src={user?.photoURL || "https://i.pravatar.cc/150"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <motion.div variants={textVariants} className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate text-gray-700">
                {user?.displayName || "User"}
              </h4>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                {role || "Member"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-200">
          <p
            className={`px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ${
              !open && "text-center"
            }`}
          >
            {open ? "Menu" : "•"}
          </p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClasses}>
              <item.icon className="w-6 h-6 flex-shrink-0" />
              <motion.span
                variants={textVariants}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/profile"
            className="flex items-center gap-4 p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            <Icons.Settings className="w-6 h-6 flex-shrink-0" />
            <motion.span variants={textVariants}>Settings</motion.span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <Icons.LogOut className="w-6 h-6 flex-shrink-0" />
            <motion.span variants={textVariants} className="font-medium">
              Logout
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* 🚀 Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          open ? "ml-[280px]" : "ml-[88px]"
        }`}
      >
        {/* Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
            >
              <Icons.Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-800 hidden sm:block">
              Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    src={user?.photoURL || "https://i.pravatar.cc/150"}
                    alt="User"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-2xl w-56 border border-gray-100 text-gray-700"
              >
                <li className="px-2 py-2 mb-2 border-b border-gray-100">
                  <span className="font-bold">{user?.displayName}</span>
                </li>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <button onClick={logout} className="text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
