import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import api from "../api/axios";

const Blog = () => {
  const [data, setData] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [likeBlogID, setLikeBlogID] = useState(new Set());

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const [user] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const nav = useNavigate();

  // ================= FETCH BLOGS OR SEARCH =================
  const fetchData = async () => {
    try {
      // 🔍 SEARCH MODE
      if (search) {
        const res = await api.get(
          `api/search?search=${search}`
        );

        setData(res.data.blogs || []);
        setAllBlogs(res.data.blogs || []);
        setTotalPages(0);
        return;
      }

      // 📄 NORMAL PAGINATION MODE
      const res = await api.get(
        "api/getblog",
        {
          params: {
            page,
            limit: 3,
          },
        }
        
      );

      setTotalPages(res.data.totalpages || 0);
      setData(res.data.blog || []);
      setAllBlogs(res.data.blog || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= FETCH LIKES =================
  const fetchLikedBlogs = async () => {
    try {
      const res = await api.get(
        "api/getlike",
        
      );

      const likedIds = res.data.likeblogs.map(
        (item) => item._id
      );

      setLikeBlogID(new Set(likedIds));
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= LIKE / UNLIKE =================
  const handleLike = async (blogId) => {
    if (!user) {
      alert("Please login first");
      setTimeout(() => nav("/login"), 1500);
      return;
    }

    try {
      const res = await api.post(
        `api/like/${blogId}`,
        {},
        
      );
      

      const isLiked = res.data.like;
      const newLikeCount = res.data.likecount;

      setLikeBlogID((prev) => {
        const newSet = new Set(prev);
        if (isLiked) newSet.add(blogId);
        else newSet.delete(blogId);
        return newSet;
      });

      setData((prev) =>
        prev.map((item) =>
          item._id === blogId
            ? { ...item, likecount: newLikeCount }
            : item
        )
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchData();

    if (user) {
      fetchLikedBlogs();
    }
  }, [page, search]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Latest Blogs
      </h1>

      {/* SEARCH INFO */}
      {search && (
        <p className="text-center text-gray-600 mb-5">
          Search results for: <b>{search}</b>
        </p>
      )}

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
            >

              {/* IMAGE */}
              <img
                onClick={() => nav(`/view/${item._id}`)}
                src={`${import.meta.env.VITE_RENDER_URL}uploads/${item.image}`}
                alt={item.title}
                className="w-full h-48 object-cover cursor-pointer"
              />

              <div className="p-4">

                {/* TITLE */}
                <h1 className="text-xl font-bold mb-2">
                  {item.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {item.description}
                </p>

                {/* FOOTER */}
                <div className="flex justify-between items-center flex-wrap gap-3">

                  {/* CATEGORY */}
                  <span className="text-blue-600 font-medium text-sm">
                    {item.category?.name}
                  </span>

                  {/* LIKE COUNT */}
                  <span className="text-xs text-gray-400">
                    {item.likecount || 0} Likes
                  </span>

                  {/* LIKE BUTTON */}
                  <button
                    onClick={() => handleLike(item._id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                      likeBlogID.has(item._id)
                        ? "bg-pink-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {likeBlogID.has(item._id) ? (
                      <AiFillLike />
                    ) : (
                      <AiOutlineLike />
                    )}

                    {likeBlogID.has(item._id)
                      ? "Unlike"
                      : "Like"}
                  </button>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-xl">
            No Blogs Found
          </div>
        )}
      </div>

      {/* PAGINATION (only if NOT searching) */}
      {!search && (
        <div className="flex justify-center items-center gap-4 mt-10">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
};

export default Blog;