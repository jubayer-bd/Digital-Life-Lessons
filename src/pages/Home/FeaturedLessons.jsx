const lessons = [
  {
    id: 1,
    title: "How to Build Strong Habits",
    category: "Productivity",
    thumbnail: "https://i.ibb.co/rGTfT1Y/habits.png",
  },
  {
    id: 2,
    title: "Managing Time Like a Pro",
    category: "Time Management",
    thumbnail: "https://i.ibb.co/KF7L0fQ/time.png",
  },
  {
    id: 3,
    title: "Understanding Digital Well-being",
    category: "Digital Life",
    thumbnail: "https://i.ibb.co/0qGQw5p/digital.png",
  },
];

const FeaturedLessons = () => {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-semibold mb-6">Featured Lessons</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {lessons.map((lesson) => (
          <div key={lesson.id} className="card bg-base-100 shadow-lg">
            <figure>
              <img src={lesson.thumbnail} alt={lesson.title} />
            </figure>

            <div className="card-body">
              <h3 className="card-title">{lesson.title}</h3>
              <p className="text-sm text-gray-500">{lesson.category}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-sm btn-primary">View</button>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default FeaturedLessons;
