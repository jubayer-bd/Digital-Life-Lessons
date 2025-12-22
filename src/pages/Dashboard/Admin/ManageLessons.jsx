import React, { useState, useEffect } from "react";
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
  RotateCcw,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import PageLoader from "../../../components/PageLoader";
import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router-dom";

const ManageLessons = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  // 🔹 Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [filterType, setFilterType] = useState("all");

  // 🔹 Debounce effect (NO UI CHANGE)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // --- DATA FETCHING ---
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("lessons/admin");
      return res.data;
    },
  });

  // --- MUTATIONS ---
  const { mutate: deleteLesson } = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`lessons/${id}/admin`),
    onSuccess: () => {
      Swal.fire("Deleted!", "The lesson has been removed.", "success");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: () => toast.error("Could not delete lesson"),
  });

  const { mutate: toggleFeatured } = useMutation({
    mutationFn: async ({ id, featured }) =>
      axiosSecure.patch(`/lessons/${id}/featured`, { featured }),
    onSuccess: () => {
      toast.success("Featured status updated");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: () => toast.error("Failed to update featured status"),
  });

  const { mutate: markReviewed } = useMutation({
    mutationFn: async ({ id, isReviewed }) =>
      axiosSecure.patch(`/lessons/${id}/reviewed`, { isReviewed }),
    onSuccess: () => {
      toast.success("Review status updated");
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
    },
    onError: () => toast.error("Failed to update review status"),
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
      if (result.isConfirmed) deleteLesson(id);
    });
  };

  // --- STATS ---
  const stats = {
    total: lessons.length,
    public: lessons.filter((l) => l.visibility === "public").length,
    private: lessons.filter((l) => l.visibility === "private").length,
    flagged: lessons.filter((l) => l.reportCount > 0).length,
  };

  // --- FILTERING (DEBOUNCED) ---
  const term = debouncedSearchTerm.toLowerCase();

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title?.toLowerCase().includes(term) ||
      lesson?.authorName?.toLowerCase().includes(term) ||
      lesson?.authorEmail?.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (filterType === "public") return lesson.visibility === "public";
    if (filterType === "private") return lesson.visibility === "private";
    if (filterType === "flagged") return lesson.reportCount > 0;
    return true;
  });

  if (isLoading) return <PageLoader text="Loading Lessons..." />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Lesson Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage content, reviews, and featured lessons.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.count}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search title, creator, or email..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-sm outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-56">
          <Filter
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-sm outline-none appearance-none cursor-pointer"
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

      {/* 3. CARD VIEW (Mobile/Tablet < lg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
          >
            {/* Header: Title & Category */}
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight">
                  {lesson.title}
                </h3>
                {lesson.featured && (
                  <Star
                    size={16}
                    className="text-yellow-500 shrink-0 fill-yellow-500 ml-2"
                  />
                )}
              </div>
              <span className="text-xs font-medium text-gray-500 mt-1 inline-block bg-gray-50 px-2 py-0.5 rounded">
                {lesson.category || "General"}
              </span>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl">
              {lesson.authorImage ? (
                <img
                  src={lesson.authorImage}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <UserIcon size={20} />
                </div>
              )}

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {lesson?.authorName || "Unknown"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {lesson?.authorEmail}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {/* Visibility Badge */}
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  lesson.visibility === "public"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {lesson.visibility}
              </span>

              {/* Review Status */}
              {lesson.isReviewed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  <CheckCircle size={10} /> Reviewed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                  <Eye size={10} /> Pending
                </span>
              )}

              {lesson.isFlagged && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                  <Flag size={10} /> Flagged
                </span>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
              <div className="flex gap-2 w-full justify-between">
                <Link
                  to={`/lessons/${lesson._id}`}
                  target="_blank"
                  className="flex-1"
                >
                  <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex justify-center">
                    <Eye size={18} />
                  </button>
                </Link>

                <button
                  onClick={() =>
                    markReviewed({
                      id: lesson._id,
                      isReviewed: !lesson.isReviewed,
                    })
                  }
                  className={`flex-1 py-2 rounded-lg flex justify-center transition-colors ${
                    lesson.isReviewed
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                  }`}
                >
                  {lesson.isReviewed ? (
                    <RotateCcw size={18} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                </button>

                <button
                  onClick={() =>
                    toggleFeatured({
                      id: lesson._id,
                      featured: !lesson.featured,
                    })
                  }
                  className={`flex-1 py-2 rounded-lg flex justify-center transition-colors ${
                    lesson.featured
                      ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <Star
                    size={18}
                    fill={lesson.featured ? "currentColor" : "none"}
                  />
                </button>

                <button
                  onClick={() => handleDelete(lesson._id)}
                  className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredLessons.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            No lessons found matching criteria.
          </div>
        )}
      </div>

      {/* 4. TABLE VIEW (Desktop >= lg) */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-full">
          {/* table-fixed ensures column widths are respected and no overflow occurs */}
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="w-[30%] p-5 pl-6 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  Lesson Info
                </th>
                <th className="w-[20%] p-5 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  Creator
                </th>
                <th className="w-[20%] p-5 text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  Status
                </th>
                <th className="w-[10%] p-5 text-center text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  Visibility
                </th>
                <th className="w-[20%] p-5 pr-8 text-right text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLessons.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Lesson Info */}
                  <td className="p-5 pl-6">
                    <div className="flex flex-col pr-4">
                      <span
                        className="font-semibold text-gray-900 truncate"
                        title={lesson.title}
                      >
                        {lesson.title}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 truncate">
                        {lesson.category || "General"}
                      </span>
                    </div>
                  </td>

                  {/* Creator */}
                  <td className="p-5">
                    <div className="flex items-center gap-3 w-full">
                      {lesson?.authorImage ? (
                        <img
                          src={lesson.authorImage}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <UserIcon size={14} />
                        </div>
                      )}
                      <span className="text-sm text-gray-700 truncate block max-w-[120px]">
                        {lesson?.authorName || "Unknown"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5 items-start">
                      {lesson.isReviewed ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                          <CheckCircle size={10} /> Reviewed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          <Eye size={10} /> Pending
                        </span>
                      )}
                      {lesson.isFlagged && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                          <Flag size={10} /> Flagged
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="p-5 text-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                        lesson.visibility === "public"
                          ? "bg-blue-50 text-blue-700 border-blue-100"
                          : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                    >
                      {lesson.visibility}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-5 pr-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/lessons/${lesson._id}`}
                        target="_blank"
                        title="View lesson"
                      >
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye size={18} />
                        </button>
                      </Link>

                      <button
                        onClick={() =>
                          markReviewed({
                            id: lesson._id,
                            isReviewed: !lesson.isReviewed,
                          })
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          lesson.isReviewed
                            ? "text-green-600 hover:bg-green-100"
                            : "text-amber-600 hover:bg-amber-100"
                        }`}
                        title={
                          lesson.isReviewed ? "Unmark Review" : "Mark Reviewed"
                        }
                      >
                        {lesson.isReviewed ? (
                          <RotateCcw size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          toggleFeatured({
                            id: lesson._id,
                            featured: !lesson.featured,
                          })
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          lesson.featured
                            ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title="Toggle Featured"
                      >
                        <Star
                          size={18}
                          fill={lesson.featured ? "currentColor" : "none"}
                        />
                      </button>

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
              ))}
            </tbody>
          </table>
          {filteredLessons.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No lessons found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;
