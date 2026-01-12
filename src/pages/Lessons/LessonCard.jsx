import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  Lock, 
  ArrowRight, 
  Star, 
  Clock, 
  MapPin, 
  CircleDollarSign,
  Calendar
} from "lucide-react";
import useIsPremium from "../../hooks/useIsPremium";

const LessonCard = ({ lesson }) => {
  const { isPremium: isUserPremium } = useIsPremium();
  const isLocked = lesson.accessLevel === "premium" && !isUserPremium;

  return (
    <div className="group flex flex-col h-full bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      
      {/* --- Image Section (Fixed Aspect Ratio) --- */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={lesson.image}
          alt={lesson.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            isLocked ? "blur-[3px] grayscale-[40%]" : ""
          }`}
        />

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {lesson.accessLevel === "premium" ? (
            <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg shadow-lg">
              <Star size={10} fill="currentColor" /> Premium
            </span>
          ) : (
            <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg shadow-lg">
              Free
            </span>
          )}
        </div>

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
            <div className="bg-white/20 p-3 rounded-full mb-2 backdrop-blur-xl border border-white/30">
              <Lock className="text-white w-6 h-6" />
            </div>
            <p className="text-white font-bold text-sm tracking-wide">Premium Access</p>
          </div>
        )}
      </div>

      {/* --- Content Body --- */}
      <div className="flex flex-col flex-grow p-5">
        
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {lesson.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-slate-700">{lesson.rating || "4.8"}</span>
          </div>
        </div>

        {/* Title (Standardized Height) */}
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-12">
          {lesson.title}
        </h3>

        {/* Description (Standardized Height) */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 h-10">
          {lesson.description}
        </p>

        {/* Meta Grid (Price, Date, Location) */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-1 mb-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CircleDollarSign size={14} className="text-blue-500" />
            <span className="text-xs font-medium">{lesson.price || "Free"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar size={14} className="text-blue-500" />
            <span className="text-xs font-medium">
              {lesson.createdAt ? format(new Date(lesson.createdAt), "MMM dd") : "Jan 12"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-xs font-medium truncate">{lesson.location || "Online"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock size={14} className="text-blue-500" />
            <span className="text-xs font-medium">{lesson.duration || "15 min"}</span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-auto">
          <Link
            to={isLocked ? "/pricing/upgrade" : `/lessons/${lesson._id}`}
            className={`w-full group/btn inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              isLocked
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
            }`}
          >
            {isLocked ? "Unlock Access" : "View Details"}
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonCard;