import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import Lessons from "../pages/Lessons/Lessons";
import LessonDetails from "../pages/LessonDetails/LessonDetails";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

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
]);
