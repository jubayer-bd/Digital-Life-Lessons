import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // or 'next/link'
import { Share2, Heart, Bookmark, Flag, Eye, Clock, Calendar, User } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share';
import ReportModal from './ReportModal'; // Component defined below
import RelatedLessons from './RelatedLessons'; // Component defined below
import CommentSection from './CommentSection'; 

const LessonDetails = ({ user }) => { // 'user' prop contains logged-in user info
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock Data (In a real app, fetch this via useEffect/API)
  const [lesson, setLesson] = useState({
    _id: '123',
    title: 'The Art of Letting Go',
    description: 'A deep dive into why holding onto past grudges destroys your future peace...',
    category: 'Personal Growth',
    emotionalTone: 'Realization',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80',
    isPremium: true,
    createdAt: '2025-11-15',
    updatedAt: '2025-12-01',
    author: {
      name: 'Sarah Jenkins',
      profileImg: 'https://i.pravatar.cc/150?u=sarah',
      totalLessons: 42,
      id: 'author_01'
    },
    likes: ['user_99', 'user_88'], // Array of user IDs
    likesCount: 1200,
    favoritesCount: 342,
  });

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Random views generated once on mount
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Initialize random views
    setViewCount(Math.floor(Math.random() * 10000));
    
    // Initialize Like State
    if (lesson) {
        setLikesCount(lesson.likesCount);
        if (user && lesson.likes.includes(user.id)) {
            setIsLiked(true);
        }
    }
  }, [lesson, user]);

  // --- PREMIUM GATE CHECK ---
  const isUserPremium = user?.isPremium || false; // Check user status
  const shouldBlockContent = lesson.isPremium && !isUserPremium;

  // --- HANDLERS ---

  const handleLike = () => {
    if (!user) {
      alert("Please log in to like this lesson."); // Replace with Toast
      // navigate('/login');
      return;
    }

    // Optimistic UI Update
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // TODO: API Call to backend to toggle like
    // await api.post(`/lessons/${lesson._id}/like`);
  };

  const handleFavorite = () => {
    // Similar logic to Like
    if (!user) return alert("Please log in to save.");
    console.log("Toggled Favorite");
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      
      {/* 1. Lesson Information Section */}
      <header className="mb-8">
        <div className="flex gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{lesson.category}</span>
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">{lesson.emotionalTone}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{lesson.title}</h1>
        
        {/* 2. Lesson Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-1"><Calendar size={16}/> {new Date(lesson.createdAt).toLocaleDateString()}</div>
            <div className="flex items-center gap-1"><Clock size={16}/> 5 min read</div>
            <div className="flex items-center gap-1"><Eye size={16}/> {viewCount.toLocaleString()} Views</div>
        </div>

        {lesson.imageUrl && (
            <img src={lesson.imageUrl} alt={lesson.title} className="w-full h-64 md:h-96 object-cover rounded-xl shadow-md mb-8" />
        )}
      </header>

      {/* --- CONTENT AREA (Premium Logic) --- */}
      <div className="relative">
        {shouldBlockContent ? (
           // BLURRED OVERLAY FOR NON-PREMIUM
           <div className="relative">
             <div className="prose prose-lg text-gray-800 filter blur-md select-none h-64 overflow-hidden">
                <p>{lesson.description.substring(0, 150)}...</p>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, voluptatum.</p>
                <p>Detailed insight hidden...</p>
             </div>
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200 p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to Unlock</h3>
                <p className="text-gray-600 mb-6">This is a Premium Lesson. Upgrade your plan to read the full story and insights.</p>
                <button 
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  Unlock Full Access
                </button>
             </div>
           </div>
        ) : (
           // FULL CONTENT
           <article className="prose prose-lg text-gray-800 max-w-none mb-12">
               <p className="whitespace-pre-line">{lesson.description}</p>
           </article>
        )}
      </div>

      <hr className="my-8 border-gray-200" />

      {/* 3. Author Section */}
      <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl mb-8">
        <div className="flex items-center gap-4">
            <img src={lesson.author.profileImg} alt={lesson.author.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
            <div>
                <h4 className="text-lg font-bold text-gray-900">{lesson.author.name}</h4>
                <p className="text-sm text-gray-500">{lesson.author.totalLessons} Lessons Created</p>
            </div>
        </div>
        <Link to={`/profile/${lesson.author.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
            View Profile
        </Link>
      </div>

      {/* 4. Stats & 5. Interaction Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6 border-y border-gray-100">
          
          {/* Stats Display */}
          <div className="flex gap-6 text-gray-600 font-medium">
             <div className="text-center">
                <span className="block text-xl font-bold text-gray-900">{likesCount}</span>
                <span className="text-xs uppercase">Likes</span>
             </div>
             <div className="text-center">
                <span className="block text-xl font-bold text-gray-900">{lesson.favoritesCount}</span>
                <span className="text-xs uppercase">Favorites</span>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
              {/* Like Button */}
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${isLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
              >
                  <Heart className={isLiked ? "fill-current" : ""} size={20} />
                  {isLiked ? 'Liked' : 'Like'}
              </button>

              {/* Favorite Button */}
              <button onClick={handleFavorite} className="p-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                  <Bookmark size={20} />
              </button>

              {/* Share Buttons (React Share) */}
              <div className="flex gap-2">
                 <FacebookShareButton url={window.location.href}>
                    <FacebookIcon size={32} round />
                 </FacebookShareButton>
                 <TwitterShareButton url={window.location.href}>
                    <TwitterIcon size={32} round />
                 </TwitterShareButton>
                 <WhatsappShareButton url={window.location.href}>
                    <WhatsappIcon size={32} round />
                 </WhatsappShareButton>
              </div>
            
              {/* Report Button */}
              <button 
                onClick={() => setIsReportModalOpen(true)} 
                className="ml-2 text-gray-400 hover:text-red-500 transition"
                title="Report this lesson"
              >
                  <Flag size={20} />
              </button>
          </div>
      </div>

      {/* 6. Comments Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Comments</h3>
        <CommentSection lessonId={lesson._id} user={user} />
      </div>

      {/* 7. Similar Lessons */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold mb-6">You Might Also Like</h3>
        <RelatedLessons currentCategory={lesson.category} currentTone={lesson.emotionalTone} currentId={lesson._id} />
      </div>

      {/* Modals */}
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