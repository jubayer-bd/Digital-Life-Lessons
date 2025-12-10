import React, { useState, useEffect } from 'react';
import { Send, User } from 'lucide-react';

// Base URL for the mock API server
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Renders an individual comment card.
 */
const CommentCard = ({ comment }) => {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="flex space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <img 
        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
        src={comment.userImg || `https://i.pravatar.cc/150?u=${comment.userId}`} // Use actual img or mock
        alt={comment.userName}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">{comment.userName || 'Anonymous User'}</p>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-gray-700 mt-1 whitespace-pre-line">{comment.content}</p>
      </div>
    </div>
  );
};


/**
 * Main Comment Section component.
 */
const CommentSection = ({ lessonId, user }) => {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  // --- API Functions ---
  
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Optional: Show an error message toast to the user
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !user) return;

    // Use the mock user ID we defined in the backend for authentication
    const userIdHeader = user?.id || 'user_1'; 
    
    setIsPosting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userIdHeader, // IMPORTANT: Mock Auth Header
        },
        body: JSON.stringify({ content: newCommentContent }),
      });
      
      if (!response.ok) throw new Error('Failed to post comment');

      const postedComment = await response.json();
      
      // Real-time UI Update: Prepend the new comment to the list
      setComments([postedComment, ...comments]);
      setNewCommentContent(''); // Clear input

    } catch (error) {
      console.error("Error posting comment:", error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  // Fetch comments when the component mounts or lessonId changes
  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId]);


  return (
    <div className="space-y-8">
      
      {/* 1. Comment Input Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {user ? (
          <form onSubmit={handlePostComment} className="space-y-4">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-y"
              rows="3"
              placeholder={`Post a comment as ${user.name}...`}
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              disabled={isPosting}
              required
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isPosting || newCommentContent.trim().length === 0}
              >
                {isPosting ? 'Posting...' : 'Post Comment'}
                <Send size={18} />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              Please <a href="/login" className="text-blue-600 hover:underline font-bold">log in</a> to post a comment.
            </p>
          </div>
        )}
      </div>

      {/* 2. Comment List Section */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-gray-800">
            {isLoading ? 'Loading Comments...' : `${comments.length} Comments`}
        </h4>

        {isLoading && <p className="text-gray-500">Retrieving feedback...</p>}

        {!isLoading && comments.length === 0 && (
          <p className="text-gray-500 italic">Be the first to share your thoughts on this lesson!</p>
        )}

        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;