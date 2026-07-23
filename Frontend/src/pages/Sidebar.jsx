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
  // DESKTOP SIDEBAR STATE
  // ==========================================

  const [open, setOpen] = useState(true);

  // ==========================================
  // MOBILE SIDEBAR STATE
  // ==========================================

  const [mobileOpen, setMobileOpen] =
    useState(false);

  // ==========================================
  // DROPDOWN STATES
  // ==========================================

  const [blogDropdown, setBlogDropdown] =
    useState(false);

  const [categoryDropdown, setCategoryDropdown] =
    useState(false);


  // ==========================================
  // CLOSE MOBILE SIDEBAR WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);


  // ==========================================
  // OPEN DROPDOWN BASED ON CURRENT ROUTE
  // ==========================================

  useEffect(() => {

    if (
      location.pathname === "/allblog" ||
      location.pathname === "/adminblog" ||
      location.pathname.startsWith(
        "/adminblog/"
      ) ||
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
  // PREVENT BODY SCROLL WHEN MOBILE SIDEBAR OPEN
  // ==========================================

  useEffect(() => {

    if (mobileOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [mobileOpen]);


  // ==========================================
  // SIGN OUT
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
  // CLOSE MOBILE SIDEBAR
  // ==========================================

  const closeMobile = () => {
    setMobileOpen(false);
  };


  // ==========================================
  // NAVIGATION FUNCTION
  // ==========================================

  const goTo = (path) => {

    navigate(path);

    setMobileOpen(false);

  };


  return (
    <>
      {/* =====================================================
          MOBILE TOP BAR
          ONLY SHOWS ON MOBILE
      ====================================================== */}

      <div
        className="
          fixed
          top-0
          left-0
          right-0
          z-40
          h-14
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

        {/* MOBILE ADMIN LOGO */}

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
              shadow
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


        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() =>
            setMobileOpen(true)
          }
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

          {/* THREE DOTS */}

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
          CLICK OUTSIDE SIDEBAR TO CLOSE
      ====================================================== */}

      {mobileOpen && (

        <div
          onClick={closeMobile}
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-[2px]
            md:hidden
          "
        />

      )}


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen

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

          {/* ADMIN TEXT */}

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


          {/* ================================================
              MOBILE CLOSE BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeMobile}
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
              transition
            "
          >
            <FaTimes />
          </button>


          {/* ================================================
              DESKTOP COLLAPSE BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label="Toggle sidebar"
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
              transition
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
            SIDEBAR MENU
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
              goTo(
                "/admindashboard"
              )
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
              duration-200

              ${
                location.pathname ===
                "/admindashboard"
                  ? "bg-blue-600 text-white shadow-md"
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
              BLOG DROPDOWN
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
                  <FaChevronUp
                    className="text-sm"
                  />
                ) : (
                  <FaChevronDown
                    className="text-sm"
                  />
                )

              )}

            </button>


            {/* BLOG SUBMENU */}

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

                  {/* ALL BLOGS */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/allblog"
                      )
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
                      goTo(
                        "/adminblog"
                      )
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
                        "/adminblog"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }
                    `}
                  >
                    Add Blog
                  </button>


                  {/* ALL LIKES */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/likedata"
                      )
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
                        "/likedata"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }
                    `}
                  >
                    All Likes
                  </button>

                </div>

              )}

          </div>


          {/* ==================================================
              CATEGORY DROPDOWN
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
                  <FaChevronUp
                    className="text-sm"
                  />
                ) : (
                  <FaChevronDown
                    className="text-sm"
                  />
                )

              )}

            </button>


            {/* CATEGORY SUBMENU */}

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
                      goTo(
                        "/addcategory"
                      )
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
                        "/addcategory"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }
                    `}
                  >
                    Add Category
                  </button>


                  {/* ALL CATEGORY */}

                  <button
                    type="button"
                    onClick={() =>
                      goTo(
                        "/allcategory"
                      )
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
                        "/allcategory"
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }
                    `}
                  >
                    All Categories
                  </button>

                </div>

              )}

          </div>

        </nav>


        {/* =====================================================
            BOTTOM SIGN OUT
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
              duration-200
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