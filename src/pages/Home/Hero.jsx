import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// --- Custom SVG Illustrations ---

const WisdomIllustration = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full drop-shadow-xl"
    fill="none"
  >
    <circle
      cx="200"
      cy="200"
      r="150"
      className="fill-blue-50 dark:fill-blue-900/20"
    />
    <circle
      cx="200"
      cy="200"
      r="100"
      className="stroke-blue-200 dark:stroke-blue-700"
      strokeWidth="2"
      strokeDasharray="8 8"
    />
    <motion.g
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="200"
        cy="200"
        r="130"
        className="stroke-blue-100 dark:stroke-blue-800"
        strokeWidth="1"
      />
      <circle cx="330" cy="200" r="8" className="fill-blue-500" />
      <circle cx="70" cy="200" r="6" className="fill-blue-300" />
      <circle cx="200" cy="70" r="6" className="fill-blue-300" />
    </motion.g>
    <path
      d="M160 200 L240 200 M200 160 L200 240"
      className="stroke-blue-500 dark:stroke-blue-400"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="150"
      y="150"
      width="100"
      height="100"
      rx="20"
      className="fill-white dark:fill-slate-800 shadow-sm"
    />
    <path
      d="M185 215 L200 230 L230 180"
      className="stroke-[#0f5af2]"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonaIllustration = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full drop-shadow-xl"
    fill="none"
  >
    <rect
      x="80"
      y="60"
      width="240"
      height="280"
      rx="20"
      className="fill-white dark:fill-slate-800"
    />
    <rect
      x="80"
      y="60"
      width="240"
      height="80"
      rx="20"
      className="fill-blue-500/10 dark:fill-blue-500/20"
    />
    <circle
      cx="200"
      cy="140"
      r="40"
      className="fill-white dark:fill-slate-700 stroke-4 stroke-blue-500"
    />
    <rect
      x="130"
      y="200"
      width="140"
      height="16"
      rx="8"
      className="fill-slate-200 dark:fill-slate-600"
    />
    <rect
      x="150"
      y="230"
      width="100"
      height="12"
      rx="6"
      className="fill-slate-100 dark:fill-slate-700"
    />
    <g transform="translate(0, 20)">
      <circle cx="260" cy="100" r="15" className="fill-[#0f5af2]" />
      <path
        d="M255 100 L258 103 L265 96"
        className="stroke-white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <motion.rect
      initial={{ y: 0 }}
      animate={{ y: -10 }}
      transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
      x="40"
      y="180"
      width="60"
      height="60"
      rx="12"
      className="fill-blue-500 shadow-lg"
    />
    <motion.rect
      initial={{ y: 0 }}
      animate={{ y: 10 }}
      transition={{
        repeat: Infinity,
        duration: 2.5,
        repeatType: "reverse",
        delay: 0.5,
      }}
      x="310"
      y="250"
      width="50"
      height="50"
      rx="12"
      className="fill-indigo-400 shadow-lg"
    />
  </svg>
);

const PotentialIllustration = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full drop-shadow-xl"
    fill="none"
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
      </linearGradient>
    </defs>

    <rect
      x="60"
      y="320"
      width="40"
      height="0"
      rx="4"
      className="fill-blue-200 dark:fill-blue-900"
    >
      <animate attributeName="height" from="0" to="60" dur="1s" fill="freeze" />
      <animate attributeName="y" from="320" to="260" dur="1s" fill="freeze" />
    </rect>

    <rect
      x="120"
      y="320"
      width="40"
      height="0"
      rx="4"
      className="fill-blue-300 dark:fill-blue-800"
    >
      <animate
        attributeName="height"
        from="0"
        to="100"
        dur="1.2s"
        fill="freeze"
      />
      <animate attributeName="y" from="320" to="220" dur="1.2s" fill="freeze" />
    </rect>

    <rect
      x="180"
      y="320"
      width="40"
      height="0"
      rx="4"
      className="fill-blue-400 dark:fill-blue-700"
    >
      <animate
        attributeName="height"
        from="0"
        to="160"
        dur="1.4s"
        fill="freeze"
      />
      <animate attributeName="y" from="320" to="160" dur="1.4s" fill="freeze" />
    </rect>

    <rect
      x="240"
      y="320"
      width="40"
      height="0"
      rx="4"
      className="fill-blue-500 dark:fill-blue-600"
    >
      <animate
        attributeName="height"
        from="0"
        to="200"
        dur="1.6s"
        fill="freeze"
      />
      <animate attributeName="y" from="320" to="120" dur="1.6s" fill="freeze" />
    </rect>

    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.5, type: "spring" }}
      className="origin-center"
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <path
        d="M260 80 L280 110 L240 110 Z"
        className="fill-yellow-400"
        transform="translate(0, -20)"
      />
      <circle cx="260" cy="70" r="30" className="fill-yellow-400/30" />
    </motion.g>
  </svg>
);

