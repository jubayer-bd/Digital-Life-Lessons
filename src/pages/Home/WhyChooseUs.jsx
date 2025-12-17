const WhyChooseUs = () => {
  return (
    <div className="py-16">
      <h2 className="text-2xl font-semibold mb-6">Why Choose Us</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-base-200 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Real-life Lessons</h3>
          <p className="mt-3 text-gray-600">
            Every lesson is practical, relatable, and based on real-world experience.
          </p>
        </div>

        <div className="p-6 bg-base-200 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Easy to Understand</h3>
          <p className="mt-3 text-gray-600">
            Content is simplified so that anyone can learn quickly and apply immediately.
          </p>
        </div>

        <div className="p-6 bg-base-200 rounded-lg shadow">
          <h3 className="text-xl font-semibold">Modern Learning Platform</h3>
          <p className="mt-3 text-gray-600">
            Clean UI, high-quality UX, and optimized performance for a smooth experience.
          </p>
        </div>
      </div>      
    </div>
  );
};

export default WhyChooseUs;
