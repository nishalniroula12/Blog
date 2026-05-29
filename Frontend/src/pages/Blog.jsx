import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const Blog = () => {
  const [data, setdata] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [likeBlogID, setLikeBlogID] = useState(new Set());

  const [page, setpage] = useState(1);
  const [totalpages, settotalpages] = useState(0);

  const [searchVal, setsearchVal] = useState("");

  const [user] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const nav = useNavigate();

  // ================= FETCH BLOGS =================
  const fetchblog = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/getblog",
        {
          withCredentials: true,
          params: {
            page,
            limit: 3,
          },
        }
      );

      console.log(res.data);

      settotalpages(res.data.totalpages || 0);

      setdata(res.data.blog || []);

      // SAVE ORIGINAL BLOGS
      setAllBlogs(res.data.blog || []);

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= FETCH LIKED BLOGS =================
  const fetchLikedBlogs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/getlike",
        {
          withCredentials: true,
        }
      );

      const likedIds = res.data.likeblogs.map(
        (item) => item._id
      );

      setLikeBlogID(new Set(likedIds));

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // ================= SEARCH =================
  const handlesearch = () => {
    // EMPTY SEARCH
    if (searchVal.trim() === "") {
      setdata(allBlogs);
      return;
    }

    // FILTER BLOGS
    const filteredBlogs = allBlogs.filter((item) =>
      item.title
        .toLowerCase()
        .includes(searchVal.toLowerCase())
    );

    setdata(filteredBlogs);
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchblog();

    if (user) {
      fetchLikedBlogs();
    }
  }, [page]);

  // ================= LIKE / UNLIKE =================
  const handlelike = async (blogId) => {
    if (!user) {
      alert("Please login first to like blog");

      setTimeout(() => {
        nav("/login");
      }, 1500);

      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:4000/api/like/${blogId}`,
        {},
        {
          withCredentials: true,
        }
      );

      const isLiked = res.data.like;

      const newlikecount = res.data.likecount;

      // UPDATE LIKED STATE
      setLikeBlogID((prev) => {
        const newSet = new Set(prev);

        if (isLiked) {
          newSet.add(blogId);
        } else {
          newSet.delete(blogId);
        }

        return newSet;
      });

      // UPDATE LIKE COUNT
      setdata((prev) =>
        prev.map((item) =>
          item._id === blogId
            ? {
                ...item,
                likecount: newlikecount,
              }
            : item
        )
      );

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">

      {/* HEADING */}
      <h1 className="text-3xl font-bold text-center mb-10">
        Latest Blogs
      </h1>

      {/* SEARCH */}
      <div className="flex justify-center gap-3 mb-10">
        <input
          type="text"
          value={searchVal}
          onChange={(e) =>
            setsearchVal(e.target.value)
          }
          placeholder="Search blogs..."
          className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <button
          onClick={handlesearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium"
        >
          Search
        </button>
      </div>

      {/* BLOGS */}
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
                src={`http://localhost:4000/uploads/${item.image}`}
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

                  {/* LIKES */}
                  <span className="text-xs text-gray-400">
                    {item.likecount || 0} Likes
                  </span>

                  {/* LIKE BUTTON */}
                  <button
                    onClick={() =>
                      handlelike(item._id)
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      likeBlogID.has(item._id)
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    {likeBlogID.has(item._id) ? (
                      <AiFillLike className="text-lg" />
                    ) : (
                      <AiOutlineLike className="text-lg" />
                    )}

                    <span className="text-sm">
                      {likeBlogID.has(item._id)
                        ? "Unlike"
                        : "Like"}
                    </span>
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

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-4 mt-10">

        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() => setpage(page - 1)}
          className={`px-5 py-2 rounded-xl font-medium transition ${
            page === 1
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          ← Prev
        </button>

        {/* PAGE INFO */}
        <div className="bg-white shadow px-5 py-2 rounded-xl border">
          <span className="font-semibold text-slate-700">
            Page {page} of {totalpages}
          </span>
        </div>

        {/* NEXT */}
        <button
          disabled={page >= totalpages}
          onClick={() => setpage(page + 1)}
          className={`px-5 py-2 rounded-xl font-medium transition ${
            page >= totalpages
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Blog;