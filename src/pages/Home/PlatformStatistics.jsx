import { motion } from "framer-motion";

const stats = [
  { value: "5K+", label: "Active Learners" },
  { value: "800+", label: "Life Lessons" },
  { value: "120+", label: "Expert Instructors" },
  { value: "95%", label: "Positive Feedback" },
];

const PlatformStatistics = () => {
  return (
    <section className="my-12 mx-4">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] py-16 px-8 shadow-xl shadow-blue-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-center">
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{s.value}</h3>
              <p className="text-blue-100 font-medium uppercase tracking-wider text-xs md:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformStatistics;