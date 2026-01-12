import React from "react";
import { motion } from "framer-motion";
import { Search, Bookmark, PlayCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const steps = [
  {
    icon: Search,
    title: "Explore Lessons",
    description:
      "Browse our extensive library of expert-led courses across multiple disciplines and skill levels.",
    color: "bg-blue-50",
    link: "/lessons",
  },
  {
    icon: PlayCircle,
    title: "Learn at Your Pace",
    description:
      "Access high-quality  content and interactive exercises anytime, anywhere on any device.",
    color: "bg-blue-100",
    link: "/dashboard",
  },
  {
    icon: Bookmark,
    title: "Save & Revisit",
    description:
      "Build your personal library by bookmarking key lessons and tracking your progress effortlessly.",
    color: "bg-blue-50",
    link: "/dashboard/saved-lessons",
  },
];

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
            Simple Process
          </h2>
          <h3 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Your Journey to <span className="text-blue-600">Mastery</span>
          </h3>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-lg">
            Three simple steps to unlock your full potential and start building
            the career you've always wanted.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-12 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative group"
            >
              {/* Step Number behind the icon */}
              <div className="absolute -top-6 left-20 text-8xl font-black text-gray-400 select-none group-hover:text-blue-600 transition-colors duration-300">
                {i + 1}
              </div>

              <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                {/* Icon Container */}
                <div
                  className={`mb-6 p-4 rounded-2xl ${step.color} text-blue-600 group-hover:scale-110 transition-transform duration-300 shadow-sm`}
                >
                  <step.icon size={32} strokeWidth={2.5} />
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Decorative Link (Optional) */}
                <div className="flex items-center text-blue-600 font-semibold text-sm cursor-pointer group/link">
                  <Link to={step.link}  className="mr-1">
                    Get Started{" "}
                  </Link>
                  <ArrowRight
                    size={16}
                    className="ml-1 group-hover/link:translate-x-1 transition-transform"
                  />
                </div>
              </div>

              {/* Connecting Line (Desktop Only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-blue-200 to-transparent -translate-x-8 z-0" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
