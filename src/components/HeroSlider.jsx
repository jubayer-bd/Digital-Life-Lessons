import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router";

const sliderData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
    title: "Preserve Your Wisdom",
    subtitle: "Document the life lessons that shaped who you are today.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
    title: "Personal Growth Insights",
    subtitle:
      "Organize your journey and track your mental and emotional progress.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop",
    title: "A Community of Knowledge",
    subtitle: "Share your insights and learn from the experiences of others.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop",
    title: "Master Your Progress",
    subtitle:
      "Categorize lessons, mark favorites, and build your digital legacy.",
  },
];

export const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextStep();
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const nextStep = () => {
    setDirection(1);
    setIndex((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  const variants = {
    initial: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 1.05,
    }),
    animate: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.6 },
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      scale: 1.05,
      transition: {
        x: { type: "spring", stiffness: 200, damping: 25 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <div className="relative w-full h-[60vh] rounded-[2.5rem] overflow-hidden bg-gray-900 text-white shadow-2xl">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image with optimized overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{ backgroundImage: `url(${sliderData[index].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 p-3 bg-blue-600/20 backdrop-blur-md rounded-2xl border border-blue-500/30"
            >
              <BookOpen className="text-blue-400" size={32} />
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight"
            >
              {sliderData[index].title}
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-2xl text-gray-200 max-w-3xl leading-relaxed font-light"
            >
              {sliderData[index].subtitle}
            </motion.p>

            <motion.button
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{
                scale: 1.0,
                boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.4 }}
              className="mt-8 px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
            >
              <Link to={'lessons'}>Start Your Journal</Link>
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
        <button
          onClick={prevStep}
          className="p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-blue-600 hover:border-blue-400 transition-all pointer-events-auto group"
        >
          <ChevronLeft
            size={28}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
        <button
          onClick={nextStep}
          className="p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-blue-600 hover:border-blue-400 transition-all pointer-events-auto group"
        >
          <ChevronRight
            size={28}
            className="group-hover:scale-110 transition-transform"
          />
        </button>
      </div>

      {/* Modern Dots Pagination */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4 z-20 bg-black/20 backdrop-blur-md px-5 py-3 rounded-full border border-white/5">
        {sliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`transition-all duration-500 rounded-full ${
              i === index
                ? "bg-blue-600 w-10 h-2.5"
                : "bg-gray-500/50 hover:bg-gray-400 w-2.5 h-2.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
