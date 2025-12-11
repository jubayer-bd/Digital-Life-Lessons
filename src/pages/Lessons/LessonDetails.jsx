import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Share2,
  Heart,
  Bookmark,
  Flag,
  Eye,
  Clock,
  Calendar,
  StarOff,
  Star,
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
import RelatedLessons from "./RelatedLessons";
import CommentSection from "./CommentSection";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useIsPremium from "../../hooks/useIsPremimum";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const LessonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { isPremium } = useIsPremium();

  const shareUrl = `${window.location.origin}/lessons/${id}`;

  const {
    data: lesson,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${id}`);
      return res.data;
    },
  });

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // 🔥 New Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 10000));
  }, []);

  useEffect(() => {
    if (lesson) {
      setLikesCount(lesson.likesCount || 0);
      if (user && lesson.likes?.includes(user.email)) setIsLiked(true);

      setFavoritesCount(lesson.favoritesCount || 0);
      if (user && lesson.favorites?.includes(user.email)) setIsFavorited(true);
    }
  }, [lesson, user]);

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Error loading lesson.
      </div>
    );
  if (!lesson) return null;

  const isUserPremium = isPremium || false;
  const shouldBlockContent = lesson.accessLevel === "premium" && !isUserPremium;

  // ---------- COPY LINK ----------
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  // ---------- LIKE ----------
  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like this lesson.");
      return;
    }

    const newState = !isLiked;
    setIsLiked(newState);
    setLikesCount((prev) => (newState ? prev + 1 : prev - 1));

    try {
      await axiosSecure.patch(`/lessons/${id}/like`, {
        email: user.email,
      });
    } catch {
      toast.error("Failed to like.");
    }
  };

  // ---------- FAVORITE ----------
  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to save this lesson.");
      return;
    }

    const newState = !isFavorited;
    setIsFavorited(newState);
    setFavoritesCount((prev) => (newState ? prev + 1 : prev - 1));

    try {
      await axiosSecure.patch(`/lessons/${id}/favorite`, {
        email: user.email,
      });
    } catch {
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      {/* ---------- HEADER ---------- */}
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {lesson.category}
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {lesson.emotionalTone}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date(lesson.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} /> 5 min read
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} /> {viewCount.toLocaleString()} Views
          </div>
        </div>

        {lesson.image && (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="w-full h-64 md:h-96 object-cover rounded-xl shadow-md mb-8"
          />
        )}
      </header>

      {/* ---------- CONTENT (PREMIUM CHECK) ---------- */}
      <div className="relative">
        {shouldBlockContent ? (
          <div className="relative">
            <div className="prose prose-lg text-gray-800 filter blur-md select-none h-64 overflow-hidden">
              <p>{lesson.description.substring(0, 150)}...</p>
            </div>

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Subscribe to Unlock
              </h3>
              <p className="text-gray-600 mb-6">
                This is a Premium Lesson. Upgrade to read the full story.
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition transform hover:-translate-y-1"
              >
                Unlock Full Access
              </button>
            </div>
          </div>
        ) : (
          <article className="prose prose-lg text-gray-800 max-w-none mb-12">
            <p className="whitespace-pre-line">{lesson.description}</p>
          </article>
        )}
      </div>

      <hr className="my-8 border-gray-200" />

      {/* ---------- AUTHOR ---------- */}
      <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl mb-8">
        <div className="flex items-center gap-4">
          <img
            src={lesson.authorImage || "https://i.ibb.co/t2Wz12d/user1.jpg"}
            alt={lesson.authorName}
            className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
          />
          <div>
            <h4 className="text-lg font-bold text-gray-900">
              {lesson.authorName}
            </h4>
            <p className="text-xs text-gray-500">{lesson.authorEmail}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/profile/${lesson.authorEmail}`)}
          className="text-gray-400 font-medium text-sm border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          View Profile
        </button>
      </div>

      {/* ---------- LIKE, FAVORITE, SHARE, REPORT ---------- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-y border-gray-100">
        <div className="flex gap-6 text-gray-600 font-medium">
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-900">
              {likesCount}
            </span>
            <span className="text-xs uppercase">Likes</span>
          </div>

          <div className="text-center">
            <span className="block text-xl font-bold text-gray-900">
              {favoritesCount}
            </span>
            <span className="text-xs uppercase">Favorites</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* LIKE */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
              isLiked
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Heart className={isLiked ? "fill-current" : ""} size={20} />
            {isLiked ? "Liked" : "Like"}
          </button>

          {/* FAVORITE */}
          <button
            onClick={handleFavorite}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition"
          >
            {isFavorited ? (
              <Star className="text-yellow-400" size={20} />
            ) : (
              <StarOff size={20} />
            )}
            {favoritesCount}
          </button>

          {/* SHARE BUTTON */}
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
          >
            <Share2 size={20} />
            Share
          </button>

          {/* REPORT */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="ml-2 text-gray-400 hover:text-red-500 transition"
            title="Report this lesson"
          >
            <Flag size={20} />
          </button>
        </div>
      </div>

      {/* ---------- SHARE MODAL (YOUTUBE STYLE) ---------- */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl relative">
            {/* Close */}
            <button
              onClick={() => setShareModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Share this lesson
            </h2>

            <div className="flex justify-center gap-4 mb-6">
              <FacebookShareButton url={shareUrl}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={lesson.title}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={lesson.title}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
            </div>

            {/* COPY SECTION */}
            <div className="flex items-center gap-2 border rounded-lg p-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-2 py-1 text-gray-700 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Comments</h3>
        <CommentSection lessonId={lesson._id} user={user} />
      </div>

      {/* RELATED LESSONS */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">You Might Also Like</h3>
        <RelatedLessons
          currentCategory={lesson?.category}
          currentTone={lesson?.emotionalTone}
          currentId={lesson?._id}
        />
      </div>

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
