import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Info } from "lucide-react";
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
  const { isPremium } = useIsPremium();
  console.log(isPremium);

  const { register, handleSubmit, reset } = useForm();

  const [isPremiumUser] = useState(isPremium === true);

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
    data.authorName = user?.name;
    data.authorEmail = user?.email;
    data.authorImage = user?.photo;
    data.createdAt = new Date().toISOString();
    data.likes = [];
    data.favorites = [];
    data.likesCount = 0;
    data.favoritesCount = 0;

    mutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Lesson</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="block font-semibold">Lesson Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border p-3 rounded"
            placeholder="Enter lesson title"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold">Full Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border p-3 rounded h-32"
            placeholder="Write your insight or story here..."
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block font-semibold">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full border p-3 rounded"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* EMOTIONAL TONE */}
        <div>
          <label className="block font-semibold">Emotional Tone</label>
          <select
            {...register("emotionalTone", { required: true })}
            className="w-full border p-3 rounded"
          >
            <option value="">Select tone</option>
            {tones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* IMAGE */}
        <div>
          <label className="block font-semibold">Image URL (Optional)</label>
          <input
            {...register("image")}
            className="w-full border p-3 rounded"
            placeholder="Paste an image URL"
          />
        </div>

        {/* PRIVACY */}
        <div>
          <label className="block font-semibold">Privacy</label>
          <select
            {...register("visibility", { required: true })}
            className="w-full border p-3 rounded"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* ACCESS LEVEL */}
        <div className="relative">
          <label className="block font-semibold">Access Level</label>

          <select
            {...register("accessLevel")}
            disabled={!isPremiumUser}
            className={`w-full border p-3 rounded ${
              !isPremiumUser ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>

          {!isPremiumUser && (
            <div className="flex items-center gap-2 mt-1 text-sm text-red-500">
              <Info size={16} />
              Upgrade to Premium to create paid lessons
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {mutation.isPending ? "Saving..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;
