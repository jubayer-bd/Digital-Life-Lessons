import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import useAxios from "../../hooks/useAxios";

/* -------------------------------- CARD -------------------------------- */

const CommentCard = ({ comment }) => {
  const dateObj = new Date(comment.createdAt);
  const formattedDate = !isNaN(dateObj)
    ? dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Just now";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        className="h-10 w-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
        src={
          comment.userImg ||
          `https://ui-avatars.com/api/?name=${comment.userName}&background=random`
        }
        alt={comment.userName}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h5 className="font-bold text-gray-900 text-sm">
            {comment.userName || "Anonymous"}
          </h5>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>
      </div>
    </motion.div>
  );
};

/* ----------------------------- MAIN SECTION ----------------------------- */

const CommentSection = ({ lessonId, user }) => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [visibleCount, setVisibleCount] = useState(2);

  /* ----------------------------- FETCH COMMENTS ----------------------------- */
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", lessonId],
    enabled: !!lessonId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${lessonId}/comments`);
      return res.data;
    },
  });

  /* ----------------------------- POST COMMENT ----------------------------- */
  const { mutate: postComment, isPending } = useMutation({
    mutationFn: async (newComment) => {
      const res = await axiosSecure.post(
        `/lessons/${lessonId}/comments`,
        newComment
      );
      return res.data;
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(["comments", lessonId], (old = []) => [
        newComment,
        ...old,
      ]);
      setContent("");
      setVisibleCount((v) => Math.max(v, 2));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    postComment({ content });
  };

  /* -------------------------------- UI -------------------------------- */

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Input Box */}
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
        {user ? (
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              className="w-full p-4 pr-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition shadow-sm text-gray-700"
              rows="3"
              placeholder="Share your thoughts or insights..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              required
            />

            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <MessageCircle className="mx-auto text-gray-300 w-10 h-10 mb-2" />
            <p className="text-gray-600">
              Please{" "}
              <a
                href="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                log in
              </a>{" "}
              to join the conversation.
            </p>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Loading discussion...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4 bg-gray-50 rounded-lg">
            No comments yet. Be the first to share your insight!
          </p>
        ) : (
          <>
            <AnimatePresence>
              {comments.slice(0, visibleCount).map((comment) => (
                <CommentCard key={comment._id} comment={comment} />
              ))}
            </AnimatePresence>

            {visibleCount < comments.length && (
              <button
                onClick={() => setVisibleCount((v) => v + 2)}
                className="mx-auto block text-sm text-blue-600 font-semibold hover:underline"
              >
                Load more comments
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
