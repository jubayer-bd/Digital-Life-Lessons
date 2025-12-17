import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Search,
  BookOpen,
  Eye,
  EyeOff,
  Flag,
  CheckCircle,
  Star,
  Filter,
  X,
  RotateCcw, // Icon for un-review
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PageLoader from "../../../components/PageLoader";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router-dom"; // Use react-router-dom for Link

const ManageLessons = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // --- REACT QUERY MUTATIONS ---

  // 1. FETCH LESSONS
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons", filterType, searchTerm], // Added filterType and searchTerm for better caching/refetching
    queryFn: async () => {
      // In a real application, you'd pass these filters to the backend
      const res = await axiosSecure.get("lessons/admin");
      return res.data;
    },
  });

  // 2. MUTATION: DELETE LESSON
  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`lessons/${id}/admin`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "The lesson has been removed.", "success");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: () => toast.error("Could not delete lesson"),
  });

  // 3. MUTATION: TOGGLE FEATURED
  const { mutate: toggleFeatured } = useMutation({
    mutationFn: async ({ id, featured }) => {
      return axiosSecure.patch(`/lessons/${id}/featured`, { featured });
    },
    onSuccess: () => {
      toast.success("Featured status updated");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: () => toast.error("Failed to update featured status"),
  });

  // 4. MUTATION: MARK AS REVIEWED / UNMARK REVIEWED
  const { mutate: markReviewed } = useMutation({
    mutationFn: async ({ id, isReviewed }) => {
      return axiosSecure.patch(`/lessons/${id}/reviewed`, {
        isReviewed, // This will be the new boolean state
      });
    },
    onSuccess: () => {
      toast.success("Review status updated");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: () => {
      toast.error("Failed to update review status");
    },
  });

  // --- HANDLERS ---

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

  // --- STATS & FILTER LOGIC ---
  const stats = {
    total: lessons.length,
    public: lessons.filter((l) => l.visibility === "public").length,
    private: lessons.filter((l) => l.visibility === "private").length,
    flagged: lessons.filter((l) => l.reportCount > 0).length,
  };

  const filteredLessons = lessons.filter((lesson) => {
    // 1. Search Filter
    const matchesSearch =
      lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()); // Added email search

    // 2. Type Filter
    if (!matchesSearch) return false;

    if (filterType === "public") return lesson.visibility === "public";
    if (filterType === "private") return lesson.visibility === "private";
    if (filterType === "flagged") return lesson.reportCount > 0;

    return true;
  });

  if (isLoading) return <PageLoader text="Loading Lessons..." />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Lesson Management Dashboard
      </h1>

      {/* 1. Header with Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Lessons",
            count: stats.total,
            color: "text-blue-600",
            icon: <BookOpen size={20} />,
            bg: "bg-blue-50",
          },
          {
            label: "Public",
            count: stats.public,
            color: "text-green-600",
            icon: <Eye size={20} />,
            bg: "bg-green-50",
          },
          {
            label: "Private",
            count: stats.private,
            color: "text-gray-600",
            icon: <EyeOff size={20} />,
            bg: "bg-gray-50",
          },
          {
            label: "Flagged",
            count: stats.flagged,
            color: "text-red-500",
            icon: <Flag size={20} />,
            bg: "bg-red-50",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center justify-between transition-shadow hover:shadow-lg"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className={`text-3xl font-extrabold ${stat.color}`}>
                {stat.count}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search title, creator, or email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-48">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            className="pl-9 pr-4 py-2 w-full bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500/20 text-sm appearance-none cursor-pointer shadow-inner"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Lessons</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* 3. Table Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold tracking-wider">
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
                  <tr
                    key={lesson._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    {/* Lesson Info */}
                    <td className="p-4 pl-6 max-w-xs">
                      <div className="flex flex-col">
                        <span
                          className="font-semibold text-gray-900 truncate"
                          title={lesson.title}
                        >
                          {lesson.title}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          Category: {lesson.category || "General"}
                        </span>
                      </div>
                    </td>

                    {/* Creator */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {lesson.user?.image && (
                          <img
                            src={lesson.user.image}
                            alt={lesson.user?.name}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        )}
                        <span className="text-sm text-gray-700">
                          {lesson.user?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Status Badges */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {lesson.isReviewed ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle size={10} /> Reviewed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Eye size={10} /> Pending Review
                          </span>
                        )}
                        {lesson.isFlagged && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <Flag size={10} /> Flagged
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="p-4 text-center">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          lesson.visibility === "public"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {lesson.visibility}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View */}
                        <Link
                          to={`/lessons/${lesson._id}`}
                          title="View lesson"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>

                        {/* Mark Reviewed Toggle - FIX APPLIED HERE */}
                        <button
                          onClick={() =>
                            markReviewed({
                              id: lesson._id,
                              isReviewed: !lesson.isReviewed, // **FIX: Toggle the state**
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            lesson.isReviewed
                              ? "text-green-600 hover:bg-green-100 bg-green-50"
                              : "text-amber-600 hover:bg-amber-100 bg-amber-50"
                          }`}
                          title={
                            lesson.isReviewed
                              ? "Unmark as Reviewed"
                              : "Mark as Reviewed"
                          }
                        >
                          {lesson.isReviewed ? (
                            <RotateCcw size={18} /> // Icon for Unmark/Revert
                          ) : (
                            <CheckCircle size={18} /> // Icon for Mark
                          )}
                        </button>

                        {/* Featured Toggle */}
                        <button
                          onClick={() =>
                            toggleFeatured({
                              id: lesson._id,
                              featured: !lesson.featured,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            lesson.featured
                              ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={
                            lesson.featured
                              ? "Remove Featured"
                              : "Make Featured"
                          }
                        >
                          <Star
                            size={18}
                            fill={lesson.featured ? "currentColor" : "none"}
                          />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(lesson._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-500 font-medium"
                  >
                    <X size={24} className="inline mr-2" />
                    No lessons found matching your criteria.
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
