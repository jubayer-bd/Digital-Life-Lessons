import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import LessonCard from "./LessonCard";
import useAuth from "../../hooks/useAuth"; // 1. Import your Auth hook
import useIsPremium from "../../hooks/useIsPremimum";

const Lessons = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth(); // 2. Get current user data
  const {isPremium} = useIsPremium();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">All Lessons</h1>

      {/* Loading State - Improved to match Card height */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-[400px] bg-gray-200 animate-pulse rounded-xl"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="alert alert-error shadow-lg">
          <span>Failed to load lessons: {error.message}</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && lessons.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No lessons found.</p>
        </div>
      )}

      {/* Lessons Grid */}
      {!isLoading && lessons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              // 3. Pass the user's premium status to the card
              isUserPremium={isPremium}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Lessons;
