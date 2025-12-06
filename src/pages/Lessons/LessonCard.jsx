import { Link } from "react-router-dom";

const LessonCard = ({ lesson }) => {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition">
      <figure>
        <img src={lesson.thumbnail} alt={lesson.title} />
      </figure>

      <div className="card-body">
        <h2 className="card-title">{lesson.title}</h2>
        <p className="text-sm text-gray-500">{lesson.category}</p>
        <p className="text-gray-700 text-sm mt-2">{lesson.shortDescription}</p>

        <div className="card-actions justify-between items-center mt-4">
          <span className="text-xs text-gray-400">By {lesson.author}</span>
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
