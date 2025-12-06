import { useParams } from "react-router-dom";
import getLessonById from "./getLessonById";

const LessonDetails = () => {
  const { id } = useParams();
  const lesson = getLessonById(id);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <h2 className="text-2xl font-semibold text-center text-red-500">
          Lesson not found.
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* Thumbnail */}
      <div className="w-full mb-8">
        <img
          src={lesson.thumbnail}
          alt={lesson.title}
          className="rounded-xl shadow-lg w-full"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">
        {lesson.title}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center text-gray-500 mb-6 gap-4">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
          {lesson.category}
        </span>
        <span className="text-sm">By {lesson.author}</span>
      </div>

      {/* Description */}
      <div className="prose max-w-none mb-10">
        <p className="text-lg text-gray-700">
          {lesson.shortDescription}
        </p>
        <p className="mt-4">
          This is where the full lesson content will appear later when we
          integrate the backend editor and Markdown support.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="btn btn-primary">Add to Favorites</button>
        <button className="btn btn-outline">Share</button>
      </div>

    </div>
  );
};

export default LessonDetails;
