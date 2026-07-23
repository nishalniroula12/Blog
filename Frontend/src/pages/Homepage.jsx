import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Homepage = () => {
  const [blog, setblog] = useState([]);
  const [data, setdata] = useState([]);

  // temporary user
  const user = null;

  const blogfetch = async () => {
    try {
      const res = await api.get("api/getblog",);
      setdata(res.data.blog);
    } catch (error) {
      console.log(error);
    }
  };

  const categoryfetch = async () => {
    try {
      const res = await api.get("api/getdata",);
      setblog(res.data.category);
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    blogfetch();
    categoryfetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO */}
      <title>Home - MyBlogSite</title>

      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-6 py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="bg-white/20 px-5 py-2 rounded-full text-sm font-semibold tracking-wide">
              ✨ Welcome To MyBlogSite
            </span>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mt-8">
              Read, Learn &
              <span className="block text-yellow-300">Share Ideas</span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-200 mt-6 leading-relaxed">
              {user
                ? "Explore premium stories and insights from amazing writers."
                : "Discover trending blogs, inspiring stories, and useful knowledge from writers around the world."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
              <Link
                to="/blog"
                className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition duration-300"
              >
                Explore Blogs
              </Link>

              {!user && (
                <Link
                  to="/signup"
                  className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition duration-300"
                >
                  Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE SECTION */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:-translate-y-2 transition duration-300">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-3">Creative Articles</h3>
            <p className="text-gray-600">
              Read engaging blogs written by passionate creators and authors.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:-translate-y-2 transition duration-300">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-3">Trending Topics</h3>
            <p className="text-gray-600">
              Stay updated with the latest technology, lifestyle, and news
              trends.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:-translate-y-2 transition duration-300">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold mb-3">Global Community</h3>
            <p className="text-gray-600">
              Connect with readers and writers from around the world.
            </p>
          </div>
        </div>
      </div>

      {/* BLOG SECTION */}
      <div className="container mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            Latest Blogs
          </h2>

          <Link
            to="/blog"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_RENDER_URL}uploads/${item.image}`}
                  alt={item.title}
                  className="w-full h-60 object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                    Blog
                  </span>

                  <span className="text-sm text-gray-500">
                    New Article
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <Link
                  to={`/blog/${item._id}`}
                  className="inline-block mt-6 text-blue-600 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CATEGORY SECTION */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              Browse Categories
            </h2>

            <p className="text-gray-600 mt-4 text-lg">
              Explore blogs by your favorite topics
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {blog.map((item) => (
              <div
                key={item._id}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold shadow-md hover:scale-105 transition duration-300 cursor-pointer"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-20 mt-10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-extrabold mb-6">
            Start Your Blogging Journey
          </h2>

          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-10">
            Share your thoughts, inspire people, and become part of our growing
            blogging community today.
          </p>

          {!user && (
            <Link
              to="/signup"
              className="bg-white text-indigo-700 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition duration-300 shadow-xl"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;