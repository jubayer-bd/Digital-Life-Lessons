import { Brain, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const PillarsSection = () => {
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white">The Framework</h2>
          <p className="text-gray-500 mt-2">The three areas we focus on.</p>
        </div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Pillar 1 */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500 transition-colors group"
          >
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Digital Mindset
            </h3>
            <p className="text-gray-400">
              Understanding how the internet affects your psychology, dopamine,
              and decision making.
            </p>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-blue-500 transition-colors group"
          >
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Cyber Hygiene</h3>
            <p className="text-gray-400">
              Practical tools to protect your data, your privacy, and your
              digital identity.
            </p>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            variants={cardVariants}
            className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Productivity</h3>
            <p className="text-gray-400">
              Leveraging tools to do more in less time, without burning out.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
