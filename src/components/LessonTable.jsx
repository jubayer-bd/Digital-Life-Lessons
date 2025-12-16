// components/LessonTable.jsx
import { Trash2, Star, CheckCircle } from "lucide-react";

const LessonTable = ({ lessons, onDelete, onFeature, onReview }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="table w-full">
        <thead className="bg-gray-100">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Visibility</th>
            <th>Flags</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson._id}>
              <td>{lesson.title}</td>
              <td>{lesson.authorName}</td>
              <td>{lesson.category}</td>
              <td>{lesson.visibility}</td>
              <td>{lesson.flags?.length || 0}</td>
              <td className="flex gap-2">
                <button onClick={() => onFeature(lesson._id)}>
                  <Star className="w-5 text-yellow-500" />
                </button>
                <button onClick={() => onReview(lesson._id)}>
                  <CheckCircle className="w-5 text-green-500" />
                </button>
                <button onClick={() => onDelete(lesson._id)}>
                  <Trash2 className="w-5 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LessonTable;
