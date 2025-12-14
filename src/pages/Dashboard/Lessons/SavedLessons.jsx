import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";

const SavedLessons = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["saved-lessons"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons/saved");
      return res.data.filter((lesson) => !lesson.isDeleted);
    },
  });
  console.log(lessons);
  return <div>Saved Lessons</div>;
};

export default SavedLessons;
