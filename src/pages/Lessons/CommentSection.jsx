// CommentSection.jsx
import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import useAxios from "../../hooks/useAxios";

const CommentCard = ({ comment }) => {
  const formattedDate = new Date(
    typeof comment.createdAt === "number"
      ? comment.createdAt
      : comment.createdAt
  ).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <img
        className="h-10 w-10 rounded-full object-cover border-2 shadow-sm"
        src={comment.userImg || `https://i.pravatar.cc/150?u=${comment.userId}`}
        alt={comment.userName}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">
            {comment.userName || "Anonymous User"}
          </p>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-gray-700 mt-1 whitespace-pre-line">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

const CommentSection = ({ lessonId, user }) => {
  const axiosSecure = useAxios();

  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await axiosSecure.get(`/lessons/${lessonId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Post comment
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!user || !newCommentContent.trim()) return;

    setIsPosting(true);

    try {
      const res = await axiosSecure.post(
        `/lessons/${lessonId}/comments`,
        { content: newCommentContent },
        {
          headers: {
            email: user?.email, // your existing auth pattern
          },
        }
      );

      // Update UI instantly
      setComments([res.data, ...comments]);
      setNewCommentContent("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment.");
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    if (lessonId) fetchComments();
  }, [lessonId]);

  return (
    <div className="space-y-8">
      {/* Input Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {user ? (
          <form onSubmit={handlePostComment} className="space-y-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary resize-y"
              rows="3"
              placeholder={`Post a comment as ${user.displayName}...`}
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              disabled={isPosting}
              required
            ></textarea>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isPosting || newCommentContent.trim().length === 0}
              >
                {isPosting ? "Posting..." : "Post Comment"} <Send size={18} />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              Please{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-bold"
              >
                log in
              </a>{" "}
              to post a comment.
            </p>
          </div>
        )}
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-800">
          {isLoading ? "Loading Comments..." : `${comments.length} Comments`}
        </h4>

        {isLoading && <p className="text-gray-500">Retrieving feedback...</p>}

        {!isLoading && comments.length === 0 && (
          <p className="text-gray-500 italic">
            Be the first to share your thoughts on this lesson!
          </p>
        )}

        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
