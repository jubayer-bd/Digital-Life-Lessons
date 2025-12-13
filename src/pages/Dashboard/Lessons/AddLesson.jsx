import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Info, Lock } from "lucide-react"; // Added Lock icon
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

  // Destructure isLoading to prevent rendering before we know the status
  const { isPremium, isLoading: premiumLoading } = useIsPremium();

  const { register, handleSubmit, reset } = useForm();

  // --- SUBMIT MUTATION ---
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/lessons", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Lesson created successfully!");
      reset();
    },
    onError: () => toast.error("Failed to create lesson"),
  });

  const onSubmit = (data) => {
    // 1. Fixed: Use proper Firebase keys (displayName/photoURL)
    data.authorName = user?.displayName;
    data.authorEmail = user?.email;
    data.authorImage = user?.photoURL;

    data.createdAt = new Date().toISOString();
    data.likes = [];
    data.favorites = [];
    data.likesCount = 0;
    data.favoritesCount = 0;

    // Force free if user manipulates DOM to select premium
    if (!isPremium && data.accessLevel === "premium") {
      data.accessLevel = "free";
    }

    mutation.mutate(data);
  };

  if (premiumLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Create New Lesson
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="block font-semibold mb-1">Lesson Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter lesson title"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold mb-1">Full Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border p-3 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Write your insight or story here..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* CATEGORY */}
          <div>
            <label className="block font-semibold mb-1">Category</label>
            <select
              {...register("category", { required: true })}
              className="w-full border p-3 rounded-lg bg-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* EMOTIONAL TONE */}
          <div>
            <label className="block font-semibold mb-1">Emotional Tone</label>
            <select
              {...register("emotionalTone", { required: true })}
              className="w-full border p-3 rounded-lg bg-white"
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
            className="w-full border p-3 rounded-lg"
            placeholder="Paste an image URL"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* PRIVACY */}
          <div>
            <label className="block font-semibold mb-1">Privacy</label>
            <select
              {...register("visibility", { required: true })}
              className="w-full border p-3 rounded-lg bg-white"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* ACCESS LEVEL */}
          <div className="relative">
            <label className="block font-semibold mb-1 flex items-center gap-2">
              Access Level
              {!isPremium && <Lock size={14} className="text-gray-400" />}
            </label>

            <select
              {...register("accessLevel")}
              disabled={!isPremium}
              className={`w-full border p-3 rounded-lg ${
                !isPremium
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white"
              }`}
              defaultValue="free"
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            {!isPremium && (
              <div className="flex items-center gap-2 mt-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <Info size={14} />
                <span>Upgrade to Premium to create paid content.</span>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
        >
          {mutation.isPending ? "Publishing..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;
