import { useQuery } from "@tanstack/react-query";
import { Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";
import useAxios from "../hooks/useAxios";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function TopContributors() {
  const axiosSecure = useAxios();
  const { data = [], isLoading } = useQuery({
    queryKey: ["top-contributors"],
    queryFn: async () => {
      const res = await axiosSecure.get("top-contributors");
      return res.data;
    },
  });

  if (isLoading) return <ContributorsSkeleton />;

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                <Trophy size={20} />
              </span>
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                Leaderboard
              </span>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Top Contributors
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              The amazing creators shaping our community this week.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {data.map((user) => (
            <motion.div
              key={user._id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="relative mb-6">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-50 group-hover:ring-blue-50 transition-all"
                />
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                  <Star size={14} fill="currentColor" />
                </div>
              </div>

              <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                {user.name}
              </h3>
              <p className="text-gray-500 font-medium mt-1">
                {user.totalLessons} Lessons Shared
              </p>

              <div className="mt-6 pt-6 border-t border-gray-50">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Top Tier
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Simple Skeleton Loader
function ContributorsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded mb-10" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-100 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
