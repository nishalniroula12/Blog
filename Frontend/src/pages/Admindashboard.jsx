import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import { FaUserCircle, FaSearch, FaBell, FaCog } from "react-icons/fa";

import Sidebar from "./Sidebar";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Redux/Slice";
import api from "../api/axios";

function Admindashboard() {
  const navigate = useNavigate();

  // STATES
  const [blog, setBlog] = useState(0);
  const [category, setCategory] = useState(0);
  const [like, setlike] = useState(0);
  const nav = useNavigate();
  const dispatch = useDispatch()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchFocused, setSearchFocused] = useState(false);

  // DROPDOWN
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // SEARCH
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post(
        "api/logout",
        {},
        
      );

      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");
     

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  // FETCH DATA
  const blogfetch = async () => {
    try {
      // BLOG FETCH
      const res = await api.get("api/getblog", {
        withCredentials: true,
      });

      // CATEGORY FETCH
      const c = await api.get("api/getdata", {
        withCredentials: true,
      });

      // SET BLOG COUNT
      setBlog(res.data.blog.length || 0);

      // SET CATEGORY COUNT
      setCategory(c.data.category.length || 0);

      console.log(res.data);
      console.log(c.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const fetchlike = async () => {
    try {
      const res = await api.get("api/getlike", {
        withCredentials: true,
      });
      setlike(res.data.likeblogs.length || 0);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // USE EFFECT
  useEffect(() => {
    blogfetch();
    fetchlike();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen font-[Sora,sans-serif]">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        {/* NAVBAR */}
        <header className="bg-white border-b border-slate-100 px-8 py-0 flex items-center justify-between sticky top-0 z-40 h-16 shadow-sm">
          {/* SEARCH BAR */}
          <div
            className={`relative w-full max-w-md transition-all duration-200 ${
              searchFocused ? "max-w-xl" : ""
            }`}
          >
            <FaSearch
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-200 ${
                searchFocused ? "text-indigo-500" : "text-slate-400"
              }`}
            />

            <input
              type="text"
              placeholder="Search blog by title or category..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="
                w-full
                pl-10
                pr-4
                py-2
                rounded-lg
                bg-slate-50
                border
                border-slate-200
                text-sm
                text-slate-700
                placeholder-slate-400
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400/50
                focus:border-indigo-400
                focus:bg-white
                transition-all
                duration-200
              "
            />

            {searchQuery && (
              <span
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[10px]
                  font-semibold
                  tracking-wide
                  text-slate-400
                  bg-slate-100
                  px-1.5
                  py-0.5
                  rounded
                "
              >
                ESC
              </span>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 ml-4">
            {/* NOTIFICATION */}
            <button
              className="
                relative
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-lg
                text-slate-500
                hover:bg-slate-100
                hover:text-slate-700
                transition-all
                duration-150
              "
            >
              <FaBell className="text-base" />

              <span
                className="
                  absolute
                  top-1.5
                  right-1.5
                  w-2
                  h-2
                  bg-rose-500
                  rounded-full
                  border-2
                  border-white
                "
              />
            </button>

            {/* SETTINGS */}
            <button
              className="
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-lg
                text-slate-500
                hover:bg-slate-100
                hover:text-slate-700
                transition-all
                duration-150
              "
            >
              <FaCog className="text-base" />
            </button>

            {/* DIVIDER */}
            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="
                  flex
                  items-center
                  gap-2.5
                  pl-1
                  pr-3
                  py-1
                  rounded-lg
                  hover:bg-slate-100
                  transition-all
                  duration-150
                  group
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-600
                    flex
                    items-center
                    justify-center
                    shadow-sm
                  "
                >
                  <span className="text-white text-xs font-semibold tracking-wide">
                    AD
                  </span>
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-slate-700 leading-none">
                    Admin
                  </p>

                  <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                    Super Admin
                  </p>
                </div>
              </button>

              {/* DROPDOWN */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  <div
                    className="
                      absolute
                      right-0
                      mt-2
                      w-52
                      bg-white
                      rounded-xl
                      shadow-lg
                      border
                      border-slate-100
                      overflow-hidden
                      z-50
                    "
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <p className="text-xs font-semibold text-slate-700">
                        admin@example.com
                      </p>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Super Administrator
                      </p>
                    </div>

                    <div className="p-1">
                      <button
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2
                          rounded-lg
                          text-sm
                          text-slate-600
                          hover:bg-slate-50
                        "
                      >
                        <FaUserCircle className="text-slate-400" />
                        <span>View Profile</span>
                      </button>
                    </div>

                    <div className="p-1 border-t border-slate-100">
                      <button
                        onClick={logout}
                        className="
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2
                          rounded-lg
                          text-sm
                          text-rose-500
                          hover:bg-rose-50
                        "
                      >
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* BREADCRUMB */}
        <div
          className="
            px-8
            py-2
            bg-white
            border-b
            border-slate-100
            flex
            items-center
            gap-2
            text-xs
            text-slate-400
          "
        >
          <span>Dashboard</span>

          <span className="text-slate-600 font-medium">Overview</span>
        </div>

        {/* BODY */}
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BLOG CARD */}
            <div
              className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                border
              "
            >
              <h2 className="text-lg font-semibold text-slate-700">
                Total Blogs
              </h2>

              <p className="text-4xl font-bold text-indigo-600 mt-4">{blog}</p>
            </div>

            {/* CATEGORY CARD */}
            <div
              className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                border
              "
            >
              <h2 className="text-lg font-semibold text-slate-700">
                Total Categories
              </h2>

              <p className="text-4xl font-bold text-violet-600 mt-4">
                {category}
              </p>
            </div>
            <div
              className="
                bg-white
                rounded-2xl
                shadow-md
                p-6
                border
              "
            >
              <h2 className="text-lg font-semibold text-slate-700">
                Total Liked
              </h2>

              <p className="text-4xl font-bold text-violet-600 mt-4">{like}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <button
            onClick={() => nav("/adminblog")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:scale-105"
          >
            Add Blog
          </button>

          <button
            onClick={() => nav("/allcategory")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:scale-105"
          >
            Add Category
          </button>
        </div>
        {/* PAGE CONTENT */}
        <main className="flex-1 p-8login">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admindashboard;
