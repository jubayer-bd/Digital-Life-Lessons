import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { toast } from "react-hot-toast";
import { Star } from "lucide-react";
import LessonCard from "../../Lessons/LessonCard";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import useIsPremium from "../../../hooks/useIsPremimum";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxios();
  const { isPremium } = useIsPremium();

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [editing, setEditing] = useState(false);

  /* ================= COUNTS ================= */
  const { data: stats = { created: 0, saved: 0 } } = useQuery({
    queryKey: ["profile-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/users/profile-stats");
      return res.data;
    },
  });

  /* ================= PUBLIC LESSONS ================= */
  const { data: lessons = [] } = useQuery({
    queryKey: ["public-lessons", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/user/${user.email}`);
      return res.data;
    },
  });

  /* ================= UPDATE PROFILE ================= */
  const updateMutation = useMutation({
    mutationFn: async () => {
      await updateUserProfile(name, photo); // Firebase update
      return axiosSecure.patch("/users/profile", {
        name,
        photo,
      });
    },
    onSuccess: () => {
      toast.success("Profile updated");
      setEditing(false);
    },
    onError: () => toast.error("Update failed"),
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={photo || "/avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover"
        />

        <div className="flex-1">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-3 max-w-sm">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Display name"
              />

              <input
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Photo URL"
              />

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary btn-sm">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {user?.displayName}
                {isPremium && (
                  <span className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={16} /> Premium
                  </span>
                )}
              </h2>

              <p className="text-gray-500">{user?.email}</p>

              <div className="flex gap-6 mt-3 text-sm text-gray-600">
                <span>
                  <strong>{stats.created}</strong> Lessons
                </span>
                <span>
                  <strong>{stats.saved}</strong> Saved
                </span>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="btn btn-outline btn-sm mt-4"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* USER PUBLIC LESSONS */}
      <div>
        <h3 className="text-2xl font-bold mb-6">
          Public Lessons by {user?.displayName}
        </h3>

        {lessons.length === 0 ? (
          <div className="text-gray-500 text-center py-20">
            No public lessons yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <LessonCard key={lesson._id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
