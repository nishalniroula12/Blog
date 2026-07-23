import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import {
  FaUserCircle,
  FaSearch,
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import Sidebar from "./Sidebar";
import api from "../api/axios";

function Admindashboard() {
  const navigate = useNavigate();

  // ==================================================
  // STATES
  // ==================================================

  const [blog, setBlog] = useState(0);

  const [category, setCategory] = useState(0);

  const [like, setLike] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [searchFocused, setSearchFocused] =
    useState(false);

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const [loading, setLoading] = useState(true);


  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = async () => {
    try {
      // Call backend logout API
      await api.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
        }
      );

    } catch (error) {
      console.log(
        "Logout API Error:",
        error.response?.data ||
          error.message
      );

    } finally {
      // Remove local authentication data
      localStorage.removeItem("tokens");

      localStorage.removeItem("loggedin");

      localStorage.removeItem("user");

      // Close dropdown
      setIsDropdownOpen(false);

      // Redirect to login
      navigate("/login", {
        replace: true,
      });
    }
  };


  // ==================================================
  // FETCH BLOGS AND CATEGORIES
  // ==================================================

  const blogfetch = async () => {
    try {
      setLoading(true);

      // Fetch blogs and categories at same time
      const [
        blogResponse,
        categoryResponse,
      ] = await Promise.all([
        api.get(
          "/api/getblog",
          {
            withCredentials: true,
          }
        ),

        api.get(
          "/api/getdata",
          {
            withCredentials: true,
          }
        ),
      ]);


      // Blog count
      setBlog(
        blogResponse.data?.blog?.length || 0
      );


      // Category count
      setCategory(
        categoryResponse.data
          ?.category?.length || 0
      );

    } catch (error) {
      console.log(
        "Dashboard Fetch Error:",
        error.response?.data ||
          error.message
      );

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // FETCH LIKES
  // ==================================================

  const fetchLike = async () => {
    try {
      const res = await api.get(
        "/api/getlike",
        {
          withCredentials: true,
        }
      );

      setLike(
        res.data?.likeblogs?.length || 0
      );

    } catch (error) {
      console.log(
        "Like Fetch Error:",
        error.response?.data ||
          error.message
      );
    }
  };


  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearch = () => {
    const value =
      searchQuery.trim();

    if (!value) {
      navigate("/allblog");
      return;
    }

    navigate(
      `/allblog?search=${encodeURIComponent(
        value
      )}`
    );
  };


  // ==================================================
  // SEARCH ENTER KEY
  // ==================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  // ==================================================
  // FETCH DATA ON PAGE LOAD
  // ==================================================

  useEffect(() => {
    blogfetch();

    fetchLike();
  }, []);


  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        font-[Sora,sans-serif]
      "
    >

      {/* ==================================================
          RIGHT SIDE SIDEBAR

          Sidebar has:
          - Top right menu button
          - Right drawer
          - Dashboard links
          - Blog links
          - Category links
          - Logout
      =================================================== */}

      <Sidebar />


      {/* ==================================================
          MAIN CONTENT
      =================================================== */}

      <div
        className="
          min-h-screen
          w-full
          overflow-x-hidden
        "
      >

        {/* ==================================================
            NAVBAR
        =================================================== */}

        <header
          className="
            sticky
            top-0

            z-40

            h-16

            bg-white

            border-b
            border-slate-200

            px-4
            sm:px-6
            lg:px-8

            flex
            items-center
            justify-between

            shadow-sm
          "
        >

          {/* LEFT SIDE */}

          <div>
            <h2
              className="
                text-lg
                sm:text-xl

                font-bold

                text-slate-800
              "
            >
              Admin Dashboard
            </h2>

            <p
              className="
                hidden
                sm:block

                text-xs

                text-slate-400
              "
            >
              Manage your blog system
            </p>
          </div>


          {/* RIGHT SIDE */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* NOTIFICATION */}

            <button
              type="button"
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

                transition
              "
            >
              <FaBell />

              <span
                className="
                  absolute

                  top-1.5
                  right-1.5

                  w-2
                  h-2

                  bg-red-500

                  rounded-full

                  border-2
                  border-white
                "
              />
            </button>


            {/* SETTINGS */}

            <button
              type="button"
              className="
                hidden
                sm:flex

                w-9
                h-9

                items-center
                justify-center

                rounded-lg

                text-slate-500

                hover:bg-slate-100

                transition
              "
            >
              <FaCog />
            </button>


            {/* DIVIDER */}

            <div
              className="
                w-px
                h-7

                bg-slate-200

                mx-1
              "
            />


            {/* PROFILE */}

            <div
              className="
                relative
              "
            >

              <button
                type="button"
                onClick={() =>
                  setIsDropdownOpen(
                    !isDropdownOpen
                  )
                }
                className="
                  flex
                  items-center
                  gap-2

                  p-1

                  rounded-xl

                  hover:bg-slate-100

                  transition
                "
              >

                {/* PROFILE ICON */}

                <div
                  className="
                    w-9
                    h-9

                    rounded-xl

                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-600

                    flex
                    items-center
                    justify-center

                    shadow-sm
                  "
                >

                  <span
                    className="
                      text-white
                      text-xs
                      font-bold
                    "
                  >
                    AD
                  </span>

                </div>


                {/* PROFILE TEXT */}

                <div
                  className="
                    hidden
                    md:block

                    text-left
                  "
                >

                  <p
                    className="
                      text-xs

                      font-semibold

                      text-slate-700
                    "
                  >
                    Admin
                  </p>

                  <p
                    className="
                      text-[10px]

                      text-slate-400
                    "
                  >
                    Super Admin
                  </p>

                </div>

              </button>


              {/* ==================================================
                  PROFILE DROPDOWN
              =================================================== */}

              {isDropdownOpen && (
                <>

                  {/* BACKDROP */}

                  <div
                    className="
                      fixed
                      inset-0

                      z-40
                    "
                    onClick={() =>
                      setIsDropdownOpen(
                        false
                      )
                    }
                  />


                  {/* DROPDOWN */}

                  <div
                    className="
                      absolute

                      right-0

                      mt-2

                      w-56

                      bg-white

                      rounded-xl

                      shadow-xl

                      border
                      border-slate-100

                      overflow-hidden

                      z-50
                    "
                  >

                    {/* USER INFO */}

                    <div
                      className="
                        px-4
                        py-4

                        bg-slate-50

                        border-b
                        border-slate-100
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-10
                            h-10

                            rounded-xl

                            bg-indigo-600

                            flex
                            items-center
                            justify-center
                          "
                        >

                          <FaUserCircle
                            className="
                              text-white
                              text-xl
                            "
                          />

                        </div>


                        <div>

                          <p
                            className="
                              text-sm

                              font-semibold

                              text-slate-700
                            "
                          >
                            Admin User
                          </p>

                          <p
                            className="
                              text-xs

                              text-slate-400
                            "
                          >
                            Super Administrator
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* VIEW PROFILE */}

                    <button
                      type="button"
                      onClick={() =>
                        setIsDropdownOpen(
                          false
                        )
                      }
                      className="
                        w-full

                        flex
                        items-center
                        gap-3

                        px-4
                        py-3

                        text-sm

                        text-slate-600

                        hover:bg-slate-50

                        transition
                      "
                    >

                      <FaUserCircle
                        className="
                          text-slate-400
                        "
                      />

                      View Profile

                    </button>


                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={logout}
                      className="
                        w-full

                        flex
                        items-center
                        gap-3

                        px-4
                        py-3

                        border-t
                        border-slate-100

                        text-sm

                        text-red-500

                        hover:bg-red-50

                        transition
                      "
                    >

                      <FaSignOutAlt />

                      Sign Out

                    </button>

                  </div>

                </>
              )}

            </div>

          </div>

        </header>


        {/* ==================================================
            BREADCRUMB
        =================================================== */}

        <div
          className="
            px-4
            sm:px-6
            lg:px-8

            py-3

            bg-white

            border-b
            border-slate-100

            flex
            items-center
            gap-2

            text-xs
          "
        >

          <span
            className="
              text-slate-400
            "
          >
            Dashboard
          </span>

          <span
            className="
              text-slate-300
            "
          >
            /
          </span>

          <span
            className="
              text-slate-600

              font-medium
            "
          >
            Overview
          </span>

        </div>


        {/* ==================================================
            DASHBOARD BODY
        =================================================== */}

        <main
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >

          {/* ==================================================
              TITLE
          =================================================== */}

          <div
            className="
              mb-6
            "
          >

            <h1
              className="
                text-2xl
                sm:text-3xl

                font-bold

                text-slate-800
              "
            >
              Dashboard Overview
            </h1>

            <p
              className="
                text-sm

                text-slate-500

                mt-2
              "
            >
              Manage your blogs,
              categories and likes
              from one place.
            </p>

          </div>


          {/* ==================================================
              SEARCH SECTION
          =================================================== */}

          <div
            className="
              bg-white

              rounded-2xl

              shadow-sm

              border
              border-slate-100

              p-4
              sm:p-5

              mb-8
            "
          >

            <div
              className="
                flex
                flex-col
                sm:flex-row

                gap-3
              "
            >

              {/* SEARCH INPUT */}

              <div
                className="
                  relative

                  flex-1
                "
              >

                <FaSearch
                  className={`
                    absolute

                    left-4

                    top-1/2

                    -translate-y-1/2

                    transition

                    ${
                      searchFocused
                        ? "text-indigo-500"
                        : "text-slate-400"
                    }
                  `}
                />


                <input
                  type="text"
                  placeholder="
                    Search blogs by title or category...
                  "
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  onFocus={() =>
                    setSearchFocused(
                      true
                    )
                  }
                  onBlur={() =>
                    setSearchFocused(
                      false
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  className="
                    w-full

                    pl-11
                    pr-4

                    py-3

                    rounded-xl

                    bg-slate-50

                    border
                    border-slate-200

                    text-sm

                    text-slate-700

                    placeholder-slate-400

                    focus:outline-none

                    focus:ring-2
                    focus:ring-indigo-400/40

                    focus:border-indigo-400

                    focus:bg-white

                    transition
                  "
                />

              </div>


              {/* SEARCH BUTTON */}

              <button
                type="button"
                onClick={
                  handleSearch
                }
                className="
                  px-6
                  py-3

                  rounded-xl

                  bg-indigo-600

                  hover:bg-indigo-700

                  text-white

                  font-semibold

                  flex
                  items-center
                  justify-center
                  gap-2

                  transition

                  active:scale-95
                "
              >

                <FaSearch />

                <span>
                  Search
                </span>

              </button>

            </div>

          </div>


          {/* ==================================================
              STATISTICS CARDS
          =================================================== */}

          <div
            className="
              grid

              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3

              gap-5
            "
          >

            {/* BLOG CARD */}

            <div
              className="
                bg-white

                rounded-2xl

                shadow-sm

                p-6

                border
                border-slate-100
              "
            >

              <h2
                className="
                  text-sm

                  font-semibold

                  text-slate-500
                "
              >
                Total Blogs
              </h2>


              <p
                className="
                  text-4xl

                  font-bold

                  text-indigo-600

                  mt-4
                "
              >
                {loading
                  ? "..."
                  : blog}
              </p>

            </div>


            {/* CATEGORY CARD */}

            <div
              className="
                bg-white

                rounded-2xl

                shadow-sm

                p-6

                border
                border-slate-100
              "
            >

              <h2
                className="
                  text-sm

                  font-semibold

                  text-slate-500
                "
              >
                Total Categories
              </h2>


              <p
                className="
                  text-4xl

                  font-bold

                  text-violet-600

                  mt-4
                "
              >
                {loading
                  ? "..."
                  : category}
              </p>

            </div>


            {/* LIKE CARD */}

            <div
              className="
                bg-white

                rounded-2xl

                shadow-sm

                p-6

                border
                border-slate-100
              "
            >

              <h2
                className="
                  text-sm

                  font-semibold

                  text-slate-500
                "
              >
                Total Liked
              </h2>


              <p
                className="
                  text-4xl

                  font-bold

                  text-pink-600

                  mt-4
                "
              >
                {loading
                  ? "..."
                  : like}
              </p>

            </div>

          </div>


          {/* ==================================================
              ACTION BUTTONS
          =================================================== */}

          <div
            className="
              flex
              flex-wrap

              gap-4

              mt-8
            "
          >

            {/* ADD BLOG */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/adminblog"
                )
              }
              className="
                px-6
                py-3

                bg-blue-600

                hover:bg-blue-700

                text-white

                font-semibold

                rounded-xl

                shadow-md

                transition

                active:scale-95
              "
            >
              + Add Blog
            </button>


            {/* ADD CATEGORY */}

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/addcategory"
                )
              }
              className="
                px-6
                py-3

                bg-purple-600

                hover:bg-purple-700

                text-white

                font-semibold

                rounded-xl

                shadow-md

                transition

                active:scale-95
              "
            >
              + Add Category
            </button>

          </div>

        </main>


        {/* ==================================================
            CHILD ROUTES
        =================================================== */}

        <div
          className="
            px-4
            sm:px-6
            lg:px-8

            pb-8
          "
        >
          <Outlet />
        </div>

      </div>

    </div>
  );
}

export default Admindashboard;