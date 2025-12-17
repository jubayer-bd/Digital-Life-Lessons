import React from "react";

const PopularCategories = () => {
  return (
    <div>
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Popular Lesson Categories</h2>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              "Digital Skills",
              "Career & Freelancing",
              "Personal Development",
              "Mental & Life Skills",
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl shadow text-center font-medium"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PopularCategories;
