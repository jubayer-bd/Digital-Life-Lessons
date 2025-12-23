import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import LessonCard from "./LessonCard";
import useIsPremium from "../../hooks/useIsPremium";

const Lessons = () => {
  const axiosSecure = useAxios();
  const { isPremium } = useIsPremium();

  // --- 1. State Management ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- 2. Logic: Search Debounce ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // 500ms delay
    return () => clearTimeout(handler);
  }, [search]);

  // --- 3. Logic: Reset Page on Filter Change ---
  // If user is on page 5 and searches something new, they should go back to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, tone, sort]);

  // --- 4. Data Fetching ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lessons", debouncedSearch, category, tone, sort, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get("/lessons", {
        params: {
          search: debouncedSearch,
          category,
          tone,
          sort,
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      return res.data; // Expecting { lessons: [], totalCount: 0 }
    },
  });

  const lessons = data?.lessons || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Public <span className="text-blue-600">Lessons</span>
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
      </div>

      {/* --- 5. Search & Filter Bar --- */}
      <div className="bg-white border border-gray-200 p-6 rounded-3xl mb-12 shadow-sm flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <div className="form-control flex flex-col min-w-5/12 ">
          <label className="label text-xs font-bold uppercase text-gray-500">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title..."
            className="input input-bordered w-full  focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="form-control w-full md:w-44">
          <label className="label text-xs font-bold uppercase text-gray-500">
            Category
          </label>
          <select
            className="select select-bordered focus:border-blue-600"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Productivity">Productivity</option>
            <option value="Health">Health</option>
            <option value="Tech">Tech</option>
          </select>
        </div>

        {/* Tone Filter */}
        <div className="form-control w-full md:w-44">
          <label className="label text-xs font-bold uppercase text-gray-500">
            Tone
          </label>
          <select
            className="select select-bordered focus:border-blue-600"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="">All Tones</option>
            <option value="Calm">Calm</option>
            <option value="Energetic">Energetic</option>
            <option value="Serious">Serious</option>
          </select>
        </div>

        {/* Sort */}
        <div className="form-control w-full md:w-44">
          <label className="label text-xs font-bold uppercase text-gray-500">
            Sort By
          </label>
          <select
            className="select select-bordered focus:border-blue-600"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="mostSaved">Most Saved</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setSearch("");
            setCategory("");
            setTone("");
            setSort("newest");
          }}
          className="btn border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all px-6"
        >
          Reset
        </button>
      </div>

      {/* --- 6. Results Section --- */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-96 bg-blue-50/50 animate-pulse rounded-2xl border border-blue-100"
            ></div>
          ))}
        </div>
      ) : isError ? (
        <div className="alert alert-error">
          Error loading lessons: {error.message}
        </div>
      ) : lessons.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson._id}
                lesson={lesson}
                isUserPremium={isPremium}
              />
            ))}
          </div>

          {/* --- 7. Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 mt-16">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="btn btn-circle border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-20"
                >
                  ❮
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`btn btn-circle ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-blue-600 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="btn btn-circle border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-20"
                >
                  ❯
                </button>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Showing {lessons.length} of {totalCount} lessons
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-xl font-medium">
            No lessons match your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Lessons;
