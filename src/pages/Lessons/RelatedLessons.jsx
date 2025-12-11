import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const RelatedLessons = ({ currentCategory, currentTone, currentId }) => {
  const axiosSecure = useAxios();

  // prevent running query if lesson props are missing
  const enabled = Boolean(currentCategory && currentTone && currentId);

  const { data: relatedLessons = [], isLoading } = useQuery({
    queryKey: ["relatedLessons", currentCategory, currentTone, currentId],
    enabled, // MUST be boolean
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/lessons/related?category=${currentCategory}&tone=${currentTone}&id=${currentId}`
      );
      return res.data;
    },
  });

  // Loading state
  if (!enabled || isLoading)
    return (
      <p className="text-gray-500 text-center py-4">
        Loading related lessons...
      </p>
    );

  // Empty state
  if (relatedLessons.length === 0)
    return (
      <p className="text-gray-500 text-center py-4">
        No related lessons found.
      </p>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedLessons.map((item) => (
        <Link
          to={`/lessons/${item._id}`}
          key={item._id}
          className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
        >
          {/* Lesson Image */}
          <div className="h-40 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          {/* Lesson Content */}
          <div className="p-4">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {item.category}
            </span>

            <h4 className="font-bold text-gray-900 mt-2 mb-1 truncate">
              {item.title}
            </h4>

            <p className="text-sm text-gray-500 group-hover:text-blue-600 transition">
              Read more →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedLessons;
