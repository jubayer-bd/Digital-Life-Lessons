import { createBrowserRouter, Outlet } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashBoardLayout from "../layouts/DashboardLayout";

// Auth & Protection
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

// Public Pages
import Home from "../pages/Home/Home";
import Lessons from "../pages/Lessons/Lessons";
import LessonDetails from "../pages/Lessons/LessonDetails";
import PremiumPlans from "../pages/Payments/PremiumPlans";
import AuthorProfile from "../pages/Lessons/AuthorProfile";

// Payment Pages
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";

// Dashboard - User Pages
import DashboardHome from "../pages/Dashboard/DashboardHome";
import AddLesson from "../pages/Dashboard/Lessons/AddLesson";
import MyLessons from "../pages/Dashboard/Lessons/MyLessons";
import SavedLessons from "../pages/Dashboard/Lessons/SavedLessons";
import Profile from "../pages/Dashboard/Profile/Profile";

// Dashboard - Admin Pages
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import DashboardEntry from "../components/DashboardEntry";
import ManageLessons from "../pages/Dashboard/Admin/ManageLessons";
import ReportedLessons from "../pages/Dashboard/Admin/ReportedLessons";
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import NotFound from "../components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "lessons", element: <Lessons /> },
      {
        path: "lessons/:id",
        element: (
          <PrivateRoute>
            <LessonDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "profile/:email",
        element: (
          <PrivateRoute>
            <AuthorProfile />
          </PrivateRoute>
        ),
      },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      // auth
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      // payment
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancelled /> },
      {
        path: "pricing/upgrade",
        element: (
          <PrivateRoute>
            <PremiumPlans />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardEntry /> },
      { path: "add-lesson", element: <AddLesson /> },
      { path: "my-lessons", element: <MyLessons /> },
      { path: "saved-lessons", element: <SavedLessons /> },
      { path: "profile", element: <Profile /> },
      // admin
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/manage-lessons",
        element: (
          <AdminRoute>
            <ManageLessons />
          </AdminRoute>
        ),
      },
      {
        path: "admin/reported-lessons",
        element: (
          <AdminRoute>
            <ReportedLessons />
          </AdminRoute>
        ),
      },
      {
        path: "admin/profile",
        element: (
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
