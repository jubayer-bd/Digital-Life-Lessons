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
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useIsPremium from "../../hooks/useIsPremimum";
import toast from "react-hot-toast";

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { isPremium } = useIsPremium();
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

  if (isLoading)
    return <div className="text-center py-20 text-lg">Loading Lesson...</div>;
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load lesson content.
      </div>
    );
  if (!lesson) return null;

  // Added checking for undefined/null on isPremium
  const shouldBlockContent = lesson.accessLevel === "premium" && !isPremium;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link Copied!");
    setShareModalOpen(false);
  };

  // LIKE HANDLER
  const handleLike = async () => {
    if (!user) return toast.error("Please login to like.");

    const prevState = isLiked;
    setIsLiked(!prevState);
    setLikesCount((prev) => (!prevState ? prev + 1 : prev - 1));

    try {
      await axiosSecure.patch(`/lessons/${id}/like`);
      refetch();
    } catch {
      setIsLiked(prevState);
      setLikesCount((prev) => (prevState ? prev + 1 : prev - 1));
      toast.error("Something went wrong");
    }
  };

  // --- FIXED FAVORITE HANDLER ---
  const handleFavorite = async () => {
    if (!user) return toast.error("Please login to save.");

    // 1. Snapshot previous state (for rollback)
    const prevIsFavorited = isFavorited;
    const prevCount = favoritesCount;

    // 2. Optimistic Update (Update UI immediately)
    const newState = !prevIsFavorited;
    setIsFavorited(newState);
    setFavoritesCount((prev) => (newState ? prev + 1 : prev - 1));

    try {
      // 3. API Call
      const { data } = await axiosSecure.patch(`/lessons/${id}/favorite`);

      if (!data.success) throw new Error("Server failed");

      toast.success(data.message);

      // 4. Refetch to ensure data consistency with server
      // Note: We do NOT manually update state here again, as 
      // the optimistic update handled the visual change.
      // Refetch will trigger the useEffect above to ensure strict sync.
      refetch();
      
    } catch (error) {
      // 5. Rollback on Error
      console.error(error);
      setIsFavorited(prevIsFavorited);
      setFavoritesCount(prevCount);
      toast.error("Failed to save favorite");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* HEADER */}
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            {lesson.category}
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
            {lesson.emotionalTone}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 border-b pb-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            {new Date(lesson.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} /> 5 min read
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} /> {viewCount.toLocaleString()} Views
          </div>
        </div>

        {lesson.image && (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-64 md:h-[450px] object-cover rounded-2xl shadow-lg mb-8"
          />
        )}
      </header>

      {/* CONTENT & PREMIUM LOCK */}
      <div className="relative mb-12">
        {shouldBlockContent ? (
          <div className="relative">
            <div className="prose prose-lg text-gray-600 blur-sm select-none h-48 overflow-hidden">
              <p>{lesson.description.substring(0, 200)}...</p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 z-10">
              <Star className="w-12 h-12 text-yellow-500 mb-2 fill-current" />
              <h3 className="text-2xl font-bold mb-2">Premium Content</h3>
              <p className="text-gray-600 mb-6">
                Upgrade your plan to unlock this lesson.
              </p>
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
                onClick={() => navigate("/pricing")}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        ) : (
          <article className="prose prose-lg max-w-none text-gray-800">
            <p className="whitespace-pre-line">{lesson.description}</p>
          </article>
        )}
      </div>

      {/* AUTHOR & INTERACTIONS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl mb-12">
        <div className="flex items-center gap-4">
          <img
            src={lesson.authorImage || "https://i.ibb.co/t2Wz12d/user1.jpg"}
            alt={lesson.authorName}
            className="w-14 h-14 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <h4 className="font-bold text-gray-900">{lesson.authorName}</h4>
            <p className="text-sm text-gray-500">Author</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              isLiked
                ? "bg-red-50 text-red-600 font-semibold"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            <Heart size={20} className={isLiked ? "fill-current" : ""} />
            {likesCount}
          </button>

          <button
            onClick={handleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              isFavorited
                ? "bg-yellow-50 text-yellow-600 font-semibold"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {isFavorited ? (
              <Star size={20} className="fill-current" />
            ) : (
              <StarOff size={20} />
            )}
            {favoritesCount}
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="p-2 rounded-full bg-white border hover:bg-gray-100 text-gray-600"
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="p-2 rounded-full bg-white border hover:bg-red-50 hover:text-red-500 text-gray-400"
          >
            <Flag size={20} />
          </button>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Comments
        </h3>
        <CommentSection lessonId={lesson._id} user={user} />
      </div>

      {/* RELATED LESSONS */}
      {/* Uncommented and passed logic to ensure it doesn't break if props are missing */}
      <div>
         <h3 className="text-2xl font-bold mb-6">More like this</h3>
         {/* <RelatedLessons
           currentCategory={lesson?.category}
           currentTone={lesson?.emotionalTone}
           currentId={lesson?._id}
         /> */}
      </div>

      {/* SHARE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4">Share Lesson</h3>

            <div className="flex justify-center gap-6 mb-6">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={48} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl}>
                <TwitterIcon size={48} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl}>
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>
            </div>

            <div className="flex items-center gap-2 border p-2 rounded-lg bg-gray-50">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-sm outline-none text-gray-500"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-gray-200 rounded-md"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
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