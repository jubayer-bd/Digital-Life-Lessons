import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";
import {
  Users,
  BookOpen,
  Flag,
  Flame,
  PlusCircle,
  TrendingUp,
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

// --- 1. UTILS & SUB-COMPONENTS (Defined outside to prevent re-creation) ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-gray-100 shadow-xl rounded-xl text-sm">
        <p className="font-bold text-gray-800 mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <p className="text-gray-600 font-medium">
            {payload[0].name}:{" "}
            <span className="text-blue-600 font-bold">{payload[0].value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const StatCard = React.memo(
  ({ title, value, icon: Icon, color = "blue", trend, trendUp = true }) => {
    const styles = {
      blue: "bg-blue-50 text-blue-600 ring-blue-100",
      green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      red: "bg-rose-50 text-rose-600 ring-rose-100",
      purple: "bg-violet-50 text-violet-600 ring-violet-100",
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/60 group">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
            <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {value.toLocaleString()}
            </h3>
            {trend && (
              <div
                className={`flex items-center gap-1 mt-3 text-xs font-semibold ${
                  trendUp ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {trendUp ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                <span className="bg-opacity-10 px-1.5 py-0.5 rounded-md bg-current">
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-3.5 rounded-xl ring-1 ${
              styles[color] || styles.blue
            } group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  }
);

const AdminCharts = React.memo(({ lessonStats = [], userStats = [] }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-8">
      {/* Lesson Growth Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Lesson Activity</h3>
            <p className="text-xs text-gray-500">Content upload frequency</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={lessonStats}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#3B82F6",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Lessons"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorLessons)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">New Users</h3>
            <p className="text-xs text-gray-500">Registration trends</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userStats}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="Users"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#10B981" }}
                activeDot={{ r: 7, strokeWidth: 0, fill: "#10B981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
});

const TopContributors = React.memo(({ contributors = [] }) => {
  if (contributors.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <span className="p-2 bg-orange-50 rounded-lg text-orange-500">
            <Flame size={20} />
          </span>
          Top Contributors
        </h3>
        <button className="text-sm text-blue-600 font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 pl-2">Rank</th>
              <th className="pb-3">User</th>
              <th className="pb-3 text-center">Lessons</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contributors.map((user, i) => (
              <tr
                key={user._id || i}
                className="hover:bg-gray-50/80 transition-colors group cursor-default"
              >
                <td className="py-4 pl-2 font-bold text-gray-400 w-16">
                  {i === 0
                    ? "🥇"
                    : i === 1
                    ? "🥈"
                    : i === 2
                    ? "🥉"
                    : `#${i + 1}`}
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border border-white shadow-sm flex items-center justify-center text-blue-600 font-bold text-sm">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user?.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.email || "Contributor"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {user.lessonCount}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-gray-300 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all">
                    <MoreVertical size={18} />
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

// --- MAIN COMPONENT ---
const AdminDashboard = () => {
  const axiosSecure = useAxios();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
    // Performance: Don't refetch immediately if user switches tabs
    // staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });

  // Calculate default values to avoid UI crashing if API fails or returns partial data
  const stats = useMemo(() => {
    return {
      totalUsers: data?.totalUsers || 0,
      totalPublicLessons: data?.totalPublicLessons || 0,
      reportedLessons: data?.reportedLessons || 0,
      todayLessons: data?.todayLessons || 0,
      topContributors: data?.topContributors || [],
      lessonGrowth: data?.lessonGrowth || [],
      userGrowth: data?.userGrowth || [],
    };
  }, [data]);

  if (isLoading) {
    return <PageLoader text="Analysing data..." />;
  }

  if (isError) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center text-red-500">
        <p>Failed to load dashboard data.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm underline text-gray-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 mt-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, Admin. Performance metrics for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="blue"
          trend="12%"
          trendUp={true}
        />
        <StatCard
          title="Public Lessons"
          value={stats.totalPublicLessons}
          icon={BookOpen}
          color="green"
          trend="5 Today"
          trendUp={true}
        />
        <StatCard
          title="Reported Issues"
          value={stats.reportedLessons}
          icon={Flag}
          color="red"
          trend="Action Req."
          trendUp={false} // Red trend because reported issues are "bad"
        />
        <StatCard
          title="Today's Uploads"
          value={stats.todayLessons}
          icon={PlusCircle}
          color="purple"
          trend="Daily Avg"
          trendUp={true}
        />
      </div>

      {/* Charts Section */}
      <AdminCharts
        lessonStats={stats.lessonGrowth}
        userStats={stats.userGrowth}
      />

      {/* Contributors Table */}
      <TopContributors contributors={stats.topContributors} />
    </div>
  );
};

export default AdminDashboard;
