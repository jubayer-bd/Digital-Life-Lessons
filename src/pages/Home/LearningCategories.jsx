import { motion } from "framer-motion";
import { Brain, Heart, Briefcase, Sparkles } from "lucide-react";

const categories = [
  { icon: Brain, name: "Personal Growth", desc: "Unlock your potential" },
  { icon: Briefcase, name: "Career Skills", desc: "Advance your path" },
  { icon: Heart, name: "Mental Wellness", desc: "Mindfulness & health" },
  { icon: Sparkles, name: "Productivity", desc: "Work smarter, not harder" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const LearningCategories = () => {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Learning <span className="text-blue-600">Categories</span>
        </h2>
        <p className="text-slate-500 mt-4 text-lg">Explore diverse fields curated for your growth.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
              <cat.icon className="text-blue-600 group-hover:text-white" size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-800">{cat.name}</h4>
            <p className="text-slate-500 mt-2 text-sm">{cat.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default LearningCategories;