import React, { useState } from 'react';
import { X } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, lessonId, user }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Inappropriate Content",
    "Hate Speech or Harassment",
    "Misleading or False Information",
    "Spam or Promotional Content",
    "Sensitive or Disturbing Content",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user) return alert("You must be logged in to report.");
    
    setIsSubmitting(true);

    const reportData = {
      lessonId,
      reporterUserId: user.id,
      reporterEmail: user.email,
      reason,
      timestamp: new Date().toISOString()
    };

    try {
        // Mock DB Call
        console.log("Submitting Report to DB:", reportData); 
        // await db.collection('lessonsReports').add(reportData);
        
        alert("Report submitted successfully. We will review this shortly.");
        onClose();
    } catch (error) {
        alert("Failed to submit report.");
    } finally {
        setIsSubmitting(false);
        setReason('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-900">Report Lesson</h2>
        <p className="text-sm text-gray-600 mb-4">Please select a reason for reporting this content. Reports are anonymous.</p>

        <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <select 
                className="w-full border border-gray-300 rounded-lg p-2.5 mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
            >
                <option value="">Select a reason</option>
                {reportReasons.map((r, index) => (
                    <option key={index} value={r}>{r}</option>
                ))}
            </select>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;