import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Lock, Unlock, ArrowRight, User, Star, Clock } from "lucide-react"; // install lucide-react if not present
import useIsPremium from "../../hooks/useIsPremimum";

const LessonCard = ({ lesson }) => {
  const { isPremium: isUserPremium } = useIsPremium();
  const isLocked = lesson.accessLevel === "premium" && !isUserPremium;

  return (
    <div className="group relative h-full flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* --- Image Section --- */}
      <figure className="relative h-52 overflow-hidden">
        <img
          src={lesson.image}
          alt={lesson.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isLocked ? "blur-[2px] grayscale-[30%]" : ""
          }`}
        />

        {/* Access Level Badge (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          {lesson.accessLevel === "premium" ? (
            <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              <Star size={10} fill="currentColor" /> Premium
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              Free
            </span>
          )}
        </div>

        {/* Locked Overlay (Glassmorphism) */}
        {isLocked && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 transition-opacity duration-300">
            <div className="bg-white/10 p-4 rounded-full mb-3 backdrop-blur-md border border-white/20">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-lg">Premium Content</h3>
            <p className="text-gray-200 text-xs mt-1 mb-4">
              Subscribe to unlock this lesson
            </p>
          </div>
        )}
      </figure>

      {/* --- Content Body --- */}
      <div className="flex flex-col flex-grow p-5">
        {/* Meta Row: Date & Tone */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            {lesson.createdAt
              ? format(new Date(lesson.createdAt), "MMM d, yyyy")
              : "N/A"}
          </div>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 font-medium border border-blue-100 text-[10px] uppercase tracking-wide">
            {lesson.emotionalTone || "Neutral"}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          {lesson.title}
        </h2>

        {/* Category Pill */}
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-1 rounded">
            #{lesson.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
          {lesson.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full mb-4"></div>

        {/* Footer: Author & CTA */}
        <div className="flex items-center justify-between mt-auto">
          {/* Author */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500">
              <img
                src={lesson.authorImage || "https://via.placeholder.com/40"}
                alt={lesson.authorName}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-800">
                {lesson.authorName}
              </span>
              <span className="text-[10px] text-gray-400">Author</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={isLocked ? "/pricing/upgrade" : `/lessons/${lesson._id}`}
            className={`group/btn relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              isLocked
                ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
            }`}
          >
            {isLocked ? (
              <>
                Unlock <Lock size={14} />
              </>
            ) : (
              <>
                Read{" "}
                <ArrowRight
                  size={14}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
