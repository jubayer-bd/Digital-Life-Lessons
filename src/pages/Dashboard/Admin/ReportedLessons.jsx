import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";

const ReportedLessons = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const queryClient = useQueryClient();
  const axiosSecure = useAxios();

  // 🔹 Get all reported lessons
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["reported-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/reported-lessons");
      return res.data;
    },
  });

  // 🔹 Get reports for a lesson
  const { data: reports = [], isFetching } = useQuery({
    queryKey: ["lesson-reports", selectedLesson],
    enabled: !!selectedLesson,
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/${selectedLesson}/reports`);
      return res.data;
    },
  });

  // 🔹 Ignore reports
  const ignoreMutation = useMutation({
    mutationFn: (lessonId) =>
      axiosSecure.patch(`/admin/lessons/${lessonId}/ignore-reports`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-lessons"]);
    },
  });

  // 🔹 Delete lesson
  const deleteMutation = useMutation({
    mutationFn: (lessonId) => axiosSecure.delete(`/admin/lessons/${lessonId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reported-lessons"]);
      setSelectedLesson(null);
    },
  });

  if (isLoading) {
    return <p className="p-6 text-sm">Loading reported lessons...</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">
        🚩 Reported Lessons
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Lesson Title</th>
              <th className="p-3 text-center">Reports</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lessons.map((lesson) => (
              <tr key={lesson._id} className="border-t">
                <td className="p-3">{lesson.title}</td>
                <td className="p-3 text-center">{lesson.reportCount}</td>
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedLesson(lesson._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => ignoreMutation.mutate(lesson._id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Ignore
                  </button>

                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this lesson?")
                      ) {
                        deleteMutation.mutate(lesson._id);
                      }
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!lessons.length && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No reported lessons 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="bg-white rounded-lg shadow p-4 space-y-3"
          >
            <h3 className="font-semibold text-sm">{lesson.title}</h3>

            <p className="text-xs text-gray-600">
              Reports: <span className="font-medium">{lesson.reportCount}</span>
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedLesson(lesson._id)}
                className="w-full py-2 bg-blue-500 text-white rounded text-sm"
              >
                View Reports
              </button>

              <button
                onClick={() => ignoreMutation.mutate(lesson._id)}
                className="w-full py-2 bg-yellow-500 text-white rounded text-sm"
              >
                Ignore Reports
              </button>

              <button
                onClick={() => {
                  if (confirm("Are you sure you want to delete this lesson?")) {
                    deleteMutation.mutate(lesson._id);
                  }
                }}
                className="w-full py-2 bg-red-600 text-white rounded text-sm"
              >
                Delete Lesson
              </button>
            </div>
          </div>
        ))}

        {!lessons.length && (
          <p className="text-center text-gray-500 py-6">
            No reported lessons 🎉
          </p>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              Report Reasons
            </h3>

            {isFetching ? (
              <p className="text-sm">Loading reports...</p>
            ) : (
              <ul className="space-y-3 max-h-72 overflow-y-auto">
                {reports.map((r) => (
                  <li key={r._id} className="border p-3 rounded text-sm">
                    <p className="font-medium">{r.reason}</p>
                    <p className="text-xs text-gray-500">
                      {r.userName} ({r.userEmail})
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setSelectedLesson(null)}
              className="mt-5 w-full sm:w-auto px-4 py-2 bg-gray-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedLessons;
