import React from "react";

const CallToAction = () => {
  return (
    <section className="py-20 text-center bg-blue-600 text-white">
      <h2 className="text-3xl font-bold">Start Sharing & Learning Today</h2>
      <p className="mt-3">Create lessons, explore ideas, and grow together.</p>

      <div className="mt-6 flex justify-center gap-4">
        <a
          href="/lessons"
          className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold"
        >
          Browse Lessons
        </a>
        <a
          href="/register"
          className="px-6 py-2 border border-white rounded-lg"
        >
          Join Now
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
