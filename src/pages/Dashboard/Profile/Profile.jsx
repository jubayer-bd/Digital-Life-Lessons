import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Star, User, BookOpen, Heart, Edit3, CheckCircle } from "lucide-react";
import LessonCard from "../../Lessons/LessonCard";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import useIsPremium from "../../../hooks/useIsPremium";
import PageLoader from "../../../components/PageLoader";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const { isPremium, roleLoading } = useIsPremium();

  const [editState, setEditState] = useState({
    isEditing: false,
    name: user?.displayName || "",
    photo: user?.photoURL || "",
  });

  // Fetch stats and lessons in separate queries for better UX
  const { data: stats = { created: 0, saved: 0 }, isLoading: userLoading } =
    useQuery({
      queryKey: ["profile-stats", user?.email],
      enabled: !!user?.email,
      queryFn: async () => (await axiosSecure.get("/users/profile-stats")).data,
    });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["public-lessons"],
    enabled: !!user?.email,
    queryFn: async () => (await axiosSecure.get(`/user/profile`)).data,
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await updateUserProfile({
        displayName: editState.name,
        photoURL: editState.photo,
      });

      return axiosSecure.patch("/users/profile", {
        displayName: editState.name,
        photoURL: editState.photo,
      });
    },
    onSuccess: () => {
      toast.success("Profile Updated", { id: "user-upd" });
      setEditState((prev) => ({ ...prev, isEditing: false }));
      queryClient.invalidateQueries(["public-lessons"]);
    },
  });
  if (userLoading) {
    return <PageLoader text="loading profile" />;
  }
  if (roleLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Hero Profile Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 rounded-[2rem] shadow-sm border p-8">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="relative">
            <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl rotate-3 bg-white p-2">
              <img
                src={
                  editState.photo ||
                  "https://ui-avatars.com/api/?name=" + user?.displayName
                }
                className="w-full h-full object-cover rounded-2xl"
                alt="Avatar"
              />
            </div>
            {isPremium && (
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-white p-2 rounded-full shadow-lg border-4 border-white">
                <Star size={20} fill="currentColor" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            {editState.isEditing ? (
              <div className="flex flex-col gap-3 max-w-md">
                <input
                  value={editState.name}
                  onChange={(e) =>
                    setEditState({ ...editState, name: e.target.value })
                  }
                  className="input input-bordered focus:ring-2 ring-blue-500"
                />
                <input
                  value={editState.photo}
                  onChange={(e) =>
                    setEditState({ ...editState, photo: e.target.value })
                  }
                  className="input input-bordered"
                  placeholder="Photo URL"
                />
                <div className="flex gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => updateMutation.mutate()}
                    className="btn bg-blue-600 text-white btn-sm rounded-full px-6"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      setEditState({ ...editState, isEditing: false })
                    }
                    className="btn  rounded-full text-black border-blue-600 btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h2 className="text-4xl font-black text-gray-900">
                    {user?.displayName}
                  </h2>
                  {isPremium && (
                    <span className="badge badge-warning font-bold py-3 px-4">
                      PREMIUM
                    </span>
                  )}
                </div>
                <p className="text-gray-500 font-medium mt-1">{user?.email}</p>

                {/* Stats Grid */}
                <div className="flex gap-4 mt-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border shadow-sm">
                    <BookOpen size={18} className="text-blue-500" />
                    <span className="font-bold text-gray-800">
                      {stats.created}
                    </span>
                    <span className="text-gray-500 text-sm">Lessons</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border shadow-sm">
                    <Heart size={18} className="text-pink-500" />
                    <span className="font-bold text-gray-800">
                      {stats.saved}
                    </span>
                    <span className="text-gray-500 text-sm">Favorites</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setEditState({ ...editState, isEditing: true })
                  }
                  className="mt-6 flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                >
                  <Edit3 size={16} /> Edit Public Profile
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">
            Portfolio Lessons
          </h3>
          <div className="h-px flex-1 bg-gray-100 mx-6 hidden sm:block"></div>
        </div>

        {lessonsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 animate-pulse rounded-3xl"
              ></div>
            ))}
          </div>
        ) : lessons.length === 0 ? (
          <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed">
            <p className="text-gray-400 font-medium">
              No public lessons published yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="transition-transform hover:-translate-y-2"
              >
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
