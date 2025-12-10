import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import Lessons from "../pages/Lessons/Lessons";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PremiumPlans from "../pages/Payments/PremiumPlans";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PrivateRoute from "./PrivateRoute";
import DashBoardLayout from "../layouts/DashboardLayout";
import LessonDetails from "../pages/Lessons/LessonDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/lessons",
        element: <Lessons />,
      },
      {
        path: "/lessons/:id",
        element: <LessonDetails />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
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
      { path: "pricing/upgrade", element: <PremiumPlans /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancelled /> },
    ],
  },
]);
