import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export const InsightCard = ({ category, title, snippet }) => {
  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      className="relative w-80 h-96 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl cursor-pointer group"
    >
      {/* Background Gradient Blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

      <div className="p-8 h-full flex flex-col relative z-10">
        <div className="mb-4">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-purple-300 bg-purple-900/30 rounded-full border border-purple-500/20">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed mb-auto">
          {snippet}
        </p>

        {/* Animated Footer */}
        <div className="flex items-center justify-between border-t border-gray-800 pt-6 mt-6">
          <BookOpen size={18} className="text-gray-500" />

          <motion.div
            variants={{
              initial: { x: 0 },
              hover: { x: 5 },
            }}
            className="flex items-center gap-2 text-purple-400 text-sm font-medium"
          >
            Read Lesson <ArrowRight size={16} />
          </motion.div>
        </div>
      </div>

      {/* Hover Border Glow */}
      <motion.div
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 1 },
        }}
        className="absolute inset-0 border-2 border-purple-500/50 rounded-2xl pointer-events-none"
      />
    </motion.div>
  );
};
