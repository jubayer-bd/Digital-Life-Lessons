import { motion, AnimatePresence } from "framer-motion";
export const NewsletterCTA = () => {
  return (
    <div className="bg-black py-24 px-4 border-t border-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Upgrade Your Digital Life.
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Join 5,000+ students receiving one practical digital life lesson every
          Sunday morning. No spam, just signal.
        </p>

        <form
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-6 py-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 w-full"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors whitespace-nowrap"
          >
            Subscribe Free
          </motion.button>
        </form>

        <p className="mt-6 text-gray-600 text-sm">Unsubscribe at any time.</p>
      </motion.div>
    </div>
  );
};
