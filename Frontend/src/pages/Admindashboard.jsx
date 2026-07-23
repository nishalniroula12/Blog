import React, { useEffect, useState } from "react";
import {
  useNavigate,
  Outlet,
} from "react-router-dom";

import {
  FaUserCircle,
  FaSearch,
  FaBell,
  FaCog,
} from "react-icons/fa";

import Sidebar from "./Sidebar";

import api from "../api/axios";

function Admindashboard() {

  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [blog, setBlog] = useState(0);

  const [category, setCategory] =
    useState(0);

  const [like, setLike] =
    useState(0);

  const [
    isDropdownOpen,
    setIsDropdownOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    searchFocused,
    setSearchFocused,
  ] = useState(false);


  // ==========================================
  // PROFILE DROPDOWN
  // ==========================================

  const toggleDropdown = () => {
    setIsDropdownOpen(
      !isDropdownOpen
    );
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearchChange = (e) => {
    setSearchQuery(
      e.target.value
    );
  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = async () => {

    try {

      await api.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
        }
      );

    } catch (error) {

      console.log(
        error.response?.data ||
        error.message
      );

    } finally {

      localStorage.removeItem(
        "tokens"
      );

      localStorage.removeItem(
        "loggedin"
      );

      localStorage.removeItem(
        "user"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    }
  };


  // ==========================================
  // FETCH BLOGS + CATEGORIES
  // ==========================================

  const blogfetch = async () => {

    try {

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


      setBlog(
        blogResponse.data?.blog?.length ||
        0
      );

      setCategory(
        categoryResponse.data?.category
          ?.length ||
        0
      );

    } catch (error) {

      console.log(
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // FETCH LIKES
  // ==========================================

  const fetchLike = async () => {

    try {

      const res = await api.get(
        "/api/getlike",
        {
          withCredentials: true,
        }
      );

      setLike(
        res.data?.likeblogs?.length ||
        0
      );

    } catch (error) {

      console.log(
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // USE EFFECT
  // ==========================================

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
          RIGHT SIDEBAR
          
          THE MENU BUTTON IS INSIDE SIDEBAR.JSX
          IT WILL APPEAR IN TOP RIGHT CORNER
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
            border-slate-100

            px-4
            sm:px-6
            lg:px-8

            flex
            items-center
            justify-between

            shadow-sm
          "
        >

          {/* SEARCH */}

          <div
            className={`
              relative

              w-full

              max-w-md

              transition-all

              ${
                searchFocused
                  ? "md:max-w-xl"
                  : ""
              }
            `}
          >

            <FaSearch
              className={`
                absolute

                left-4

                top-1/2

                -translate-y-1/2

                text-sm

                ${
                  searchFocused
                    ? "text-indigo-500"
                    : "text-slate-400"
                }
              `}
            />

            <input
              type="text"
              placeholder="Search blog..."
              value={searchQuery}
              onChange={
                handleSearchChange
              }
              onFocus={() =>
                setSearchFocused(true)
              }
              onBlur={() =>
                setSearchFocused(false)
              }
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

                focus:outline-none

                focus:ring-2
                focus:ring-indigo-400/50

                focus:border-indigo-400

                focus:bg-white
              "
            />

          </div>


          {/* RIGHT NAV */}

          <div
            className="
              flex
              items-center
              gap-2
              ml-3
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

                  bg-rose-500

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
                w-9
                h-9

                hidden
                sm:flex

                items-center
                justify-center

                rounded-lg

                text-slate-500

                hover:bg-slate-100
              "
            >
              <FaCog />
            </button>


            {/* DIVIDER */}

            <div
              className="
                w-px
                h-6
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
                onClick={
                  toggleDropdown
                }
                className="
                  flex
                  items-center
                  gap-2

                  p-1

                  rounded-lg

                  hover:bg-slate-100
                "
              >

                <div
                  className="
                    w-9
                    h-9

                    rounded-lg

                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-600

                    flex
                    items-center
                    justify-center
                  "
                >

                  <span
                    className="
                      text-white
                      text-xs
                      font-semibold
                    "
                  >
                    AD
                  </span>

                </div>


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


              {/* PROFILE DROPDOWN */}

              {isDropdownOpen && (

                <>

                  <div
                    className="
                      fixed
                      inset-0
                      z-40
                    "
                    onClick={() =>
                      setIsDropdownOpen(false)
                    }
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

                    <div
                      className="
                        px-4
                        py-3

                        border-b
                        border-slate-100

                        bg-slate-50
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-700
                        "
                      >
                        admin@example.com
                      </p>

                      <p
                        className="
                          text-[10px]
                          text-slate-400
                        "
                      >
                        Super Administrator
                      </p>

                    </div>


                    <button
                      type="button"
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
                      "
                    >

                      <FaUserCircle />

                      View Profile

                    </button>


                    <button
                      type="button"
                      onClick={logout}
                      className="
                        w-full

                        flex
                        items-center

                        px-4
                        py-3

                        border-t
                        border-slate-100

                        text-sm
                        text-rose-500

                        hover:bg-rose-50
                      "
                    >

                      <FaSignOutAlt
                        className="mr-3"
                      />

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
            text-slate-400
          "
        >

          <span>
            Dashboard
          </span>

          <span>
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

        <div
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-bold

              text-slate-800

              mb-6
            "
          >
            Dashboard Overview
          </h1>


          {/* CARDS */}

          <div
            className="
              grid

              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3

              gap-5
            "
          >

            {/* BLOG */}

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
                {blog}
              </p>

            </div>


            {/* CATEGORY */}

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
                {category}
              </p>

            </div>


            {/* LIKES */}

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
                {like}
              </p>

            </div>

          </div>


          {/* BUTTONS */}

          <div
            className="
              flex
              flex-wrap

              gap-4

              mt-8
            "
          >

            <button
              type="button"
              onClick={() =>
                navigate("/adminblog")
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
              "
            >
              Add Blog
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/allcategory")
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
              "
            >
              Add Category
            </button>

          </div>

        </div>


        {/* ==================================================
            OUTLET
        =================================================== */}

        <main
          className="
            px-4
            sm:px-6
            lg:px-8
            pb-8
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Admindashboard;