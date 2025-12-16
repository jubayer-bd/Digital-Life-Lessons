// components/LessonStats.jsx
const LessonStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {[
        { label: "Public Lessons", value: stats.public },
        { label: "Private Lessons", value: stats.private },
        { label: "Flagged", value: stats.flagged },
        { label: "Total Lessons", value: stats.total },
      ].map((item) => (
        <div key={item.label} className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">{item.label}</p>
          <h2 className="text-2xl font-bold">{item.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default LessonStats;
