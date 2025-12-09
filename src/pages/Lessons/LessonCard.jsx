import { Link } from "react-router-dom";

const LessonCard = ({ lesson }) => {
  const isPremium = lesson.accessLevel === "premium";

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition rounded-xl overflow-hidden relative">
      {/* Image Wrapper */}
      <figure className="h-48 overflow-hidden relative">
        <img
          src={lesson.image}
          alt={lesson.title}
          className={`w-full h-full object-cover transition ${
            isPremium ? "blur-2xl brightness-75" : ""
          }`}
        />

        {/* Premium Lock Overlay */}
        {isPremium && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded">
              Premium Content 🔒
            </span>
          </div>
        )}
      </figure>

      <div className="card-body">
        {/* Title */}
        <h2 className="card-title text-lg font-semibold">{lesson.title}</h2>

        {/* Category + Access */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">{lesson.category}</p>

          <span
            className={`px-2 py-1 rounded text-xs ${
              lesson.accessLevel === "free"
                ? "bg-green-200 text-green-700"
                : "bg-yellow-200 text-yellow-700"
            }`}
          >
            {lesson.accessLevel}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-gray-700 text-sm mt-2 line-clamp-2">
          {lesson.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2 mt-4">
          <img
            src={lesson.authorImage}
            alt={lesson.authorName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-xs text-gray-600">By {lesson.authorName}</span>
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-xs text-gray-400">
            {lesson.likesCount} Likes
          </span>

          <Link
            to={`/lessons/${lesson._id}`}
            className="btn btn-primary btn-sm"
          >
            View Lesson
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
