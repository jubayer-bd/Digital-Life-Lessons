import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import useAxios from "../../hooks/useAxios";

const RelatedLessons = ({ currentCategory, currentTone, currentId }) => {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const enabled = Boolean(currentCategory && currentTone && currentId);

  const { data: relatedLessons = [], isLoading } = useQuery({
    queryKey: ["relatedLessons", currentCategory, currentTone, currentId],
    enabled,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/lessons/related?category=${encodeURIComponent(
          currentCategory
        )}&tone=${encodeURIComponent(currentTone)}&id=${currentId}`
      );
      return res.data;
    },
  });

  if (!enabled || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-gray-100 h-64 rounded-xl animate-pulse" />
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
      {relatedLessons.map((item) =>
        item.accessLevel === "free" ? (
          <Link
            key={item._id}
            to={`/lessons/${item._id}`}
            className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
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

            <div className="p-5 flex flex-col flex-1">
              <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                {item.title}
              </h4>

              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                {item.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  Read Now →
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div key={item._id} className="relative rounded-xl overflow-hidden">
            <div className="prose prose-lg blur-[8px] opacity-40 pointer-events-none h-80 overflow-hidden">
              <p>{item.description?.substring(0, 500)}...</p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 p-6 rounded-2xl text-center">
                <Lock className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <button
                  onClick={() => navigate("/pricing")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full"
                >
                  Unlock Access
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RelatedLessons;
