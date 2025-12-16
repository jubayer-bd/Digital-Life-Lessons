import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Search,
  MoreVertical,
  BookOpen,
  Eye,
  EyeOff,
  Flag,
  CheckCircle,
  Star,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import PageLoader from "../../../components/PageLoader";

const ManageLessons = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'public', 'private', 'flagged'

  // 1. FETCH LESSONS
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/admin");
      return res.data;
    },
  });

  // 2. MUTATION: DELETE LESSON
  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/lessons/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "The lesson has been removed.", "success");
      queryClient.invalidateQueries(["lessons"]);
    },
    onError: () => toast.error("Could not delete lesson"),
  });

  // 3. MUTATION: TOGGLE FEATURED
  const { mutate: toggleFeatured } = useMutation({
    mutationFn: async ({ id, featured }) => {
      return axiosSecure.patch(`/lessons/${id}/featured`, { featured });
    },
    onSuccess: () => {
      toast.success("Lesson status updated");
      queryClient.invalidateQueries(["lessons"]);
    },
  });

  // 4. MUTATION: MARK AS REVIEWED
  const { mutate: markReviewed } = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.patch(`/lessons/${id}/reviewed`);
    },
    onSuccess: () => {
      toast.success("Lesson marked as reviewed");
      queryClient.invalidateQueries(["lessons"]);
    },
  });

  // HANDLERS
  const handleDelete = (id) => {
    Swal.fire({
      title: "Remove Lesson?",
      text: "This action will permanently delete the content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLesson(id);
      }
    });
  };

  // STATS CALCULATION
  const stats = {
    total: lessons.length,
    public: lessons.filter((l) => l.visibility === "public").length,
    private: lessons.filter((l) => l.visibility === "private").length,
    flagged: lessons.filter((l) => l.isFlagged).length,
  };

  // FILTER LOGIC
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "public") return matchesSearch && lesson.visibility === "public";
    if (filterType === "private") return matchesSearch && lesson.visibility === "private";
    if (filterType === "flagged") return matchesSearch && lesson.isFlagged;

    return matchesSearch;
  });

  if (isLoading) return <PageLoader text="Loading Lessons..." />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 1. Header with Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Lessons", count: stats.total, color: "text-blue-600", icon: <BookOpen size={20} /> },
          { label: "Public", count: stats.public, color: "text-green-600", icon: <Eye size={20} /> },
          { label: "Private", count: stats.private, color: "text-gray-600", icon: <EyeOff size={20} /> },
          { label: "Flagged", count: stats.flagged, color: "text-red-500", icon: <Flag size={20} /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.count}</h3>
            </div>
            <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* 2. Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">Manage Lessons</h2>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-sm appearance-none cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Lessons</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search title or creator..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 3. Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="p-4 pl-6">Lesson Info</th>
                <th className="p-4">Creator</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Visibility</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Lesson Info */}
                    <td className="p-4 pl-6 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 truncate" title={lesson.title}>
                          {lesson.title}
                        </span>
                        <span className="text-xs text-gray-500">{lesson.category || "General"}</span>
                      </div>
                    </td>

                    {/* Creator */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {lesson.user?.image && (
                          <img
                            src={lesson.user.image}
                            alt=""
                            className="w-6 h-6 rounded-full object-cover border border-gray-200"
                          />
                        )}
                        <span className="text-sm text-gray-600">{lesson.user?.name || "Unknown"}</span>
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        {lesson.isReviewed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle size={10} /> Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                            Pending
                          </span>
                        )}
                        {lesson.isFlagged && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                            <Flag size={10} /> Flagged
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-md ${
                        lesson.visibility === 'public' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {lesson.visibility}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Featured Toggle */}
                        <button
                          onClick={() => toggleFeatured({ id: lesson._id, featured: !lesson.isFeatured })}
                          className={`p-2 rounded-lg transition-colors ${
                            lesson.isFeatured ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={lesson.isFeatured ? "Remove Featured" : "Make Featured"}
                        >
                          <Star size={18} fill={lesson.isFeatured ? "currentColor" : "none"} />
                        </button>

                         {/* Mark Reviewed */}
                         {!lesson.isReviewed && (
                          <button
                            onClick={() => markReviewed(lesson._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Reviewed"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Lesson"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No lessons found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;