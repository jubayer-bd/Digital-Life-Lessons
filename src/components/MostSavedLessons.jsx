import { useQuery } from "@tanstack/react-query";
import { Bookmark, ArrowUpRight, User } from "lucide-react";
import { motion } from "framer-motion";
import useAxios from "../hooks/useAxios";
import { Link } from "react-router";

export default function MostSavedLessons() {
  const axiosSecure = useAxios();
  const { data = [], isLoading } = useQuery({
    queryKey: ["most-saved-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("most-saved-lessons");
      return res.data;
    },
  });
  console.log(data);

  if (isLoading) return <LessonsSkeleton />;

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Community Favorites
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              The most bookmarked and high-value lessons.
            </p>
          </div>
          <div className="hidden sm:block p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Bookmark
              className="text-blue-600"
              size={28}
              fill="rgba(37, 99, 235, 0.1)"
            />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((lesson, index) => (
            <motion.div
              key={lesson._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="flex flex-col bg-white rounded-3xl p-7 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-5">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Bookmark size={20} />
                </span>
                <Link
                  to={`/lessons/${lesson._id}`}
                  className="text-gray-300 hover:text-blue-600 transition-colors"
                >
                  <ArrowUpRight size={24} />
                </Link>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {lesson.title}
              </h3>

              <p className="text-gray-600 mb-8 line-clamp-3 leading-relaxed">
                {lesson.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {lesson.authorName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 rounded-full text-white shadow-md shadow-blue-200">
                  <span className="text-xs font-bold">{lesson.saveCount}</span>
                  <span className="text-[10px] uppercase font-black">
                    Saves
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LessonsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse">
      <div className="h-10 w-48 bg-gray-200 rounded mb-4" />
      <div className="h-6 w-72 bg-gray-100 rounded mb-12" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-72 bg-white border border-gray-100 rounded-3xl"
          />
        ))}
      </div>
    </div>
  );
}
