import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is this platform completely free to use?",
    a: "We offer a comprehensive 'Starter' tier that is free forever, giving you access to all foundational lessons. For advanced industry-specific tracks and 1-on-1 mentorship, we offer a Premium subscription with flexible monthly or annual billing.",
  },
  {
    q: "Can I save lessons for offline access?",
    a: "Absolutely! Our mobile and web applications allow you to bookmark lessons and download video content directly to your dashboard. This ensures you can continue your professional development even without an internet connection.",
  },
  {
    q: "Do I receive a certificate upon completion?",
    a: "Yes, every completed course track comes with a verified digital certificate. You can easily export these to your LinkedIn profile or download them as high-quality PDFs for your physical portfolio.",
  },
  {
    q: "How often is the curriculum updated?",
    a: "The tech landscape moves fast, and so do we. Our content team updates existing lessons every quarter and releases at least two new specialized modules every month to ensure you're learning the latest industry standards.",
  },
  {
    q: "Is there a community for networking?",
    a: "When you join, you get immediate access to our private Discord community. This is a space where you can collaborate on projects, participate in weekly hackathons, and network with over 10,000+ active professionals.",
  },
  {
    q: "Can I switch between plans at any time?",
    a: "Flexibility is key. You can upgrade, downgrade, or cancel your premium subscription at any time through your account settings. If you cancel, you'll retain access to premium features until the end of your current billing cycle.",
  },
];

const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(0); // Set first one open by default

  return (
    <section className="py-20 ">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-lg text-blue-600 mb-4">
            <HelpCircle size={24} />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Commonly Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-gray-600">
            Everything you need to know about the platform and how we help you grow.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              question={faq.q}
              answer={faq.a}
              isOpen={expandedIndex === i}
              onClick={() => setExpandedIndex(expandedIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className={`border rounded-2xl transition-all duration-300 ${
        isOpen ? "border-blue-600 shadow-md" : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <span className={`font-bold text-lg transition-colors ${isOpen ? "text-blue-600" : "text-gray-800"}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`${isOpen ? "text-blue-600" : "text-gray-400"}`}
        >
          <ChevronDown size={22} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQSection;