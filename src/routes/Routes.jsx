import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import Lessons from "../pages/Lessons/Lessons";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PrivateRoute from "./PrivateRoute";
import DashBoardLayout from "../layouts/DashboardLayout";
import LessonDetails from "../pages/Lessons/LessonDetails";
import AddLesson from "../pages/Dashboard/Lessons/AddLesson";
import UserProfile from "../pages/Lessons/UserProfile";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import PremiumPlans from "../pages/Payments/PremiumPlans";
import MyLessons from "../pages/Dashboard/Lessons/MyLessons";
import SavedLessons from "../pages/Dashboard/Lessons/SavedLessons";
import Profile from "../pages/Dashboard/Profile/Profile";

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
      { path: "/profile/:email", element: <UserProfile /> },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-cancel", element: <PaymentCancelled /> },
      { path: "pricing/upgrade", element: <PremiumPlans /> },
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
      { index: true, Component: DashboardHome },

      { path: "add-lesson", element: <AddLesson /> },
      { path: "my-lessons", element: <MyLessons /> },
      { path: "saved-lessons", element: <SavedLessons /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