// SLIDE DATA
const SLIDE_DATA = [
  {
    id: 1,
    title: "Embrace Digital Wisdom",
    subtitle:
      "Navigate the online world with confidence and insight. Learn from the shared experiences of a global community.",
    Illustration: WisdomIllustration,
    primaryBtn: "Explore Lessons",
    secondaryBtn: "Share Your Story",
  },
  {
    id: 2,
    title: "Master Your Online Persona",
    subtitle:
      "Cultivate a positive and authentic presence in the digital realm. Your digital footprint matters more than ever.",
    Illustration: PersonaIllustration,
    primaryBtn: "Read More",
    secondaryBtn: "Join Community",
  },
  {
    id: 3,
    title: "Unlock Your Digital Potential",
    subtitle:
      "Discover tools and strategies to thrive in today's digital landscape. Growth happens when we connect.",
    Illustration: PotentialIllustration,
    primaryBtn: "Start Learning",
    secondaryBtn: "Get Pro Tips",
  },
];

const Hero = () => {
  return (
    <section
      className="relative w-full rounded-3xl bg-[#f5f7fb] dark:bg-[#0e1421] 
      flex items-center justify-center py-14 overflow-hidden font-display 
      max-h-[65vh]"
    >
      <div className="w-full max-h-[65vh]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={900}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          spaceBetween={40}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
            bulletClass:
              "w-2.5 h-2.5 mx-1.5 rounded-full bg-slate-300 dark:bg-slate-700 transition-all duration-300 cursor-pointer inline-block hover:scale-125",
            bulletActiveClass: "!bg-[#0f5af2] !w-8",
          }}
          className="relative w-full rounded-3xl bg-white/60 dark:bg-[#0e1421]/40 
            shadow-2xl shadow-blue-900/5 backdrop-blur-md overflow-hidden 
            border border-white/50 dark:border-white/5 
            max-h-[65vh]"
        >
          {SLIDE_DATA.map((slide) => (
            <SwiperSlide key={slide.id} className="bg-transparent max-h-[65vh]">
              {({ isActive }) => (
                <div
                  className="flex flex-col-reverse lg:flex-row items-center 
                  gap-10 lg:gap-20 p-8 md:p-14 lg:p-24 
                  max-h-[65vh] overflow-hidden"
                >
                  {/* TEXT */}
                  <div className="flex-1 flex flex-col gap-8 text-center lg:text-left z-10">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={
                        isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                      }
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                        {slide.title}
                      </h1>

                      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mx-auto lg:mx-0 font-medium">
                        {slide.subtitle}
                      </p>
                    </motion.div>

                    {/* BUTTONS */}
                    <motion.div
                      className="flex flex-wrap gap-4 justify-center lg:justify-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <button className="group flex items-center gap-3 h-14 px-8 rounded-full bg-[#0f5af2] text-white text-lg font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-600 hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-300">
                        {slide.primaryBtn}
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>

                      <button className="h-14 px-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all duration-300">
                        {slide.secondaryBtn}
                      </button>
                    </motion.div>
                  </div>

                  {/* SVG ILLUSTRATION */}
                  <div className="w-full lg:w-1/2 flex justify-center items-center relative max-h-[65vh]">
                    <motion.div
                      className="w-full aspect-square relative z-0"
                      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                      animate={
                        isActive
                          ? { opacity: 1, scale: 1, rotate: 0 }
                          : { opacity: 0, scale: 0.8, rotate: -5 }
                      }
                      transition={{ duration: 0.8, ease: "circOut" }}
                    >
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[120%] h-[120%] bg-blue-100/50 dark:bg-blue-900/20 
                        rounded-full blur-3xl -z-10"
                      />

                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <slide.Illustration />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}

          {/* NAV ARROWS */}
          <div className="hidden lg:flex absolute bottom-12 right-16 z-30 gap-4">
            <button className="custom-prev group w-14 h-14 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md hover:scale-105 hover:border-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
              <ChevronLeft size={28} />
            </button>
            <button className="custom-next group w-14 h-14 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md hover:scale-105 hover:border-blue-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
              <ChevronRight size={28} />
            </button>
          </div>

          {/* PAGINATION */}
          <div className="custom-pagination absolute bottom-12 left-0 w-full flex justify-center lg:justify-start lg:left-24 z-30"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default Hero;
