import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

const InstructorCTA = () => {
  return (
    <section className="py-16 text-center bg-muted/40 rounded-2xl">
      <motion.h2 className="text-3xl font-bold mb-4">
        Become an Instructor
      </motion.h2>
      <p className="mb-6 text-muted-foreground">
        Share your knowledge and inspire thousands of learners.
      </p>

      <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg">
        <PlusCircle size={18} />
        Start Teaching
      </button>
    </section>
  );
};

export default InstructorCTA;
