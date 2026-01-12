import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Full Stack Developer",
    quote: "These lessons completely changed my daily habits. The technical depth is unparalleled.",
    rating: 5,
  },
  {
    name: "Rahim Ahmed",
    role: "UI/UX Designer",
    quote: "Simple, practical, and powerful content. It helped me bridge the gap between design and code.",
    rating: 5,
  },
  {
    name: "Sarah Jenkins",
    role: "Product Manager",
    quote: "A game-changer for our team's workflow. The structured approach is exactly what we needed.",
    rating: 4,
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    quote: "The best investment I've made in my career this year. Highly recommended for professionals.",
    rating: 5,
  },
  {
    name: "Priya Das",
    role: "Data Scientist",
    quote: "I appreciated the clarity of the complex concepts. The community support is also fantastic.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Frontend Lead",
    quote: "The attention to detail in the components and lessons is world-class. 10/10 experience.",
    rating: 4,
  },
  {
    name: "Laila Hassan",
    role: "Mobile Developer",
    quote: "Finally a course that doesn't just scratch the surface. I feel much more confident now.",
    rating: 5,
  },
  {
    name: "David Smith",
    role: "Tech Entrepreneur",
    quote: "This platform is the gold standard for modern learning. My team has improved significantly.",
    rating: 5,
  },
];

const StudentTestimonials = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextStep = useCallback(() => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevStep = useCallback(() => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Automatic Slide Logic
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextStep, 5000);
    return () => clearInterval(timer);
  }, [nextStep, isPaused]);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Trusted by Thousands of <span className="text-blue-600">Learners</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover how our curriculum is helping professionals worldwide transform their careers and master new skills.
          </p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Buttons */}
          <div className="flex justify-end gap-2 mb-4">
            <button 
              onClick={prevStep}
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextStep}
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slider Container */}
          <div className="relative h-[350px] md:h-[300px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Logic: Show 3 items starting from current index. 
                  We use modulo to wrap around the array.
                */}
                {[0, 1, 2].map((offset) => {
                  const item = testimonials[(index + offset) % testimonials.length];
                  return (
                    <TestimonialCard key={`${index}-${offset}`} item={item} />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${index === i ? "w-8 bg-blue-600" : "w-2 bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between h-full"
  >
    <div>
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
      <Quote className="text-blue-600/20 mb-2" size={40} />
      <p className="text-gray-700 leading-relaxed italic mb-6">
        "{item.quote}"
      </p>
    </div>

    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        <User size={24} />
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{item.name}</h4>
        <p className="text-sm text-blue-600 font-medium">{item.role}</p>
      </div>
    </div>
  </motion.div>
);

export default StudentTestimonials;