import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

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

  // 🔹 TanStack mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return axiosSecure.post(`/lessons/${lessonId}/report`, {
        reason,
      });
    },
    onSuccess: () => {
      alert("✅ Report submitted successfully. Thank you!");
      onClose();
    },
    onError: () => {
      alert("❌ Failed to submit report. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to report.");
      return;
    }

    if (!reason) {
      alert("Please select a reason.");
      return;
    }

    mutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Report Lesson
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Help us keep the community safe. Reports are reviewed by admins.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a reason
            </label>

            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="">Choose a reason</option>
              {reportReasons.map((r, index) => (
                <option key={index} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
