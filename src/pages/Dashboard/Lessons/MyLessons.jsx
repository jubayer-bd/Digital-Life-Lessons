import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import useIsPremium from "../../../hooks/useIsPremium";
import { toast } from "react-hot-toast";
import {
  Lock,
  Globe,
  Edit2,
  Trash2,
  X,
  Heart,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";

const MyLessons = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { isPremium, roleLoading } = useIsPremium();
  const queryClient = useQueryClient();

  const [editingLesson, setEditingLesson] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [formData, setFormData] = useState({});

  const queryKey = ["my-lessons", user?.email];

  /* ================= FETCH ================= */
  const { data: lessons = [], isLoading } = useQuery({
    queryKey,
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/my-lessons");
      return res.data;
    },
  });

  /* ================= DELETE ================= */
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/lessons/${id}`),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old = []) =>
        old.filter((l) => l._id !== id)
      );
      return { previous };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context.previous);
      toast.error("Delete failed");
    },
    onSuccess: () => toast.success("Lesson deleted"),
  });

  /* ================= UPDATE ================= */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.patch(`/lessons/${id}`, data),
    onSuccess: () => {
      toast.success("Lesson updated");
      queryClient.invalidateQueries({ queryKey });
      setEditingLesson(null);
    },
  });

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({ ...lesson });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!isPremium && formData.accessLevel === "premium") {
      formData.accessLevel = "free";
    }
    updateMutation.mutate({
      id: editingLesson._id,
      data: formData,
    });
  };

  if (roleLoading && isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">Loading lessons...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">My Lessons</h2>

      {lessons.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-xl">
          You haven’t created any lessons yet.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white p-5 rounded-xl shadow border border-gray-100 flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <Link
                    to={`/lessons/${lesson._id}`}
                    className="font-bold text-lg text-gray-800 line-clamp-2 hover:text-blue-600 transition"
                  >
                    {lesson.title}
                  </Link>
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-xs btn-circle"
                    >
                      <MoreVertical size={18} />
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-10"
                    >
                      <li>
                        <button onClick={() => handleEdit(lesson)}>
                          <Edit2 size={14} /> Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-error"
                          onClick={() => setConfirmDeleteId(lesson._id)}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Heart size={14} /> {lesson.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bookmark size={14} /> {lesson.favorites?.length || 0}
                  </div>
                  <div className="text-xs ml-auto">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {lesson.visibility === "private" ? (
                      <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        <Lock size={12} /> Private
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                        <Globe size={12} /> Public
                      </span>
                    )}
                  </div>

                  <span
                    className={`badge badge-sm ${
                      lesson.accessLevel === "premium"
                        ? "badge-warning"
                        : "badge-success text-white"
                    }`}
                  >
                    {lesson.accessLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
            <table className="table w-full">
              <thead className="bg-gray-50 text-sm">
                <tr>
                  <th>Title</th>
                  <th>Created</th>
                  <th>Likes</th>
                  <th>Saves</th>
                  <th>Visibility</th>
                  <th>Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="max-w-xs truncate">
                      <Link
                        to={`/lessons/${lesson._id}`}
                        className="font-semibold hover:text-blue-600 transition"
                      >
                        {lesson.title}
                      </Link>
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </td>
                    <td>{lesson.likes?.length || 0}</td>
                    <td>{lesson.favorites?.length || 0}</td>
                    <td>
                      {lesson.visibility === "private" ? (
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <Lock size={14} /> Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Globe size={14} /> Public
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          lesson.accessLevel === "premium"
                            ? "badge-warning"
                            : "badge-success text-white"
                        }`}
                      >
                        {lesson.accessLevel}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="btn btn-sm btn-square btn-outline"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(lesson._id)}
                        className="btn btn-sm btn-square btn-error btn-outline"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ========== EDIT MODAL ========== */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-[95%] sm:w-full max-w-lg relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setEditingLesson(null)}
              className="absolute right-4 top-4 btn btn-sm btn-circle btn-ghost"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold mb-4">Update Lesson</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label text-sm font-medium text-gray-700">
                  Lesson Title
                </label>
                <input
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="textarea textarea-bordered w-full h-24 focus:textarea-primary"
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-700">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label text-sm font-medium text-gray-700">
                    Access Level
                  </label>
                  <select
                    value={formData.accessLevel}
                    disabled={!isPremium}
                    onChange={(e) =>
                      setFormData({ ...formData, accessLevel: e.target.value })
                    }
                    className="select select-bordered w-full"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {!isPremium && (
                <div className="text-xs bg-amber-50 text-amber-700 p-2 rounded">
                  💡 Upgrade to Premium to publish paid lessons.
                </div>
              )}

              <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white w-full mt-2"
                type="submit"
              >
                Update Lesson
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRM ========== */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-[95%] sm:w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              Delete lesson?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. The lesson will be permanently
              removed from your dashboard.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="btn btn-sm btn-error text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLessons;