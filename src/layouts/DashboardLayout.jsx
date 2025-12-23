import React, { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  User,
} from "lucide-react";

const USER_LINKS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", end: true },
  { to: "/dashboard/add-lesson", icon: PlusCircle, label: "Create Lesson" },
  { to: "/dashboard/my-lessons", icon: BookOpen, label: "My Lessons" },
  { to: "/dashboard/saved-lessons", icon: Heart, label: "Saved Lessons" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

const ADMIN_LINKS = [
  {
    to: "/dashboard/admin",
    icon: ShieldCheck,
    label: "Admin Stats",
    end: true,
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

const NavItem = ({
  to,
  icon: Icon,
  label,
  open,
  end = false,
  type = "user",
  onClick,
}) => {
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
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
          isActive ? activeStyle : hoverStyle
        }`
      }
    >
      <Icon size={22} className="shrink-0" />
      <span
        className={`font-medium whitespace-nowrap ${
          open ? "opacity-100 block" : "lg:opacity-0 lg:hidden"
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
  const location = useLocation();

  // Automatically close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) setOpen(false);
  }, [location]);

  if (roleLoading) return <PageLoader text="Loading Dashboard..." />;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR --- */}
      <motion.aside
        initial={false}
        animate={{
          width: open ? 280 : window.innerWidth < 1024 ? 0 : 88,
          x: open ? 0 : window.innerWidth < 1024 ? -280 : 0,
        }}
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col shadow-xl transition-all lg:translate-x-0 overflow-hidden`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <Link to={"/"} className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <BookOpen size={24} />
            </div>
            {open && (
              <span className="text-xl font-bold text-gray-800">
                Digital Life Lessons
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-2 text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {(role === "admin" ? ADMIN_LINKS : USER_LINKS).map((link) => (
            <NavItem
              key={link.to}
              {...link}
              open={open}
              type={role === "admin" ? "admin" : "user"}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={22} />
            {open && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT --- */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          open ? "lg:ml-[280px]" : "lg:ml-[88px]"
        }`}
      >
        <header className="h-20 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-400 capitalize">{role}</p>
            </div>
            <img
              src={user?.photoURL || <User />}
              className="w-11 h-11 rounded-full border-2 border-blue-600 object-cover"
              alt="profile"
            />
          </div>
        </header>

        <main className="p-4 md:p-8 min-h-[calc(100vh-80px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
