import { BookOpen,  } from "lucide-react";

const PageLoader = ({ text = "Loading lessons..." }) => {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <BookOpen size={18} className="absolute inset-0 m-auto text-primary" />
      </div>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
};

export default PageLoader;
