import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

import api from "../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar
  const [open, setOpen] = useState(true);

  // Mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dropdowns
  const [blogDropdown, setBlogDropdown] =
    useState(false);

  const [categoryDropdown, setCategoryDropdown] =
    useState(false);

  // =====================================
  // CLOSE MOBILE SIDEBAR AFTER NAVIGATION
  // =====================================

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // =====================================
  // OPEN DROPDOWN BASED ON CURRENT PAGE
  // =====================================

  useEffect(() => {
    if (
      location.pathname === "/allblog" ||
      location.pathname === "/adminblog" ||
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

  // =====================================
  // PREVENT BODY SCROLL ON MOBILE
  // =====================================

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

  // =====================================
  // LOGOUT
  // =====================================

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

      navigate("/login");
    }
  };

  // =====================================
  // CLOSE MOBILE
  // =====================================

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>

      {/* ==================================
          MOBILE TOP BAR
      ================================== */}

      <div
        className="
          fixed
          top-0
          left-0
          right-0
          z-40
          h-16
          bg-slate-900
          text-white
          flex
          items-center
          justify-between
          px-4
          shadow-lg
          md:hidden
        "
      >

        <div>
          <h1 className="font-bold text-lg">
            Admin Panel
          </h1>

          <p className="text-xs text-slate-400">
            Dashboard System
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          className="
            w-10
            h-10
            rounded-lg
            bg-slate-800
            flex
            items-center
            justify-center
          "
        >
          <FaBars />
        </button>

      </div>


      {/* ==================================
          MOBILE BACKDROP
      ================================== */}

      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
        />
      )}


      {/* ==================================
          SIDEBAR
      ================================== */}

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

          transition-transform
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

        {/* ==================================
            SIDEBAR HEADER
        ================================== */}

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

          {open && (
            <div>
              <h1 className="text-xl font-bold">
                Admin Panel
              </h1>

              <p className="text-xs text-slate-400 mt-1">
                Dashboard System
              </p>
            </div>
          )}


          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={closeMobile}
            className="
              md:hidden
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-lg
              bg-slate-800
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
              items-center
              justify-center
              rounded-lg
              bg-slate-700
              hover:bg-slate-600
            "
          >
            {open ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>


        {/* ==================================
            MENU
        ================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            p-4
            space-y-3
          "
        >

          {/* DASHBOARD */}

          <button
            type="button"
            onClick={() => {
              navigate("/admindashboard");
              closeMobile();
            }}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-slate-300
              hover:bg-slate-700
              hover:text-white
              transition
            "
          >

            <FaHome />

            {open && (
              <span>
                Dashboard
              </span>
            )}

          </button>


          {/* BLOG DROPDOWN */}

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
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <FaBlog />

                {open && (
                  <span>
                    Blogs
                  </span>
                )}

              </div>

              {open &&
                (blogDropdown ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                ))}

            </button>


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

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/allblog");
                      closeMobile();
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2.5
                      rounded-lg
                      text-sm
                      text-slate-300
                      hover:bg-slate-700
                    "
                  >
                    All Blogs
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      navigate("/adminblog");
                      closeMobile();
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2.5
                      rounded-lg
                      text-sm
                      text-slate-300
                      hover:bg-slate-700
                    "
                  >
                    Add Blog
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      navigate("/likedata");
                      closeMobile();
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2.5
                      rounded-lg
                      text-sm
                      text-slate-300
                      hover:bg-slate-700
                    "
                  >
                    All Likes
                  </button>

                </div>

              )}

          </div>


          {/* CATEGORY DROPDOWN */}

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
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <FaLayerGroup />

                {open && (
                  <span>
                    Categories
                  </span>
                )}

              </div>

              {open &&
                (categoryDropdown ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                ))}

            </button>


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

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/addcategory");
                      closeMobile();
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2.5
                      rounded-lg
                      text-sm
                      text-slate-300
                      hover:bg-slate-700
                    "
                  >
                    Add Category
                  </button>


                  <button
                    type="button"
                    onClick={() => {
                      navigate("/allcategory");
                      closeMobile();
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-2.5
                      rounded-lg
                      text-sm
                      text-slate-300
                      hover:bg-slate-700
                    "
                  >
                    All Categories
                  </button>

                </div>

              )}

          </div>

        </nav>


        {/* ==================================
            LOGOUT
        ================================== */}

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
              <span>
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