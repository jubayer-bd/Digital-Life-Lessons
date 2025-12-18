import { motion } from "framer-motion";
import { BookOpen, HeartPulse, Target, TrendingUp } from "lucide-react";

const benefits = [
  {
    title: "Builds Real-World Wisdom",
    description:
      "Life lessons come from real experiences, helping us understand people, challenges, and situations beyond theory.",
    icon: BookOpen,
  },
  {
    title: "Strengthens Emotional Resilience",
    description:
      "Real struggles teach patience, adaptability, and inner strength to overcome setbacks with confidence.",
    icon: HeartPulse,
  },
  {
    title: "Improves Decision-Making",
    description:
      "Learning from past experiences helps us make smarter choices and avoid repeating mistakes.",
    icon: Target,
  },
  {
    title: "Encourages Personal Growth",
    description:
      "Every life lesson pushes us toward self-awareness, maturity, and continuous self-improvement.",
    icon: TrendingUp,
  },
];

export default function WhyLearningMatters() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Learning From Life Matters
          </h2>
          <p className="mt-4 text-gray-600">
            Life is the greatest teacher. Every experience—good or bad—offers
            lessons that shape our mindset, decisions, and future.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{
                  y: -8,
                  boxShadow: "0px 20px 30px -10px rgba(37, 99, 235, 0.25)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-600 text-white mb-4">
                  <Icon size={22} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
