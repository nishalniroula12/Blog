import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBlog,
  FaLayerGroup,
  FaSignOutAlt,
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // DESKTOP SIDEBAR OPEN/CLOSE
  // ==========================================

  const [open, setOpen] = useState(true);

  // ==========================================
  // MOBILE SIDEBAR OPEN/CLOSE
  // ==========================================

  const [mobileOpen, setMobileOpen] = useState(false);

  // ==========================================
  // DROPDOWNS
  // ==========================================

  const [blogDropdown, setBlogDropdown] =
    useState(false);

  const [categoryDropdown, setCategoryDropdown] =
    useState(false);


  // ==========================================
  // CLOSE MOBILE SIDEBAR WHEN PAGE CHANGES
  // ==========================================

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);


  // ==========================================
  // AUTO OPEN DROPDOWN BASED ON CURRENT PAGE
  // ==========================================

  useEffect(() => {

    if (
      location.pathname === "/allblog" ||
      location.pathname === "/adminblog" ||
      location.pathname.startsWith("/adminblog/") ||
      location.pathname === "/likedata"
    ) {
      setBlogDropdown(true);
    }

    if (
      location.pathname === "/allcategory" ||
      location.pathname === "/addcategory"
    ) {
      setCategoryDropdown(true);
    }

  }, [location.pathname]);


  // ==========================================
  // PREVENT BACKGROUND SCROLL
  // WHEN MOBILE SIDEBAR IS OPEN
  // ==========================================

  useEffect(() => {

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [mobileOpen]);


  // ==========================================
  // NAVIGATION
  // ==========================================

  const goTo = (path) => {

    navigate(path);

    // Close mobile sidebar
    setMobileOpen(false);

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const signout = async () => {

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
        "Logout error:",
        error
      );

    } finally {

      localStorage.removeItem("tokens");

      localStorage.removeItem("loggedin");

      localStorage.removeItem("user");

      setMobileOpen(false);

      navigate(
        "/login",
        {
          replace: true,
        }
      );

    }

  };


  return (
    <>
      {/* =====================================================
          MOBILE NAVBAR
          THIS IS ONLY FOR MOBILE
          HEIGHT = 64PX
      ====================================================== */}

      <div
        className="
          fixed
          top-0
          left-0
          right-0
          h-16
          z-[100]

          bg-slate-900
          text-white

          flex
          items-center
          justify-between

          px-4

          shadow-md

          md:hidden
        "
      >

        {/* MOBILE LOGO */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >

          <div
            className="
              w-9
              h-9

              rounded-lg

              bg-blue-600

              flex
              items-center
              justify-center

              font-bold
              text-sm
            "
          >
            AD
          </div>

          <span
            className="
              font-semibold
              text-base
            "
          >
            Admin Panel
          </span>

        </div>


        {/* MOBILE THREE DOT MENU */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Open menu"
          className="
            w-10
            h-10

            rounded-lg

            bg-slate-800
            hover:bg-slate-700

            flex
            items-center
            justify-center

            transition
          "
        >

          <div
            className="
              flex
              flex-col
              gap-1
            "
          >

            <span
              className="
                w-1.5
                h-1.5
                bg-white
                rounded-full
              "
            />

            <span
              className="
                w-1.5
                h-1.5
                bg-white
                rounded-full
              "
            />

            <span
              className="
                w-1.5
                h-1.5
                bg-white
                rounded-full
              "
            />

          </div>

        </button>

      </div>


      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed
            inset-0

            z-[110]

            bg-black/50

            md:hidden
          "
        />

      )}


      {/* =====================================================
          SIDEBAR
          
          IMPORTANT:
          top-16 = 64PX BELOW NAVBAR
          
          h-[calc(100vh-4rem)]
          = FULL SCREEN MINUS 64PX
      ====================================================== */}

      <aside
        className={`
          fixed

          top-16
          left-0

          h-[calc(100vh-4rem)]

          z-[120]

          bg-gradient-to-b
          from-slate-900
          to-slate-800

          text-white

          shadow-2xl

          flex
          flex-col

          w-[280px]

          transition-all
          duration-300
          ease-in-out

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0

          ${
            open
              ? "md:w-72"
              : "md:w-20"
          }
        `}
      >

        {/* =====================================================
            SIDEBAR HEADER
        ====================================================== */}

        <div
          className="
            h-20
            shrink-0

            px-5

            flex
            items-center
            justify-between

            border-b
            border-slate-700
          "
        >

          {/* TITLE */}

          {open && (

            <div>

              <h1
                className="
                  text-xl
                  font-bold
                  tracking-wide
                "
              >
                Admin Panel
              </h1>

              <p
                className="
                  text-xs
                  text-slate-400
                  mt-1
                "
              >
                Dashboard System
              </p>

            </div>

          )}


          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() =>
              setMobileOpen(false)
            }
            className="
              md:hidden

              w-10
              h-10

              rounded-lg

              bg-slate-800
              hover:bg-slate-700

              flex
              items-center
              justify-center
            "
          >
            <FaTimes />
          </button>


          {/* DESKTOP COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setOpen(!open)
            }
            className="
              hidden
              md:flex

              w-10
              h-10

              rounded-lg

              bg-slate-700
              hover:bg-slate-600

              items-center
              justify-center
            "
          >

            {open ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}

          </button>

        </div>


        {/* =====================================================
            MENU
        ====================================================== */}

        <nav
          className="
            flex-1

            overflow-y-auto
            overflow-x-hidden

            p-4

            space-y-3
          "
        >

          {/* ==================================================
              DASHBOARD
          =================================================== */}

          <button
            type="button"
            onClick={() =>
              goTo("/admindashboard")
            }
            className={`
              w-full

              flex
              items-center
              gap-3

              px-4
              py-3

              rounded-xl

              transition

              ${
                location.pathname ===
                "/admindashboard"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }
            `}
          >

            <FaHome
              className="
                text-lg
                shrink-0
              "
            />

            {open && (

              <span
                className="
                  font-medium
                  whitespace-nowrap
                "
              >
                Dashboard
              </span>

            )}

          </button>


          {/* ==================================================
              BLOGS
          =================================================== */}

          <div>

            <button
              type="button"
              onClick={() => {

                if (!open) {
                  setOpen(true);
                }

                setBlogDropdown(
                  !blogDropdown
                );

              }}
              className="
                w-full

                flex
                items-center
                justify-between

                px-4
                py-3

                rounded-xl

                text-slate-300

                hover:bg-slate-700
                hover:text-white

                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <FaBlog
                  className="
                    text-lg
                    shrink-0
                  "
                />

                {open && (

                  <span
                    className="
                      font-medium
                      whitespace-nowrap
                    "
                  >
                    Blogs
                  </span>

                )}

              </div>


              {open && (

                blogDropdown ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )

              )}

            </button>


            {/* BLOG MENU */}

            {blogDropdown &&
              open && (

                <div
                  className="
                    ml-6
                    mt-2
                    pl-3

                    border-l
                    border-slate-700

                    space-y-1
                  "
                >

                  {/* ALL BLOG */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/allblog")
                    }
                    className={`
                      w-full

                      text-left

                      px-4
                      py-2.5

                      rounded-lg

                      text-sm

                      transition

                      ${
                        location.pathname ===
                        "/allblog"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }
                    `}
                  >
                    All Blogs
                  </button>


                  {/* ADD BLOG */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/adminblog")
                    }
                    className="
                      w-full
                      text-left

                      px-4
                      py-2.5

                      rounded-lg

                      text-sm

                      text-slate-300

                      hover:bg-slate-700
                      hover:text-white

                      transition
                    "
                  >
                    Add Blog
                  </button>


                  {/* ALL LIKES */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/likedata")
                    }
                    className="
                      w-full
                      text-left

                      px-4
                      py-2.5

                      rounded-lg

                      text-sm

                      text-slate-300

                      hover:bg-slate-700
                      hover:text-white

                      transition
                    "
                  >
                    All Likes
                  </button>

                </div>

              )}

          </div>


          {/* ==================================================
              CATEGORIES
          =================================================== */}

          <div>

            <button
              type="button"
              onClick={() => {

                if (!open) {
                  setOpen(true);
                }

                setCategoryDropdown(
                  !categoryDropdown
                );

              }}
              className="
                w-full

                flex
                items-center
                justify-between

                px-4
                py-3

                rounded-xl

                text-slate-300

                hover:bg-slate-700
                hover:text-white

                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <FaLayerGroup
                  className="
                    text-lg
                    shrink-0
                  "
                />

                {open && (

                  <span
                    className="
                      font-medium
                      whitespace-nowrap
                    "
                  >
                    Categories
                  </span>

                )}

              </div>


              {open && (

                categoryDropdown ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                )

              )}

            </button>


            {/* CATEGORY MENU */}

            {categoryDropdown &&
              open && (

                <div
                  className="
                    ml-6
                    mt-2
                    pl-3

                    border-l
                    border-slate-700

                    space-y-1
                  "
                >

                  {/* ADD CATEGORY */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/addcategory")
                    }
                    className="
                      w-full
                      text-left

                      px-4
                      py-2.5

                      rounded-lg

                      text-sm

                      text-slate-300

                      hover:bg-slate-700
                      hover:text-white

                      transition
                    "
                  >
                    Add Category
                  </button>


                  {/* ALL CATEGORY */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo("/allcategory")
                    }
                    className="
                      w-full
                      text-left

                      px-4
                      py-2.5

                      rounded-lg

                      text-sm

                      text-slate-300

                      hover:bg-slate-700
                      hover:text-white

                      transition
                    "
                  >
                    All Categories
                  </button>

                </div>

              )}

          </div>

        </nav>


        {/* =====================================================
            SIGN OUT
        ====================================================== */}

        <div
          className="
            shrink-0

            p-4

            border-t
            border-slate-700
          "
        >

          <button
            type="button"
            onClick={signout}
            className="
              w-full

              flex
              items-center
              justify-center
              gap-3

              py-3

              rounded-xl

              bg-red-500/10

              text-red-400

              hover:bg-red-500
              hover:text-white

              transition
            "
          >

            <FaSignOutAlt />

            {open && (

              <span
                className="
                  font-medium
                "
              >
                Sign Out
              </span>

            )}

          </button>

        </div>

      </aside>

    </>
  );
};

export default Sidebar;