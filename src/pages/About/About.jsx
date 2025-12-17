import { BookOpen, ShieldCheck, Users, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900">
          About Digital Life Lessons
        </h1>
        <p className="mt-4 text-gray-600">
          Digital Life Lessons is a community-driven learning platform where
          people share real-life skills, digital knowledge, and personal growth
          lessons for a better future.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          {
            icon: <BookOpen size={28} />,
            title: "Practical Learning",
            desc: "Short, focused lessons based on real-life experiences.",
          },
          {
            icon: <Users size={28} />,
            title: "Community Driven",
            desc: "Learn from people who practice what they teach.",
          },
          {
            icon: <ShieldCheck size={28} />,
            title: "Safe & Moderated",
            desc: "Admin-reviewed content ensures quality and safety.",
          },
          {
            icon: <Globe size={28} />,
            title: "Accessible Anywhere",
            desc: "Learn anytime, from any device.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow border text-center"
          >
            <div className="mx-auto mb-3 text-blue-600">{item.icon}</div>
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Vision */}
      <div className="bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          To create a trusted digital space where people learn life skills,
          personal development, and technology lessons that truly matter.
        </p>
      </div>
    </div>
  );
};

export default About;
