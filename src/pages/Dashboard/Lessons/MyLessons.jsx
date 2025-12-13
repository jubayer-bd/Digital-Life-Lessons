import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import { Heart, Lock, Globe, Edit2, Trash2, X } from "lucide-react";

const MyLessons = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({});

  // Define the key in a variable to ensure consistency across Query and Mutations
  const queryKey = ["my-lessons", user?.email];

  // -------- Fetch Lessons --------
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: queryKey,
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/my-lessons");
      return res.data.filter((lesson) => !lesson.isDeleted);
    },
  });

  // -------- Soft Delete Mutation --------
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/lessons/${id}/trash`),
    onMutate: async (id) => {
      // 1. Cancel ongoing refetches
      await queryClient.cancelQueries({ queryKey });

      // 2. Get previous data
      const previous = queryClient.getQueryData(queryKey);

      // 3. Optimistically update
      queryClient.setQueryData(queryKey, (old) => {
        return old ? old.filter((lesson) => lesson._id !== id) : [];
      });

      // 4. Return context
      return { previous };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // -------- Edit Mutation (FIXED SYNTAX) --------
  const editMutation = useMutation({
    // FIX 1: Moved mutationFn inside the object (Required for v5)
    mutationFn: ({ id, updatedData }) => 
      axiosSecure.patch(`/lessons/${id}`, updatedData),
    
    onMutate: async ({ id, updatedData }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      // FIX 2: Used the correct queryKey variable
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return [];
        return old.map((lesson) =>
          lesson._id === id ? { ...lesson, ...updatedData } : lesson
        );
      });
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // -------- Handlers --------
  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
    setFormData({ ...lesson });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Pass the arguments as a single object to mutate
    editMutation.mutate({ id: editingLesson._id, updatedData: formData });
    setEditingLesson(null);
  };

  const handleDelete = (id) => deleteMutation.mutate(id);

  // -------- Loading --------
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Lessons</h2>
      {lessons.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          You haven’t created any lessons yet.
        </div>
      )}

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={lesson.image}
              alt={lesson.title}
              className="h-44 w-full object-cover"
            />
            <div className="p-5 space-y-3">
              <h3 className="text-lg font-bold text-gray-800">
                {lesson.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {lesson.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="badge badge-outline">{lesson.category}</span>
                <span className="badge badge-outline">
                  {lesson.emotionalTone}
                </span>
                <span
                  className={`badge ${
                    lesson.accessLevel === "premium"
                      ? "badge-warning"
                      : "badge-success"
                  }`}
                >
                  {lesson.accessLevel}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Heart size={16} /> {lesson.likesCount}
                </div>
                <div className="flex items-center gap-1">
                  {lesson.visibility === "private" ? (
                    <>
                      <Lock size={16} /> Private
                    </>
                  ) : (
                    <>
                      <Globe size={16} /> Public
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  onClick={() => handleEditClick(lesson)}
                  className="btn btn-sm btn-outline  flex items-center justify-center gap-1"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(lesson._id)}
                  className="btn btn-sm btn-error btn-outline flex items-center justify-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* -------- Edit Modal -------- */}
      {editingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
            <button
              onClick={() => setEditingLesson(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Lesson</h3>
            <form className="space-y-3" onSubmit={handleEditSubmit}>
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="input input-bordered w-full h-24"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                className="input input-bordered w-full"
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Emotional Tone"
                className="input input-bordered w-full"
                value={formData.emotionalTone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, emotionalTone: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                className="input input-bordered w-full"
                value={formData.image || ""}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              <select
                className="select select-bordered w-full"
                value={formData.accessLevel || "free"}
                onChange={(e) =>
                  setFormData({ ...formData, accessLevel: e.target.value })
                }
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <select
                className="select select-bordered w-full"
                value={formData.visibility || "public"}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <button type="submit" className="btn btn-primary w-full mt-2">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLessons;