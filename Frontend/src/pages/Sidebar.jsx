import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBlog,
  FaLayerGroup,
} from "react-icons/fa";
import axios from "axios";
import api from "../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  const [blogDropdown, setBlogDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const signout = async () => {
    try {
     const res= await api.post("api/logout",);

      localStorage.removeItem("tokens")
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");
     
      console.log(res)
      navigate("/login")

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`
          bg-gradient-to-b from-slate-900 to-slate-800
          text-white
          shadow-2xl
          h-screen
          fixed
          top-0
          left-0
          transition-all
          duration-300
          z-50
          overflow-y-auto
          ${open ? "w-72" : "w-20"}
        `}
      >
        {/* Top */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          {open && (
            <div>
              <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>

              <p className="text-slate-400 text-sm mt-1">Dashboard System</p>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="
              text-white
              text-lg
              bg-slate-700
              hover:bg-slate-600
              p-2
              rounded-lg
              transition
            "
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col p-4 gap-3">
          {/* Dashboard */}
          <button
            onClick={() => navigate("/admindashboard")}
            className="
              flex items-center gap-3
              px-4 py-3
              rounded-xl
              hover:bg-slate-700
              transition
              duration-200
              group
            "
          >
            <FaHome className="text-lg" />

            {open && <span className="font-medium">Dashboard</span>}
          </button>

          {/* Blog Dropdown */}
          <div>
            <button
              onClick={() => setBlogDropdown(!blogDropdown)}
              className="
                w-full
                flex
                items-center
                justify-between
                px-4 py-3
                rounded-xl
                hover:bg-slate-700
                transition
                duration-200
              "
            >
              <div className="flex items-center gap-3">
                <FaBlog className="text-lg" />

                {open && <span className="font-medium">Blogs</span>}
              </div>

              {open && (
                <>
                  {blogDropdown ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </>
              )}
            </button>

            {blogDropdown && open && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/allblog")}
                  className="
                    text-left
                    px-4 py-2
                    rounded-lg
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    transition
                  "
                >
                  All Blogs
                </button>

                <button
                  onClick={() => navigate("/adminblog")}
                  className="
                    text-left
                    px-4 py-2
                    rounded-lg
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    transition
                  "
                >
                  Add Blog
                </button>
                <button
                  onClick={() => navigate("/likedata")}
                  className="
                    text-left
                    px-4 py-2
                    rounded-lg
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    transition
                  "
                >
                  All Like
                </button>
              
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <button
              onClick={() => setCategoryDropdown(!categoryDropdown)}
              className="
                w-full
                flex
                items-center
                justify-between
                px-4 py-3
                rounded-xl
                hover:bg-slate-700
                transition
                duration-200
              "
            >
              <div className="flex items-center gap-3">
                <FaLayerGroup className="text-lg" />

                {open && <span className="font-medium">Categories</span>}
              </div>

              {open && (
                <>
                  {categoryDropdown ? (
                    <FaChevronUp className="text-sm" />
                  ) : (
                    <FaChevronDown className="text-sm" />
                  )}
                </>
              )}
            </button>

            {categoryDropdown && open && (
              <div className="ml-8 mt-2 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/allcategory")}
                  className="
                    text-left
                    px-4 py-2
                    rounded-lg
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    transition
                  "
                >
                  Add Categories
                </button>

                <button
                  onClick={() => navigate("/addcategory")}
                  className="
                    text-left
                    px-4 py-2
                    rounded-lg
                    text-slate-300
                    hover:bg-slate-700
                    hover:text-white
                    transition
                  "
                >
                  All Category
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom */}
        {open && (
          <div className="absolute bottom-0 left-0 w-full p-5 border-t border-slate-700">
            <div className="bg-slate-800 rounded-xl p-4">
              <button onClick={signout} className="bg-black text-white hover:bg-red-500">Signout</button>

              <h2 className="font-semibold mt-1">Admin User</h2>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Space */}
      <div
        className={`
          transition-all
          duration-300
          w-full
          ${open ? "ml-72" : "ml-20"}
        `}
      >
        {/* Page Content */}
      </div>
    </div>
  );
};

export default Sidebar;
