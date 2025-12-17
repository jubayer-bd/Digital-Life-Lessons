import React from "react";

const WhyDigitalLifeLessons = () => {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          "Real-life experiences",
          "Short & practical lessons",
          "Community-reviewed content",
        ].map((text, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow border p-6 text-center"
          >
            <h3 className="font-semibold text-lg">{text}</h3>
            <p className="text-sm text-gray-600 mt-2">
              Learn knowledge you can actually apply in daily life.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default WhyDigitalLifeLessons;
