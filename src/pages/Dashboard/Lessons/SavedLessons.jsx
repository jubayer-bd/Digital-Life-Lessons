import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const SavedLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");

  const queryKey = ["saved-lessons", user?.email];

  /* ================= FETCH SAVED ================= */
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["saved-lessons", category, tone],
    queryFn: async () => {
      const params = {};
      if (category) params.category = category;
      if (tone) params.tone = tone;

      const res = await axiosSecure.get("/lessons/saved", {
        params,
      });
      return res.data;
    },
  });

  /* ================= REMOVE FAVORITE ================= */
  const removeMutation = useMutation({
    mutationFn: (lessonId) => axiosSecure.delete(`/lessons/saved/${lessonId}`),

    onMutate: async (lessonId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) =>
        old.filter((l) => l._id !== lessonId)
      );

      return { previous };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(queryKey, context.previous);
      toast.error("Failed to remove from favorites");
    },

    onSuccess: () => {
      toast.success("Removed from favorites");
    },
  });

  /* ================= FILTER ================= */
  const filteredLessons = lessons.filter((lesson) => {
    return (
      (!category || lesson.category === category) &&
      (!tone || lesson.emotionalTone === tone)
    );
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading saved lessons...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">Saved Lessons</h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Categories</option>
          <option value="Personal Growth">Personal Growth</option>
          <option value="Career">Career</option>
          <option value="Relationships">Relationships</option>
          <option value="Mindset">Mindset</option>
          <option value="Mistakes Learned">Mistakes Learned</option>
        </select>

        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Tones</option>
          <option value="Motivational">Motivational</option>
          <option value="Sad">Sad</option>
          <option value="Realization">Realization</option>
          <option value="Gratitude">Gratitude</option>
        </select>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No saved lessons found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="table w-full">
            <thead className="bg-gray-50 text-sm">
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Tone</th>
                <th>Saved At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLessons.map((lesson) => (
                <tr key={lesson._id}>
                  <td className="font-semibold">{lesson.title}</td>
                  <td>{lesson.category}</td>
                  <td>{lesson.emotionalTone}</td>
                  <td>
                    {new Date(
                      lesson.savedAt || lesson.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="flex gap-2">
                    <Link
                      to={`/lessons/${lesson._id}`}
                      className="btn btn-xs btn-outline"
                    >
                      <Eye size={14} />
                    </Link>

                    <button
                      onClick={() => removeMutation.mutate(lesson._id)}
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
    </div>
  );
};

export default SavedLessons;
