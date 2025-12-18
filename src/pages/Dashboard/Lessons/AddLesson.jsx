import React, { useState } from "react"; // Added useState
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Info, Lock } from "lucide-react";
import Lottie from "lottie-react"; // Import Lottie
import successAnim from "../../../assets/success-animation.json"; // Path to your json file
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import useIsPremium from "../../../hooks/useIsPremium";

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
  const { isPremium, roleLoading } = useIsPremium();
  const [showSuccess, setShowSuccess] = useState(false); // State to trigger animation

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { accessLevel: "free", visibility: "public" },
  });

  const mutation = useMutation({
    mutationFn: async (lesson) => {
      const res = await axiosSecure.post("/lessons", lesson);
      return res.data;
    },
    onSuccess: () => {
      setShowSuccess(true); // Show animation
      toast.success("🎉 Lesson created successfully!");
      reset();

      // Hide animation after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: () => {
      toast.error("Failed to create lesson");
    },
  });

  const onSubmit = (data) => {
    const lessonData = {
      ...data,
      authorName: user?.displayName,
      authorEmail: user?.email,
      authorImage: user?.photoURL,
      createdAt: new Date(),
      viewCount: 0,
      likes: [],
      favorites: [],
      accessLevel: isPremium ? data.accessLevel : "free",
    };
    mutation.mutate(lessonData);
  };

  if (roleLoading)
    return (
      <div className="flex justify-center py-20 text-gray-400">Loading...</div>
    );

  return (
    <div className="relative max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      {/* --- Lottie Success Overlay --- */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 rounded-3xl backdrop-blur-sm">
          <div className="w-64 h-64">
            <Lottie animationData={successAnim} loop={false} />
          </div>
          <h3 className="text-2xl font-bold text-blue-600 animate-bounce">
            Lesson Published!
          </h3>
        </div>
      )}

      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">
        Create New <span className="text-blue-600">Lesson</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Lesson Title
          </label>
          <input
            {...register("title", { required: true })}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none transition-all"
            placeholder="Enter lesson title"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Full Description
          </label>
          <textarea
            {...register("description", { required: true })}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 outline-none h-40 transition-all"
            placeholder="Write your story..."
          />
        </div>

        {/* CATEGORY & TONE */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label text-sm font-bold text-gray-700">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="select select-bordered focus:border-blue-600 rounded-xl"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label text-sm font-bold text-gray-700">
              Emotional Tone
            </label>
            <select
              {...register("emotionalTone", { required: true })}
              className="select select-bordered focus:border-blue-600 rounded-xl"
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

        {/* IMAGE URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Image URL (Optional)
          </label>
          <input
            {...register("image")}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-600 transition-all"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        {/* PRIVACY & ACCESS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-control">
            <label className="label text-sm font-bold text-gray-700">
              Privacy
            </label>
            <select
              {...register("visibility")}
              className="select select-bordered rounded-xl"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label text-sm font-bold text-gray-700 flex items-center gap-2">
              Access Level{" "}
              {!isPremium && <Lock size={14} className="text-gray-400" />}
            </label>
            <select
              {...register("accessLevel")}
              disabled={!isPremium}
              className={`select select-bordered rounded-xl ${
                !isPremium && "bg-gray-100 cursor-not-allowed"
              }`}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
            {!isPremium && (
              <div className="flex items-center gap-2 mt-2 text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg font-medium">
                <Info size={12} /> UPGRADE TO PUBLISH PREMIUM CONTENT
              </div>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
        >
          {mutation.isPending ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Publish Lesson"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;
