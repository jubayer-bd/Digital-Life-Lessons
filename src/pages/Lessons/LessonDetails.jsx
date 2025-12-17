import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Share2,
  Heart,
  Star,
  StarOff,
  Flag,
  Eye,
  Clock,
  Calendar,
  ChevronRight,
  Lock,
  Copy,
  X,
  ArrowLeft,
} from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

// Components
import ReportModal from "./ReportModal";
import CommentSection from "./CommentSection";
import RelatedLessons from "./RelatedLessons";
import PageLoader from "../../components/PageLoader";
import useIsPremium from "../../hooks/useIsPremimum";

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();

  // Custom hook for premium status
  const { isPremium, isPending: isPremiumLoading } = useIsPremium();

  const shareUrl = window.location.href;

  // --- 1. Fetch Lesson Data ---
  const {
    data: lesson,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${id}`);
      return res.data;
    },
  });

  // --- 2. State Management ---
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [viewCount] = useState(Math.floor(Math.random() * 5000) + 500); // Static random

  // Sync state when data loads
  useEffect(() => {
    if (lesson) {
      setLikesCount(lesson.likesCount || 0);
      setFavoritesCount(lesson.favoritesCount || 0);
      if (user) {
        setIsLiked(lesson.likes?.includes(user.email) || false);
        setIsFavorited(lesson.favorites?.includes(user.email) || false);
      }
    }
  }, [lesson, user]);

  if (isLoading || isPremiumLoading)
    return <PageLoader text="Loading content..." />;

  if (isError || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800">Lesson not found</h2>
        <button
          onClick={() => navigate("/lessons")}
          className="mt-4 text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Library
        </button>
      </div>
    );
  }

  // --- 3. Access Logic ---
  const isAuthor = user?.email === lesson?.authorEmail;
  const isPremiumContent = lesson.accessLevel === "premium";
  const shouldBlockContent = isPremiumContent && !isPremium && !isAuthor;

  // --- 4. Handlers ---
  const handleLike = async () => {
    if (!user) return toast.error("Please login to like.");
    const prevState = isLiked;

    // Optimistic UI update
    setIsLiked(!prevState);
    setLikesCount((prev) => (!prevState ? prev + 1 : prev - 1));

    try {
      await axiosSecure.patch(`/lessons/${id}/like`);
      refetch();
    } catch {
      setIsLiked(prevState); // Rollback
      setLikesCount((prev) => (prevState ? prev + 1 : prev - 1));
      toast.error("Connection failed");
    }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error("Please login to save.");
    const prevState = isFavorited;

    // Optimistic UI
    setIsFavorited(!prevState);
    setFavoritesCount((prev) => (!prevState ? prev + 1 : prev - 1));

    try {
      const { data } = await axiosSecure.patch(`/lessons/${id}/favorite`);
      if (data.success) {
        toast.success(data.message);
        refetch();
      }
    } catch {
      setIsFavorited(prevState); // Rollback
      setFavoritesCount((prev) => (prevState ? prev + 1 : prev - 1));
      toast.error("Failed to save");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link Copied!");
    setShareModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* BREADCRUMBS */}
      <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
        <span
          className="hover:text-gray-900 cursor-pointer transition"
          onClick={() => navigate("/lessons")}
        >
          Lessons
        </span>
        <ChevronRight size={14} className="mx-2 flex-shrink-0" />
        <span className="text-gray-900 font-medium truncate">
          {lesson.title}
        </span>
      </nav>

      {/* HERO SECTION */}
      <header className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
            {lesson.category}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider border border-purple-100">
            {lesson.emotionalTone}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            {new Date(lesson.createdAt).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-400" /> 5 min read
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} className="text-gray-400" />{" "}
            {viewCount.toLocaleString()}
          </div>
        </div>

        {lesson.image && (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-10 border border-gray-100">
            <img
              src={lesson.image}
              alt={lesson.title}
              className="w-full h-64 md:h-[450px] object-cover hover:scale-105 transition duration-700 ease-in-out"
            />
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <div className="relative mb-16">
        {shouldBlockContent ? (
          <div className="relative rounded-xl overflow-hidden">
            {/* Blurred Background Text */}
            <div className="prose prose-lg max-w-none text-gray-800 blur-[8px] select-none opacity-40 pointer-events-none h-80 overflow-hidden">
              <p>{lesson.description.substring(0, 500)}...</p>
              <p>{lesson.description.substring(0, 500)}...</p>
              <p>{lesson.description.substring(0, 500)}...</p>
            </div>

            {/* Premium Lock Card */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white max-w-md mx-4 text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Content
                </h3>
                <p className="text-gray-600 mb-6">
                  This lesson is part of our premium collection. Upgrade your
                  plan to unlock full access.
                </p>
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition transform"
                  onClick={() => navigate("/pricing")}
                >
                  Unlock Access
                </button>
              </div>
            </div>
          </div>
        ) : (
          <article className="prose prose-lg prose-slate max-w-none text-gray-800 leading-relaxed">
            <p className="whitespace-pre-line">{lesson.description}</p>
          </article>
        )}
      </div>

      {/* AUTHOR & ACTIONS BAR */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(`/profile/${lesson.authorEmail}`)}
            className="cursor-pointer relative group"
          >
            <img
              src={lesson?.authorImage || "https://i.ibb.co/t2Wz12d/user1.jpg"}
              alt={lesson.authorName}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md group-hover:ring-blue-400 transition"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">
              Written by
            </p>
            <h4
              onClick={() => navigate(`/profile/${lesson.authorEmail}`)}
              className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition"
            >
              {lesson?.authorName}
            </h4>
            <button
              onClick={() => navigate(`/profile/${lesson.authorEmail}`)}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              View all lessons →
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Heart size={20} className={isLiked ? "fill-current" : ""} />
              <span className="font-semibold">{likesCount}</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
                isFavorited
                  ? "bg-amber-50 border-amber-200 text-amber-500"
                  : "bg-white border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isFavorited ? (
                <Star size={20} className="fill-current" />
              ) : (
                <StarOff size={20} />
              )}
              <span className="font-semibold">{favoritesCount}</span>
            </button>
          </div>

          <div className="w-px h-8 bg-gray-300 hidden md:block mx-1"></div>

          <div className="flex gap-2">
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2.5 bg-white border border-gray-200 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition"
            >
              <Flag size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div className="border-t pt-12 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Discussion</h3>
        <CommentSection lessonId={lesson._id} user={user} />
      </div>

      {/* RELATED LESSONS */}
      <div className="border-t pt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">
          You might also like
        </h3>
        <RelatedLessons
          currentCategory={lesson?.category}
          currentTone={lesson?.emotionalTone}
          currentId={lesson?._id}
        />
      </div>

      {/* --- MODALS --- */}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
              Share this lesson
            </h3>
            <div className="flex justify-center gap-6 mb-8">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={50} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon size={50} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={50} round />
              </WhatsappShareButton>
            </div>
            <div className="flex items-center gap-2 border p-2 rounded-xl bg-gray-50">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm outline-none text-gray-600 px-2"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 bg-white shadow-sm rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lessonId={lesson._id}
        user={user}
      />
    </div>
  );
};

export default LessonDetails;
