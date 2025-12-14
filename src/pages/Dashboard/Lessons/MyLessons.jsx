import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import useIsPremium from "../../../hooks/useIsPremimum";
import { toast } from "react-hot-toast";
import { Lock, Globe, Edit2, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

const MyLessons = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { isPremium } = useIsPremium();
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

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">Loading lessons...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">My Lessons</h2>

      {lessons.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          You haven’t created any lessons yet.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
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
                <tr key={lesson._id}>
                  <td>
                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="font-semibold hover:underline"
                    >
                      {lesson.title}
                    </Link>
                  </td>

                  <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>

                  <td>{lesson.likes?.length || 0}</td>
                  <td>{lesson.favorites?.length || 0}</td>

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

                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="btn btn-xs btn-outline"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(lesson._id)}
                      className="btn btn-xs btn-error btn-outline"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========== EDIT MODAL ========== */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setEditingLesson(null)}
              className="absolute right-4 top-4"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold mb-4">Update Lesson</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <input
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="input input-bordered w-full"
              />

              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="textarea textarea-bordered w-full"
              />

              <input
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    image: e.target.value,
                  })
                }
                placeholder="Image URL"
                className="input input-bordered w-full"
              />

              <select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    visibility: e.target.value,
                  })
                }
                className="select select-bordered w-full"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <select
                value={formData.accessLevel}
                disabled={!isPremium}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accessLevel: e.target.value,
                  })
                }
                className="select select-bordered w-full"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>

              {!isPremium && (
                <p className="text-xs text-amber-600">
                  Upgrade to Premium to publish paid lessons
                </p>
              )}

              <button className="btn btn-primary w-full" type="submit">
                Update Lesson
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRM ========== */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm">
            <h3 className="font-bold text-lg mb-3">Delete lesson?</h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="btn btn-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="btn btn-sm btn-error"
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
