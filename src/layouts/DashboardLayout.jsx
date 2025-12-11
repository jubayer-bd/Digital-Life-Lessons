import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import { IoBookSharp } from "react-icons/io5";
// --- 🎨 Custom SVG Icon Components (No Dependencies) ---
const Icons = {
  Logo: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
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
  Package: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  History: ({ className }) => (
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
      <polyline points="12 6 12 12 16 14"></polyline>
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
  Clipboard: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M9 14l2 2 4-4"></path>
    </svg>
  ),
  Motorbike: ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6h-5a1 1 0 0 0-1 1v4h-3v-3h-2v3h-2v2h6v2.1" />
      <path d="M15 6l4 3.5v4" />
      <path d="M18.5 14h-13" />
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
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { role } = useRole();
  // Format Role Display
  // const displayRole = role?.charAt(0).toUpperCase() + role?.slice(1) || "User";

  // --- Configuration ---
  const getRoleSpecificLinks = () => {
    const commonLinks = [
      { to: "/", icon: Icons.Home, label: "Home" },
      {
        to: "/dashboard/add-lesson",
        icon: Icons.Clipboard,
        label: "Add Lesson",
      },
      { to: "/dashboard/my-parcels", icon: Icons.Package, label: "My Parcels" },
      {
        to: "/dashboard/payment-history",
        icon: Icons.History,
        label: "Payment History",
      },
    ];

    const adminLinks = [
      {
        to: "/dashboard/users-managements",
        icon: Icons.Users,
        label: "Manage Users",
      },
      {
        to: "/dashboard/add-lessons",
        icon: Icons.Clipboard,
        label: "Approve Riders",
      },
      {
        to: "/dashboard/assign-riders",
        icon: Icons.Clipboard,
        label: "AssignRiders Riders",
      },
    ];

    // const riderLinks = [
    //   { to: "/dashboard/delivery-list", icon: Icons.Motorbike, label: "My Deliveries" },
    // ];

    if (role === "admin") return [...commonLinks, ...adminLinks];
    // if (role === 'rider') return [...commonLinks, ...riderLinks];
    return commonLinks;
  };

  const navItems = getRoleSpecificLinks();

  // --- Styles ---
  // Active state now uses a gradient and shadow for a "Pop" effect
  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group overflow-hidden relative ${
      isActive
        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30 font-medium"
        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
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
    <div className="flex min-h-screen bg-base-100 font-sans selection:bg-primary/20">
      {/* 🔮 Sidebar */}
      <motion.aside
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 z-50 h-screen bg-base-100 border-r border-base-200 flex flex-col shadow-2xl"
      >
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-base-200/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary flex-shrink-0">
              {/* <Icons.Logo /> */}
              <IoBookSharp className="w-6 h-6" />
            </div>
            <motion.span
              variants={textVariants}
              className="text-xl font-bold tracking-tight text-base-content"
            >
              Digital Life Lessons
            </motion.span>
          </div>
        </div>

        {/* User Card (Sidebar) */}
        <div className="px-4 py-6">
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-200 ${
              !open && "justify-center p-2"
            }`}
          >
            <div className="avatar flex-shrink-0">
              <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm">
                <img
                  src={user?.photoURL || "/placeholder-avatar.png"}
                  alt="User"
                />
              </div>
            </div>
            <motion.div variants={textVariants} className="overflow-hidden">
              <h4 className="font-semibold text-sm truncate">
                {user?.displayName || "User"}
              </h4>
              <span className="text-xs text-base-content/50 uppercase tracking-wider font-medium">
                {/* {displayRole} */}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-thin scrollbar-thumb-base-300">
          <p
            className={`px-4 text-xs font-bold text-base-content/40 uppercase tracking-widest mb-2 ${
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
        <div className="p-4 border-t border-base-200 space-y-2">
          <Link
            to="/settings"
            className="flex items-center gap-4 p-3 rounded-xl text-base-content/70 hover:bg-base-200 hover:text-base-content transition-all"
          >
            <Icons.Settings className="w-6 h-6 flex-shrink-0" />
            <motion.span variants={textVariants}>Settings</motion.span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-error hover:bg-error/5 transition-all"
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
        {/* Glassmorphic Top Navbar */}
        <header className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-200 h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(!open)}
              className="btn btn-circle btn-ghost btn-sm hover:bg-base-200 text-base-content/70"
            >
              <Icons.Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-base-content/80 hidden sm:block">
              Dashboard Overview
            </h2>
          </div>

          {/* Top Right Profile Actions */}
          <div className="flex items-center gap-4">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary transition-all">
                  <img
                    src={user?.photoURL || "/placeholder-avatar.png"}
                    alt="User"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-56 border border-base-200"
              >
                <li className="px-2 py-2 mb-2 border-b border-base-200">
                  <span className="font-bold">{user?.displayName}</span>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={logout} className="text-error">
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
