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
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  const axiosSecure = useAxios();

  // 1. Fetch User's Created Lessons
  const { data: lessons = [] } = useQuery({
    queryKey: ["my-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/my-lessons");
      return res.data;
    },
  });
  console.log(lessons);
  // 2. Fetch User's Saved Lessons
  const { data: saved = [] } = useQuery({
    queryKey: ["saved-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/saved");
      return res.data;
    },
  });

  // 3. Fetch Analytics Data
  const { data: analytics = { labels: [], counts: [] } } = useQuery({
    queryKey: ["lesson-analytics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/analytics");
      return res.data;
    },
  });

  // Chart Configuration
  const chartData = {
    labels: analytics.labels || [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ],
    datasets: [
      {
        label: "Lessons Created",
        data: analytics.counts || [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgb(79, 70, 229)", // Indigo-600
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgb(79, 70, 229)",
        pointRadius: 6,
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  // Helper for Stats
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
      count:
        lessons.reduce((acc, curr) => acc + (curr.viewCount || 0), 0) + 120, // Mock addition for demo
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
            Welcome back! Here is your activity summary.
          </p>
        </div>
        <Link
          to="/dashboard/add-lesson"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-lg"
        >
          <PlusCircle size={20} />
          Create New Lesson
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link
            to={stat.link}
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {stat.count}
                </h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="text-indigo-600" />
            Weekly Activity
          </h2>
          <span className="text-sm text-gray-400">Past 7 Days</span>
        </div>

        <div className="h-64 md:h-80 w-full">
          {analytics.labels ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Loading Chart...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
