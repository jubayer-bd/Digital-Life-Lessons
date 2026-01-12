import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, Star, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Quality Life Lessons",
    desc: "Expert-created lessons focused on personal and professional growth.",
  },
  {
    icon: Star,
    title: "Save Favorites",
    desc: "Bookmark lessons and access them anytime from your profile.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    desc: "Learn from verified instructors with real-world experience.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Role-Based",
    desc: "Admins, instructors, and learners have dedicated permissions.",
  },
];

const PlatformFeatures = () => {
  return (
    <section className="py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-12"
      >
        Platform <span className="text-blue-600">Features</span>
      </motion.h2>

      <div className="grid md:grid-cols-4 gap-6 ">
        {features.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6  rounded-2xl text-center bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <item.icon className="mx-auto text-blue-600 mb-4" size={36} />
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PlatformFeatures;
