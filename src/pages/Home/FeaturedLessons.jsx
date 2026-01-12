import React from "react";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import LessonCard from "../Lessons/LessonCard";
import PageLoader from "../../components/PageLoader";

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
      <h2 className=" text-2xl  md:text-4xl font-extrabold text-blue-600 text-center my-8">
        Featured Lessons : {lessons.length}
      </h2>

      {isLoading ? (
        <PageLoader text="loading featured lessons ..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedLessons;
