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
  Globe,
  Lock,
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
  console.log(recentLessons);

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
    <div className="space-y-6 md:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back! Here’s your activity summary.
          </p>
        </div>
        <Link
          to="/dashboard/add-lesson"
          className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <PlusCircle size={20} />
          Create Lesson
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <Link
            to={stat.link}
            key={i}
            className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">
                  {stat.title}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold mt-1">
                  {stat.count}
                </h3>
              </div>
              <div className={`p-3 md:p-4 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* RECENT LESSONS */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-bold">Recently Added</h2>
            <Link
              to="/dashboard/my-lessons"
              className="text-blue-600 text-sm hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            {lessons.length == 0 ? (
              <span className="p-2">You Currently have any lesson</span>
            ) : (
              <table className="table w-full">
                <thead className="bg-gray-50 text-center text-sm">
                  <tr>
                    <th>Title</th>
                    <th>Created</th>
                    {/* <th>Likes</th> */}
                    {/* <th>Saves</th> */}
                    <th>Visibility</th>
                    <th>Access</th>
                  </tr>
                </thead>

                <tbody>
                  {recentLessons.map((lesson) => (
                    <tr key={lesson._id} className="text-center">
                      <td>
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="font-semibold hover:underline"
                        >
                          {lesson.title}
                        </Link>
                      </td>

                      <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>

                      {/* <td>{lesson.likes?.length || 0}</td> */}
                      {/* <td>{lesson.favorites?.length || 0}</td> */}

                      <td>
                        {lesson.visibility === "private" ? (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Lock size={14} /> Private
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600">
                            <Globe size={14} /> Public
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            lesson.accessLevel === "premium"
                              ? "badge-warning"
                              : "badge-success"
                          }`}
                        >
                          {lesson.accessLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-6">
            <BarChart3 className="text-blue-600" /> Activity
          </h2>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
