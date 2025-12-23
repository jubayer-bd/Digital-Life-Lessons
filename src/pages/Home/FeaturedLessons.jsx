import React from "react";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../Lessons/LessonCard";

const FeaturedLessons = () => {
  const axiosSecure = useAxios();
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["featured-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/featured?limit=6");
      return res.data.lessons;
    },
  });
  return (
    <div className="py-12">
      <h2 className="text-2xl font-semibold mb-6">
        Featured Lessons : {lessons.length}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedLessons;
