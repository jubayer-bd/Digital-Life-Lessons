const categories = [
  { name: "Productivity", icon: "💼" },
  { name: "Mindset", icon: "💡" },
  { name: "Digital Life", icon: "📱" },
  { name: "Money & Finance", icon: "💰" },
  { name: "Habits", icon: "📘" },
  { name: "Relationships", icon: "🤝" },
];

const Categories = () => {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-semibold mb-6">Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-base-200 text-center shadow hover:shadow-lg transition"
          >
            <div className="text-3xl">{cat.icon}</div>
            <h3 className="font-medium mt-2">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
