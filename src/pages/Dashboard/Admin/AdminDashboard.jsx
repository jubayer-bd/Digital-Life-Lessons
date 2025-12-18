import React, { useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";
import {
  Users,
  BookOpen,
  Flag,
  Flame,
  PlusCircle,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Link } from "react-router";

// -------------------- TOOLTIP --------------------
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-2 sm:p-3 border border-gray-200 shadow-xl rounded-lg text-xs sm:text-sm">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <p className="text-gray-600">
            {payload[0].name}:{" "}
            <span className="font-bold text-blue-600">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// -------------------- STAT CARD --------------------
const StatCard = React.memo(
  ({ title, value = 0, icon: Icon, trend, trendUp = true }) => (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            {title}
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-gray-900">
            {Number(value).toLocaleString()}
          </h3>

          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 sm:mt-3 text-[11px] sm:text-xs font-bold ${
                trendUp ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trendUp ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>

        <div className="p-2 sm:p-3 rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 shrink-0">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
);

// -------------------- CHARTS --------------------
const AdminCharts = React.memo(({ lessonStats = [], userStats = [] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mt-6 sm:mt-8">
    {/* Lesson Activity */}
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200/60">
      <h3 className="font-bold text-gray-800 text-sm sm:text-lg mb-3 sm:mb-6">
        Lesson Activity
      </h3>
      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={lessonStats}>
            <defs>
              <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              name="Lessons"
              stroke="#2563EB"
              strokeWidth={2.5}
              fill="url(#colorLessons)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* User Growth */}
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200/60">
      <h3 className="font-bold text-gray-800 text-sm sm:text-lg mb-3 sm:mb-6">
        New Users
      </h3>
      <div className="h-[220px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userStats}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F3F4F6"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              name="Users"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#fff", stroke: "#2563EB", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
));

// -------------------- TOP CONTRIBUTORS --------------------
const TopContributors = React.memo(({ contributors = [] }) => {
  if (!contributors.length) return null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200/60 mt-6 sm:mt-8">
      <h3 className="font-bold text-gray-800 text-sm sm:text-lg flex items-center gap-2 mb-4 sm:mb-6">
        <span className="p-2 bg-orange-50 rounded-lg text-orange-500">
          <Flame size={18} />
        </span>
        Top Contributors
      </h3>

      {/* Mobile Card View */}
      <div className="space-y-3 sm:hidden">
        {contributors.map((user, i) => (
          <div
            key={user.email || i}
            className="border border-gray-100 rounded-xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name?.charAt(0)
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user.lessonCount} lessons
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-100">
              <th className="pb-4">Rank</th>
              <th className="pb-4">User</th>
              <th className="pb-4 text-center">Lessons</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contributors.map((user, i) => (
              <tr
                key={user.email || i}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 font-bold text-gray-400 w-16">
                  {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                    {user.lessonCount}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Link to={`/profile/${user.email}`}>
                      {" "}
                      <MoreVertical size={18} />
                    </Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// -------------------- MAIN DASHBOARD --------------------
const AdminDashboard = () => {
  const axiosSecure = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const stats = useMemo(
    () => ({
      totalUsers: data?.totalUsers || 0,
      totalPublicLessons: data?.totalPublicLessons || 0,
      reportedLessons: data?.reportedLessons || 0,
      todayLessons: data?.todayLessons || 0,
      topContributors: data?.topContributors || [],
      lessonGrowth: data?.lessonGrowth || [],
      userGrowth: data?.userGrowth || [],
    }),
    [data]
  );

  if (isLoading) return <PageLoader text="Analysing platform data..." />;

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4 text-sm font-medium text-center">
          Failed to load dashboard data.
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-5 sm:mb-8 pt-4 sm:pt-6">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Real-time performance metrics and platform health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="+12% total"
        />
        <StatCard
          title="Public Lessons"
          value={stats.totalPublicLessons}
          icon={BookOpen}
          trend="Across all users"
        />
        <StatCard
          title="Reported Issues"
          value={stats.reportedLessons}
          icon={Flag}
          trend="Manual review"
          trendUp={false}
        />
        <StatCard
          title="Today's Uploads"
          value={stats.todayLessons}
          icon={PlusCircle}
          trend="Fresh content"
        />
      </div>

      <AdminCharts
        lessonStats={stats.lessonGrowth}
        userStats={stats.userGrowth}
      />
      <TopContributors contributors={stats.topContributors} />
    </div>
  );
};

export default AdminDashboard;
