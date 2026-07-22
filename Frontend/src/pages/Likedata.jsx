import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaHeart } from "react-icons/fa";
import api from "../api/axios";

const Likedata = () => {
  const [data, setLikedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await api.get(
          "api/getlike",
        );

        console.log("Liked blogs:", res.data);
        setLikedBlogs(res.data.likeblogs || []);
      } catch (error) {
        console.log(
          "Error:",
          error.response?.data || error.message
        );

        setMessage("❌ Failed to load liked blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-hidden">
        
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              ❤️ Liked Blogs
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all your liked blog posts
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-[40vh]">
            <p className="text-lg font-semibold text-gray-600 animate-pulse">
              Loading liked blogs...
            </p>
          </div>
        )}

        {/* Error */}
        {message && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mb-5">
            {message}
          </div>
        )}

        {/* Empty */}
        {!loading && data.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No liked blogs found
            </h2>

            <p className="text-gray-500">
              Like some blogs to see them here.
            </p>
          </div>
        )}

        {/* Blog Cards */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="overflow-hidden">
                  <img
                    src={`http://localhost:4000/uploads/${item.image}`}
                    alt={item.title}
                    className="w-full h-56 object-cover hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  
                  {/* Category */}
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {item.category?.name || "General"}
                  </span>

                  {/* Title */}
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {item.title}
                  </h1>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-6 line-clamp-3 mb-5">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-2 text-pink-500 font-semibold">
                      <FaHeart />
                      <span>
                        {item.countlike || 0} Likes
                      </span>
                    </div>

                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Likedata;