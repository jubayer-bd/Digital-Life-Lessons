import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/PageLoader";

const UserProfile = () => {
  const { email } = useParams();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  // 1️⃣ Fetch user info
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["profileUser", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
  });

  // 2️⃣ Fetch user's lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["userLessons", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}/lessons`);
      return res.data;
    },
  });

  if (userLoading || lessonsLoading)
    return <PageLoader text="profile is loading"/>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ---------- USER INFO CARD ---------- */}
      <div className="bg-gray-50 p-8 rounded-xl mb-10 shadow-sm">
        <div className="flex items-center gap-8">
          <img
            src={user?.photo || "https://i.ibb.co/t2Wz12d/user1.jpg"}
            alt={user?.name}
            className="w-28 h-28 rounded-full shadow border"
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>

            <div className="mt-3 text-sm text-gray-700">
              <p>
                <strong>Total Lessons:</strong> {lessons.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- USER LESSONS ---------- */}
      <h3 className="text-2xl font-bold mb-6">Lessons by {user?.name}</h3>

      {lessons.length === 0 ? (
        <p className="text-gray-500">
          This user has not published any lessons.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              onClick={() => navigate(`/lessons/${lesson._id}`)}
              className="cursor-pointer bg-white shadow hover:shadow-lg transition p-5 rounded-xl border"
            >
              {lesson.image && (
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}

              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {lesson.title}
              </h4>

              <p className="text-gray-600 text-sm line-clamp-3">
                {lesson.description}
              </p>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>{lesson.category}</span>
                <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
