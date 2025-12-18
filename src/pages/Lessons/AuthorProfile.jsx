import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/PageLoader";
import { BookOpen, MapPin, Mail, ArrowLeft } from "lucide-react";

const AuthorProfile = () => {
  const { email } = useParams();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  // 1. Fetch Author Details
  const { data: author, isLoading: authorLoading } = useQuery({
    queryKey: ["authorProfile", email],
    queryFn: async () => {
      // Assuming you have an endpoint to get user by email, or you can get name from the first lesson
      const res = await axiosSecure.get(`/users/${email}`);
      return res.data;
    },
    retry: 1,
  });
 
  // 2. Fetch Author's Lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["authorLessons", email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}/lessons`);
      return res.data;
    },
  });

  if (authorLoading || lessonsLoading)
    return <PageLoader text="Loading Profile..." />;

  // Calculate total likes received by this author across all lessons
  const totalLikes = lessons.reduce(
    (sum, lesson) => sum + (lesson.likesCount || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* --- PROFILE CARD --- */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-start gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <img
                src={author?.photoURL || "https://i.ibb.co/t2Wz12d/user1.jpg"}
                alt={author?.displayName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 mt-16 md:mt-12 md:pl-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {author?.displayName || "Unknown Author"}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Mail size={14} /> {email}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase tracking-wide">
                  Author
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 px-2 py-1">
                  <MapPin size={14} /> Earth
                </span>
              </div>
            </div>

            {/* Stats Box */}
            <div className="mt-8 md:mt-12 flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none bg-blue-50 px-6 py-4 rounded-2xl text-center border border-blue-100 min-w-[100px]">
                <span className="block text-2xl font-bold text-blue-700">
                  {lessons.length}
                </span>
                <span className="text-xs text-blue-600 uppercase font-bold tracking-wider">
                  Lessons
                </span>
              </div>
              <div className="flex-1 md:flex-none bg-purple-50 px-6 py-4 rounded-2xl text-center border border-purple-100 min-w-[100px]">
                <span className="block text-2xl font-bold text-purple-700">
                  {totalLikes}
                </span>
                <span className="text-xs text-purple-600 uppercase font-bold tracking-wider">
                  Likes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LESSONS GRID --- */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <BookOpen size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Published Lessons</h2>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg font-medium">
            This author hasn't published any lessons yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              onClick={() => navigate(`/lessons/${lesson._id}`)}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Card Image */}
              <div className="h-48 overflow-hidden relative bg-gray-200">
                {lesson.image ? (
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <BookOpen size={40} />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wide">
                    {lesson.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                  {lesson.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Read Lesson →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorProfile;
