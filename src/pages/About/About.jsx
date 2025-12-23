import React from "react";
import {
  BookOpen,
  ShieldCheck,
  Users,
  Globe,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-100">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 sm:pt-20 pb-14 sm:pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white -z-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold mb-5 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            About Us
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Bridging the gap between <br className="hidden md:block" />
            <span className="text-blue-600">Life</span> and{" "}
            <span className="text-blue-600">Learning</span>.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Digital Life Lessons is more than an LMS. It is a community-driven
            ecosystem designed to help you master real-world skills, from
            digital literacy to personal well-being.
          </p>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { label: "Active Learners", value: "10k+" },
              { label: "Curated Lessons", value: "500+" },
              { label: "Expert Instructors", value: "50+" },
              { label: "Satisfaction Rate", value: "4.9/5" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="w-full md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Team collaboration"
                className="w-full h-[260px] sm:h-[320px] md:h-full object-cover transform hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-blue-900/10" />
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Why We Started
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              In a world overflowing with information, finding structured,
              high-quality knowledge is difficult. We noticed that while
              academic education is accessible,
              <strong> practical life skills</strong> were often ignored.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              We built{" "}
              <span className="text-blue-600 font-semibold">
                Digital Life Lessons
              </span>{" "}
              to fix this—where experts share wisdom that directly impacts your
              daily life.
            </p>

            <Link
              to="/lessons"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              Read our full manifesto
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Built on Core Values
            </h2>
            <p className="mt-4 text-gray-600 text-sm sm:text-base">
              These pillars guide every lesson, feature, and interaction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <BookOpen size={32} />,
                title: "Practical Learning",
                desc: "Actionable lessons you can apply immediately.",
              },
              {
                icon: <Users size={32} />,
                title: "Community First",
                desc: "Learn together with peers and mentors.",
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "Safe & Moderated",
                desc: "Admin-reviewed quality content.",
              },
              {
                icon: <Globe size={32} />,
                title: "Accessible Anywhere",
                desc: "Learn on phone, tablet, or desktop.",
              },
              {
                icon: <TrendingUp size={32} />,
                title: "Continuous Growth",
                desc: "Always updated content.",
              },
              {
                icon: <Target size={32} />,
                title: "Goal Oriented",
                desc: "Track progress and stay motivated.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <Award size={44} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Ready to upgrade your life?
          </h2>
          <p className="text-blue-100 text-sm sm:text-lg max-w-2xl mx-auto mb-8">
            Join thousands of learners shaping their future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing/upgrade"
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-gray-100 transition"
            >
              Explore Plan
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-700 border border-blue-500 text-white font-bold rounded-full hover:bg-blue-800 transition"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
