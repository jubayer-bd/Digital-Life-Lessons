import React from 'react';
import { Link } from 'react-router-dom';

const RelatedLessons = ({ currentCategory, currentTone, currentId }) => {
  
  // Mock Fetch Logic: Filter from DB where category === currentCategory AND _id != currentId limit 6
  const relatedLessons = [
    { id: 101, title: 'Growth Mindset Hack', category: 'Personal Growth', image: 'https://placehold.co/400x250' },
    { id: 102, title: 'Morning Routine', category: 'Personal Growth', image: 'https://placehold.co/400x250' },
    { id: 103, title: 'Overcoming Failure', category: 'Personal Growth', image: 'https://placehold.co/400x250' },
    // ... add more mock data up to 6
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedLessons.map((item) => (
        <Link to={`/lesson/${item.id}`} key={item.id} className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
            <div className="h-40 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div className="p-4">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.category}</span>
                <h4 className="font-bold text-gray-900 mt-2 mb-1 truncate">{item.title}</h4>
                <p className="text-sm text-gray-500">Read more →</p>
            </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedLessons;