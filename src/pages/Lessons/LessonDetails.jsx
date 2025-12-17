import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Share2,
  Heart,
  StarOff,
  Star,
  Flag,
  Eye,
  Clock,
  Calendar,
  X,
  Copy,
  ChevronRight,
  Lock,
} from "lucide-react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import ReportModal from "./ReportModal";
import CommentSection from "./CommentSection";
import RelatedLessons from "./RelatedLessons"; // Make sure this is imported
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import PageLoader from "../../components/PageLoader";
import useIsPremium from "../../hooks/useIsPremimum";

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();

  // Assuming useIsPremium returns { isPremium, isPending/isLoading }
  const { isPremium, isPending: isPremiumLoading } = useIsPremium();

  const shareUrl = window.location.href;

  // Fetch lesson data
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

  // UI state
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Static random view count (persists for the session)
  const [viewCount] = useState(Math.floor(Math.random() * 5000) + 500);

  // Sync state when lesson loads
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-gray-800">Lesson not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Content Blocking Logic
  const isPremiumContent = lesson.accessLevel === "premium";
  const hasAccess = isPremium || user?.email === lesson?.authorEmail; // Author can always see
  const shouldBlockContent = isPremiumContent && !hasAccess;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link Copied!");
    setShareModalOpen(false);
  };

  const handleLike = async () => {
    if (!user) return toast.error("Please login to like.");
    const prevState = isLiked;
    setIsLiked(!prevState);
    setLikesCount((prev) => (!prevState ? prev + 1 : prev - 1));

    try {
      await axiosSecure.patch(`/lessons/${id}/like`);
      refetch(); // Background sync
    } catch {
      setIsLiked(prevState);
      setLikesCount((prev) => (prevState ? prev + 1 : prev - 1));
      toast.error("Failed to update like");
    }
  };

  const handleFavorite = async () => {
    if (!user) return toast.error("Please login to save.");
    const prevIsFavorited = isFavorited;
    setIsFavorited(!prevIsFavorited);
    setFavoritesCount((prev) => (!prevIsFavorited ? prev + 1 : prev - 1));

    try {
      const { data } = await axiosSecure.patch(`/lessons/${id}/favorite`);
      if (!data.success) throw new Error("Server failed");
      toast.success(data.message);
      refetch();
    } catch (error) {
      setIsFavorited(prevIsFavorited);
      setFavoritesCount((prev) => (prevIsFavorited ? prev + 1 : prev - 1));
      toast.error("Failed to save favorite");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* Breadcrumb / Navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <span
          className="hover:text-gray-900 cursor-pointer"
          onClick={() => navigate("/lessons")}
        >
          Lessons
        </span>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-900 font-medium truncate">
          {lesson.title}
        </span>
      </nav>

      {/* HEADER */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-blue-100">
            {lesson.category}
          </span>
          <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-purple-100">
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
            {viewCount.toLocaleString()} Views
          </div>
        </div>

        {lesson.image && (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-10">
            <img
              src={lesson.image}
              alt={lesson.title}
              className="w-full h-64 md:h-[450px] object-cover hover:scale-105 transition duration-700"
            />
          </div>
        )}
      </header>

      {/* CONTENT & PREMIUM LOCK */}
      <div className="relative mb-16">
        {shouldBlockContent ? (
          <div className="relative">
            {/* Blurred Preview */}
            <div className="prose prose-lg max-w-none text-gray-400 blur-[6px] select-none h-64 overflow-hidden opacity-50">
              {/* Show a chunk of real text to make the blur look authentic */}
              <p>{lesson.description.substring(0, 500)}...</p>
              <p>{lesson.description.substring(0, 500)}...</p>
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50 text-center max-w-md mx-auto">
                <div className="bg-amber-100 p-4 rounded-full inline-flex mb-4">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Content
                </h3>
                <p className="text-gray-600 mb-6">
                  Unlock this lesson and get full access to all our exclusive
                  content.
                </p>
                <button
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition transform"
                  onClick={() => navigate("/pricing")}
                >
                  Upgrade to Premium
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

      {/* AUTHOR & INTERACTIONS BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white border border-gray-100 shadow-sm rounded-2xl mb-16">
        {/* Author */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <img
            src={lesson.authorImage || "https://i.ibb.co/t2Wz12d/user1.jpg"}
            alt={lesson.authorName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
              Written by
            </span>
            <span className="font-bold text-gray-900 text-lg leading-none">
              {lesson.authorName}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition border ${
                isLiked
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              <Heart size={20} className={isLiked ? "fill-current" : ""} />
              <span className="font-medium">{likesCount}</span>
            </button>

            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition border ${
                isFavorited
                  ? "bg-amber-50 border-amber-200 text-amber-600"
                  : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {isFavorited ? (
                <Star size={20} className="fill-current" />
              ) : (
                <StarOff size={20} />
              )}
              <span className="font-medium">{favoritesCount}</span>
            </button>
          </div>

          <div className="w-px h-8 bg-gray-200 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
              title="Share"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-red-50 hover:text-red-500 text-gray-400 transition"
              title="Report"
            >
              <Flag size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="mb-16 border-t pt-10">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Discussion</h3>
        <CommentSection lessonId={lesson._id} user={user} />
      </div>

      {/* RELATED LESSONS */}
      <div className="mb-10 border-t pt-10">
        <h3 className="text-2xl font-bold mb-8 text-gray-900">
          You might also like
        </h3>
        <RelatedLessons
          currentCategory={lesson?.category}
          currentTone={lesson?.emotionalTone}
          currentId={lesson?._id}
        />
      </div>

      {/* SHARE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl scale-100">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-center">
              Share this lesson
            </h3>
            <div className="flex justify-center gap-6 mb-8">
              <FacebookShareButton
                url={shareUrl}
                className="hover:scale-110 transition"
              >
                <FacebookIcon size={50} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareUrl}
                className="hover:scale-110 transition"
              >
                <TwitterIcon size={50} round />
              </TwitterShareButton>
              <WhatsappShareButton
                url={shareUrl}
                className="hover:scale-110 transition"
              >
                <WhatsappIcon size={50} round />
              </WhatsappShareButton>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 p-2 rounded-xl bg-gray-50">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm outline-none text-gray-600 px-2"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 bg-white border shadow-sm rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

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
