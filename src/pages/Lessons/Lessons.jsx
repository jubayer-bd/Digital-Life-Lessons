import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import LessonCard from "./LessonCard";

const Lessons = () => {
  const axiosSecure = useAxios();

  const {
    data: lessons = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons");
      return res.data;
    },
  });
  console.log(lessons)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">All Lessons</h1>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-48 bg-gray-200 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <p className="text-red-500 text-lg">
          Failed to load lessons: {error.message}
        </p>
      )}

      {/* Empty State */}
      {!isLoading && lessons.length === 0 && (
        <p className="text-gray-500 text-lg">No lessons found.</p>
      )}

      {/* Lessons Grid */}
      {!isLoading && lessons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;
