import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Info, Lock } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import useIsPremium from "../../../hooks/useIsPremimum";

const categories = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

const tones = ["Motivational", "Sad", "Realization", "Gratitude"];

const AddLesson = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { isPremium, isLoading: premiumLoading } = useIsPremium();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      accessLevel: "free",
      visibility: "public",
    },
  });

  /* ======================
      CREATE LESSON
  ====================== */
  const mutation = useMutation({
    mutationFn: async (lesson) => {
      const res = await axiosSecure.post("/lessons", lesson);
      return res.data;
    },
    onSuccess: () => {
      toast.success("🎉 Lesson created successfully!");
      reset();
    },
    onError: () => {
      toast.error("Failed to create lesson");
    },
  });

  const onSubmit = (data) => {
    const lessonData = {
      title: data.title,
      description: data.description,
      category: data.category,
      emotionalTone: data.emotionalTone,
      image: data.image || "",
      visibility: data.visibility,
      accessLevel: isPremium ? data.accessLevel : "free",

      authorName: user?.displayName,
      authorEmail: user?.email,
      authorImage: user?.photoURL,

      createdAt: new Date(),
      viewCount: 0,
      likes: [],
      favorites: [],
    };

    mutation.mutate(lessonData);
  };

  if (premiumLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-400">Loading...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Lesson
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* TITLE */}
        <div>
          <label className="block font-semibold mb-1">Lesson Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Enter lesson title"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold mb-1">
            Full Description / Insight
          </label>
          <textarea
            {...register("description", { required: true })}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none h-40"
            placeholder="Write your story or life lesson..."
          />
        </div>

        {/* CATEGORY & TONE */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              {...register("category", { required: true })}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:bg-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Emotional Tone</label>
            <select
              {...register("emotionalTone", { required: true })}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:bg-white"
            >
              <option value="">Select tone</option>
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <label className="block font-semibold mb-1">
            Image URL (Optional)
          </label>
          <input
            {...register("image")}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 focus:bg-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* PRIVACY & ACCESS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Privacy</label>
            <select
              {...register("visibility")}
              className="w-full px-4 py-3 rounded-lg bg-gray-100"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 flex items-center gap-2">
              Access Level
              {!isPremium && <Lock size={14} className="text-gray-400" />}
            </label>

            <select
              {...register("accessLevel")}
              disabled={!isPremium}
              className={`w-full px-4 py-3 rounded-lg ${
                isPremium
                  ? "bg-gray-100"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            {!isPremium && (
              <div className="flex items-center gap-2 mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
                <Info size={14} />
                Upgrade to Premium to create paid lessons
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {mutation.isPending ? "Publishing..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;
