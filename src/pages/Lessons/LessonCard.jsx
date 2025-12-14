import { Link } from "react-router-dom";
import { format } from "date-fns";
import useIsPremium from "../../hooks/useIsPremimum";

const LessonCard = ({ lesson }) => {
  const { isPremium: isUserPremium } = useIsPremium();
  const isLocked = lesson.accessLevel === "premium" && !isUserPremium;

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition rounded-xl overflow-hidden relative border border-gray-100 h-full flex flex-col">
      {/* Image Wrapper */}
      <figure className="h-48 overflow-hidden relative shrink-0">
        <img
          src={lesson.image}
          alt={lesson.title}
          className={`w-full h-full object-cover transition duration-300 ${
            isLocked ? "blur-sm brightness-75" : ""
          }`}
        />

        {/* Premium Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
            <span className="text-3xl mb-2">🔒</span>
            <span className="text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded">
              Premium Lesson <br /> Upgrade to view
            </span>
          </div>
        )}
      </figure>

      <div className="card-body p-4 flex flex-col flex-grow">
        {/* Header: Title & Date */}
        <div className="mb-2">
          <h2 className="card-title text-lg font-bold leading-tight mb-1">
            {lesson.title}
          </h2>
          <span className="text-xs text-gray-400">
            {/* Fallback if you don't use date-fns: new Date(lesson.createdAt).toLocaleDateString() */}
            {lesson.createdAt
              ? format(new Date(lesson.createdAt), "MMM d, yyyy")
              : "Date N/A"}
          </span>
        </div>

        {/* Tags Row: Category, Access, Tone */}
        <div className="flex flex-wrap gap-2 text-xs mb-3">
          {/* Access Badge */}
          <span
            className={`px-2 py-1 rounded font-medium ${
              lesson.accessLevel === "free"
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {lesson.accessLevel === "free" ? "Free" : "Premium"}
          </span>

          {/* Category */}
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {lesson.category}
          </span>

          {/* REQUIRED: Emotional Tone */}
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
            {lesson.emotionalTone || "Neutral"}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-gray-600 text-sm line-clamp-2 flex-grow">
          {lesson.description}
        </p>

        {/* Divider */}
        <div className="divider my-2"></div>

        {/* Footer: Author & Action */}
        <div className="flex justify-between items-center mt-auto">
          {/* Author */}
          <div className="flex items-center gap-2">
            <img
              src={lesson.authorImage || "https://via.placeholder.com/30"}
              alt={lesson.authorName}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-700">
                {lesson.authorName}
              </span>
              <span className="text-[10px] text-gray-400">
                {lesson.likesCount} Likes
              </span>
            </div>
          </div>

          <Link
            to={isLocked ? "/subscription" : `/lessons/${lesson._id}`}
            className={`btn btn-sm ${isLocked ? "btn-outline" : "btn-primary"}`}
          >
            {isLocked ? "Unlock" : "View Details"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
