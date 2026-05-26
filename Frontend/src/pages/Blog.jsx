import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const Blog = () => {
  const [data, setdata] = useState([]);
  const [likeBlogID, setLikeBlogID] = useState(new Set());

  const [user] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const nav = useNavigate();

  // Fetch all blogs
  const fetchblog = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/getblog"
      );

      setdata(res.data.blog);

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // Fetch liked blogs of logged in user
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

  useEffect(() => {
    fetchblog();

    if (user) {
      fetchLikedBlogs();
    }
  }, []);

  // Like / Unlike
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

      // Update liked state
      setLikeBlogID((prev) => {
        const newSet = new Set(prev);

        if (isLiked) {
          newSet.add(blogId);
        } else {
          newSet.delete(blogId);
        }

        return newSet;
      });

      // Update like count instantly
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
      <h1 className="text-3xl font-bold text-center mb-10">
        Latest Blogs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            <img
              onClick={()=>{
                
                nav(`/view/${item._id}`)}}

              src={`http://localhost:4000/uploads/${item.image}`}
              alt={item.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h1 className="text-xl font-bold mb-2">
                Title:{item.title}
              </h1>

              <p className="text-gray-600 text-sm mb-3">
               Description: {item.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium text-sm">
                  Category:{item.category?.name}
                </span>

                <span className="text-xs text-gray-400">
                  Blog Post
                </span>

                <span className="text-xs text-gray-400">
                  {item.likecount || 0} Likes
                </span>

                <button
                  onClick={() => handlelike(item._id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    likeBlogID.has(item._id)
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
                      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {likeBlogID.has(item._id) ? (
                    
                    <AiFillLike className="text-lg" />
                    
                  )
                  
                  : (
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
        ))}
      </div>
    </div>
  );
};

export default Blog;