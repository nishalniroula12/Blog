import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import api from "../api/axios";
import Sidebar from "./Sidebar";

const Allblog = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // IMAGE URL FUNCTION
  // ==========================================
  const getImageUrl = (image) => {
    if (!image) {
      return "https://via.placeholder.com/400x250?text=No+Image";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const cleanImage = image.replace(/^\/+/, "");
    const baseUrl = import.meta.env.VITE_RENDER_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

    return `${cleanBaseUrl}uploads/${cleanImage}`;
  };

  // ==========================================
  // FETCH BLOGS
  // ==========================================
  const blogfetch = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/getblog", {
        params: {
          page: page,
          limit: 5,
        },
        withCredentials: true,
      });

      const blogs = Array.isArray(res?.data?.blog) ? res.data.blog : [];
      setData(blogs);

      const pages = Number(res?.data?.totalpages);
      setTotalPages(pages > 0 ? pages : 1);
    } catch (error) {
      console.error("Blog Fetch Error:", error);
      setError(
        error?.response?.data?.message || "Failed to load blogs. Please try again."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    blogfetch();
  }, [page]);

  // ==========================================
  // DELETE BLOG
  // ==========================================
  const deleteblog = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await api.delete(`/api/blogdelete/${id}`, {
        withCredentials: true,
      });

      setData((previousData) => previousData.filter((item) => item?._id !== id));
      alert("Blog deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error?.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH HANDLERS
  // ==========================================
  const handlesearch = () => {
    if (searchVal.trim() === "") {
      setPage(1);
      blogfetch();
      return;
    }

    const searchText = searchVal.trim().toLowerCase();
    const filteredBlogs = data.filter((item) =>
      item?.title?.toLowerCase().includes(searchText)
    );
    setData(filteredBlogs);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handlesearch();
    }
  };

  const handleImageError = (event) => {
    event.currentTarget.src =
      "https://via.placeholder.com/400x250?text=Image+Not+Found";
  };

  // ==========================================
  // PAGINATION
  // ==========================================
  const previousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                All Blogs
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage, edit, and organize all published blog posts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/adminblog")}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition active:scale-[0.98] shrink-0"
            >
              <FaPlus size={14} />
              Add Blog
            </button>
          </div>

          {/* SEARCH CONTROL BAR */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search blog title..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
            <button
              type="button"
              onClick={handlesearch}
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition shrink-0"
            >
              <FaSearch size={12} />
              Search
            </button>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* CONTENT CARD CONTAINER */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-9 h-9 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />
                <p className="text-slate-500 text-sm">Loading blogs...</p>
              </div>
            ) : data.length > 0 ? (
              <>
                {/* DESKTOP TABLE VIEW */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4 w-16">SN</th>
                        <th className="py-3.5 px-4">Image</th>
                        <th className="py-3.5 px-4">Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Description</th>
                        <th className="py-3.5 px-4 text-center w-32">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
                      {data.map((blog, index) => (
                        <tr key={blog?._id || index} className="hover:bg-gray-50/50 transition">
                          <td className="py-3.5 px-4 font-medium text-slate-400">
                            {(page - 1) * 5 + index + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <img
                              src={getImageUrl(blog?.image)}
                              alt={blog?.title || "Blog"}
                              onError={handleImageError}
                              className="w-16 h-12 object-cover rounded-lg border border-gray-200"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                            {blog?.title || "Untitled"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">
                              {blog?.category?.name || "No Category"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="truncate text-slate-500">
                              {blog?.description || "No description"}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => navigate(`/adminblog/${blog._id}`)}
                                className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                                title="Edit"
                              >
                                <FaEdit size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={deletingId === blog._id}
                                onClick={() => deleteblog(blog._id)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                                title="Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE / TABLET GRID VIEW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4 p-4 sm:p-6">
                  {data.map((blog, index) => (
                    <div
                      key={blog?._id || index}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <img
                          src={getImageUrl(blog?.image)}
                          alt={blog?.title || "Blog"}
                          onError={handleImageError}
                          className="w-full h-44 object-cover"
                        />
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-md text-xs font-medium">
                              {blog?.category?.name || "No Category"}
                            </span>
                            <span className="text-xs text-slate-400">
                              #{(page - 1) * 5 + index + 1}
                            </span>
                          </div>
                          <h2 className="text-base font-bold text-slate-900 line-clamp-1">
                            {blog?.title || "Untitled"}
                          </h2>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {blog?.description || "No description available"}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/adminblog/${blog._id}`)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 py-2 rounded-lg text-xs font-semibold transition"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === blog._id}
                          onClick={() => deleteblog(blog._id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
                        >
                          <FaTrash size={12} />
                          {deletingId === blog._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* EMPTY STATE */
              <div className="p-12 text-center">
                <h2 className="text-xl font-semibold text-slate-800">
                  No Blogs Found
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Start by creating your first blog post.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/adminblog")}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
                >
                  <FaPlus size={12} />
                  Create Blog
                </button>
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {!loading && data.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={previousPage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <FaChevronLeft size={10} />
                  Previous
                </button>

                <span className="text-xs font-medium text-slate-600">
                  Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={nextPage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Next
                  <FaChevronRight size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Allblog;