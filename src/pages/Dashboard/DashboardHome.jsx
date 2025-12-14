import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Heart,
  PlusCircle,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  const axiosSecure = useAxios();

  /* =======================
     FETCH DATA
  ======================== */

  // My lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["my-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/my-lessons");
      return res.data;
    },
  });

  // Saved lessons
  const { data: saved = [] } = useQuery({
    queryKey: ["saved-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/saved");
      return res.data;
    },
  });

  // Recent lessons
  const { data: recentLessons = [] } = useQuery({
    queryKey: ["recent-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/recent");
      return res.data;
    },
  });

  // Analytics
  const { data: analytics = { labels: [], counts: [] } } = useQuery({
    queryKey: ["lesson-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/analytics");
      return res.data;
    },
  });

  /* =======================
     CHART CONFIG
  ======================== */

  const chartData = {
    labels: analytics.labels,
    datasets: [
      {
        label: "Lessons Created",
        data: analytics.counts,
        borderColor: "rgb(79, 70, 229)",
        backgroundColor: "rgba(79, 70, 229, 0.12)",
        borderWidth: 3,
        pointRadius: 5,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  /* =======================
     STATS
  ======================== */

  const totalViews = lessons.reduce(
    (acc, lesson) => acc + (lesson.viewCount || 0),
    0
  );

  const stats = [
    {
      title: "Total Lessons",
      count: lessons.length,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      link: "/dashboard/my-lessons",
    },
    {
      title: "Saved Lessons",
      count: saved.length,
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
      link: "/dashboard/saved-lessons",
    },
    {
      title: "Total Views",
      count: totalViews,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
      link: "#",
    },
  ];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back! Here’s your activity summary.
          </p>
        </div>

        <Link
          to="/dashboard/add-lesson"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition"
        >
          <PlusCircle size={20} />
          Create Lesson
        </Link>
      </div>

      {/* QUICK ACTIONS */}
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/dashboard/my-lessons"
          className="bg-white p-5 rounded-xl border hover:shadow transition"
        >
          <BookOpen className="text-indigo-600 mb-2" />
          <h3 className="font-semibold">My Lessons</h3>
          <p className="text-sm text-gray-500">Manage your lessons</p>
        </Link>

        <Link
          to="/dashboard/saved-lessons"
          className="bg-white p-5 rounded-xl border hover:shadow transition"
        >
          <Heart className="text-pink-600 mb-2" />
          <h3 className="font-semibold">Saved Lessons</h3>
          <p className="text-sm text-gray-500">Your bookmarked lessons</p>
        </Link>

        <Link
          to="/dashboard/add-lesson"
          className="bg-indigo-600 text-white p-5 rounded-xl hover:bg-indigo-700 transition"
        >
          <PlusCircle className="mb-2" />
          <h3 className="font-semibold">Create Lesson</h3>
          <p className="text-sm opacity-90">Share your experience</p>
        </Link>
      </div> */}

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Link
            to={stat.link}
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.count}</h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* RECENT LESSONS */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Recently Added Lessons</h2>
          <Link
            to="/dashboard/my-lessons"
            className="text-indigo-600 text-sm hover:underline"
          >
            View all
          </Link>
        </div>

        {recentLessons.length === 0 ? (
          <p className="text-gray-400">No lessons yet.</p>
        ) : (
          <ul className="space-y-3">
            {recentLessons.map((lesson) => (
              <li
                key={lesson._id}
                className="flex justify-between items-center p-4 shadow-md rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-xs text-gray-400">
                    {lesson.category} •{" "}
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/lessons/${lesson._id}`}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <BarChart3 className="text-indigo-600" />
          Weekly Activity
        </h2>

        <div className="h-72">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
