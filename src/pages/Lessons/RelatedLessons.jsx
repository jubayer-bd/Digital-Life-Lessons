import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const RelatedLessons = ({ currentCategory, currentTone, currentId }) => {
  const axiosSecure = useAxios();

  const enabled = Boolean(currentCategory && currentTone && currentId);

  const { data: relatedLessons = [], isLoading } = useQuery({
    queryKey: ["relatedLessons", currentCategory, currentTone, currentId],
    enabled,
    queryFn: async () => {
      // Use the API endpoint we created in step 1
      const res = await axiosSecure.get(
        `/lessons/related?category=${currentCategory}&tone=${currentTone}&id=${currentId}`
      );
      return res.data;
    },
  });

  if (!enabled || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-100 h-64 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (relatedLessons.length === 0) {
    return (
      <p className="text-gray-500 py-4 italic">
        No similar lessons found right now. Check back later!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedLessons.map((item) => (
        <Link
          to={`/lessons/${item._id}`}
          key={item._id}
          className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          {/* Image */}
          <div className="h-48 overflow-hidden relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-3 left-3">
               <span className="bg-white/90 backdrop-blur text-blue-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
                {item.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {item.title}
            </h4>
            
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
               {/* Strip HTML tags if description has them, or just show description */}
               {item.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
               <span className="text-xs font-medium text-gray-400">
                 {new Date(item.createdAt).toLocaleDateString()}
               </span>
               <span className="text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                 Read Now →
               </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedLessons;