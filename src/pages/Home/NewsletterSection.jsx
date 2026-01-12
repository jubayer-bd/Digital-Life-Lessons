import { motion } from "framer-motion";
import { Send } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Inspired Every Week
          </h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto">
            Join 5,000+ others receiving curated life lessons directly to their inbox.
          </p>

          <form 
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-80 px-6 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              Subscribe <Send size={18} />
            </button>
          </form>
          
          <p className="mt-4 text-xs text-slate-500">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;