import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AboutSection = () => {
  return (
    <div className="bg-gray-950 py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <div className="flex items-center gap-2 mb-4 text-purple-400 font-bold uppercase tracking-widest">
            <Zap size={20} />
            <span>Our Mission</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Decoding Life in the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Digital Age
            </span>
            .
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-6">
            Technology moves fast. Wisdom moves slow. We bridge the gap by
            applying timeless principles to modern problems. From managing
            screen time to understanding algorithms, we teach you how to remain
            human in a machine world.
          </p>
          <button className="px-6 py-3 border border-gray-600 text-white rounded hover:bg-white hover:text-black transition-colors duration-300">
            Read Our Manifesto
          </button>
        </motion.div>

        {/* Visual Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-3xl opacity-20" />
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070"
            alt="Digital Philosophy"
            className="relative rounded-2xl border border-gray-800 shadow-2xl z-10"
          />
        </motion.div>
      </div>
    </div>
  );
};
