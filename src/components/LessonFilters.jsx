// components/LessonFilters.jsx
const LessonFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        className="border p-2 rounded"
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All Categories</option>
        <option value="career">Career</option>
        <option value="mindset">Mindset</option>
        <option value="relationships">Relationships</option>
      </select>

      <select
        className="border p-2 rounded"
        onChange={(e) => setFilters({ ...filters, visibility: e.target.value })}
      >
        <option value="">All Visibility</option>
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      <select
        className="border p-2 rounded"
        onChange={(e) => setFilters({ ...filters, flagged: e.target.value })}
      >
        <option value="">All</option>
        <option value="true">Flagged</option>
      </select>
    </div>
  );
};

export default LessonFilters;
