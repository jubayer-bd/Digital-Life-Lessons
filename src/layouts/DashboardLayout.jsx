import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import PageLoader from "../components/PageLoader";
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  PlusCircle,
  Users,
  Flag,
  UserCircle,
  LogOut,
  Menu,
  ShieldCheck,
  BookMarked,
} from "lucide-react";

// 1. DATA MOVED OUTSIDE COMPONENT (Performance)
const USER_LINKS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/my-lessons", icon: BookOpen, label: "My Lessons" },
  { to: "/dashboard/saved-lessons", icon: Heart, label: "Saved Lessons" },
  { to: "/dashboard/add-lesson", icon: PlusCircle, label: "Create Lesson" },
];

// Fix: Add 'end: true' to the first link
const ADMIN_LINKS = [
  {
    to: "/dashboard/admin",
    icon: ShieldCheck,
    label: "Admin Stats",
    end: true, // <--- THIS WAS MISSING
  },
  { to: "/dashboard/admin/manage-users", icon: Users, label: "Manage Users" },
  {
    to: "/dashboard/admin/manage-lessons",
    icon: BookMarked,
    label: "Manage Lessons",
  },
  {
    to: "/dashboard/admin/reported-lessons",
    icon: Flag,
    label: "Reported Lessons",
  },
  { to: "/dashboard/admin/profile", icon: UserCircle, label: "Admin Profile" },
];

// 2. REUSABLE NAV ITEM COMPONENT (Clean Code)
const NavItem = ({
  to,
  icon: Icon,
  label,
  open,
  end = false,
  type = "user",
}) => {
  // Define styles based on type (user vs admin)
  const activeStyle =
    type === "admin"
      ? "bg-red-500 text-white shadow-md"
      : "bg-blue-600 text-white shadow-md";

  const hoverStyle =
    type === "admin"
      ? "text-gray-600 hover:bg-red-50 hover:text-red-600"
      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600";

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
          isActive ? activeStyle : hoverStyle
        }`
      }
    >
      <Icon size={22} strokeWidth={2} />
      {/* Framer motion could be used here for smoother text fade, but generic conditional works */}
      <span
        className={`font-medium whitespace-nowrap transition-opacity duration-200 ${
          open ? "opacity-100 block" : "opacity-0 hidden w-0"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
};

const DashBoardLayout = () => {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const { role, roleLoading } = useRole();

  const sidebarVariants = {
    open: { width: 280 },
    closed: { width: 88 },
  };

  // 3. LOADER LOGIC
  if (roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <PageLoader text="Loading Dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col shadow-xl"
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100 gap-3 shrink-0">
          <div className="bg-blue-600 p-2 rounded-lg text-white shrink-0">
            <BookOpen size={24} />
          </div>
          {open && (
            <Link
              to="/"
              className="text-xl font-bold text-gray-800 whitespace-nowrap"
            >
              Digital Life
            </Link>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 scrollbar-hide">
          {/* USER MENU */}
          {role !== "admin" &&
            USER_LINKS.map((link) => (
              <NavItem key={link.to} {...link} open={open} type="user" />
            ))}

          {/* ADMIN MENU */}
          {role === "admin" && (
            <div className="pt-2">
              <div
                className={`text-[10px] font-bold text-red-400 uppercase tracking-widest px-3 mb-2 transition-all ${
                  !open && "text-center"
                }`}
              >
                {open ? "Admin Control" : "•••"}
              </div>

              <div className="space-y-2">
                {ADMIN_LINKS.map((link) => (
                  <NavItem key={link.to} {...link} open={open} type="admin" />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut size={22} />
            <span
              className={`font-medium whitespace-nowrap transition-all ${
                open ? "opacity-100 block" : "opacity-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          open ? "ml-[280px]" : "ml-[88px]"
        }`}
      >
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-8 flex items-center justify-between">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-400 capitalize font-medium">
                {role}
              </p>
            </div>
            <img
              src={
                user?.photoURL || "https://referrer.com/placeholder-avatar.jpg"
              }
              className="w-10 h-10 rounded-full border border-gray-200 shadow-sm object-cover"
              alt="profile"
            />
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
