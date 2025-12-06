import dummyLessons from "./dummyLessons";
import LessonCard from "./LessonCard";

const Lessons = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">All Lessons</h1>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {dummyLessons.map((lesson) => (
          <LessonCard key={lesson._id} lesson={lesson} />
        ))}

      </div>
    </div>
  );
};

export default Lessons;
