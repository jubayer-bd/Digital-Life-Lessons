import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react"; // Added Alert icon
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast"; // Use toast instead of alert

const ReportModal = ({ isOpen, onClose, lessonId, user }) => {
  const [reason, setReason] = useState("");
  const axiosSecure = useAxios();

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  const reportReasons = [
    "Inappropriate Content",
    "Hate Speech or Harassment",
    "Misleading or False Information",
    "Spam or Promotional Content",
    "Sensitive or Disturbing Content",
    "Other",
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return axiosSecure.post(`/lessons/${lessonId}/report`, { reason });
    },
    onSuccess: () => {
      toast.success("Report submitted. Thank you for helping us.");
      onClose();
    },
    onError: () => {
      toast.error("Failed to submit report.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required to report.");
    if (!reason) return toast.error("Please select a reason.");
    mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative scale-100 transform transition-all">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Report Lesson</h2>
            <p className="text-sm text-gray-500">Flag content for admin review</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Why are you reporting this?
            </label>
            <select
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition bg-white"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              {reportReasons.map((r, index) => (
                <option key={index} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition disabled:opacity-70"
            >
              {isPending ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;