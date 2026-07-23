import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Redux/Slice";
import api from "../api/axios";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state extraction
  const isAuthenticate = useSelector(
    (state) => state.data?.isAuthenticate || state.data?.isAuthenticated
  );
  const user = useSelector((state) => state.data?.user);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await api.post(
        "api/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(logoutUser());
      setMobileMenuOpen(false);
      navigate("/login");
    }
  };

  // Helper for active NavLink styling
  const navLinkStyle = ({ isActive }) =>
    `transition-colors duration-200 text-sm font-semibold tracking-wide ${
      isActive
        ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-1"
        : "text-gray-600 hover:text-blue-600"
    }`;

  const mobileNavLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600 font-bold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => navigate("/")}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63-MFsRn0_jWL46D70ITZomtbQGr3Au9Stw&s"
              alt="Blogify Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover group-hover:scale-105 transition-transform"
            />
            <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Blogify
            </span>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink to="/" className={navLinkStyle}>
              Home
            </NavLink>
            <NavLink to="/blog" className={navLinkStyle}>
              Blog
            </NavLink>

            {isAuthenticate ? (
              <>
                <NavLink to="/like" className={navLinkStyle}>
                  <span className="flex items-center gap-1.5">
                    <FaHeart className="text-red-500 text-xs" />
                    Like
                  </span>
                </NavLink>

                {/* USER BADGE */}
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
                  <FaUserCircle className="text-base text-blue-600" />
                  <span className="max-w-[100px] truncate">{user?.name || "User"}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow transition-all duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/about" className={navLinkStyle}>
                  About
                </NavLink>
                <NavLink to="/contact" className={navLinkStyle}>
                  Contact
                </NavLink>

                <div className="flex items-center gap-3 ml-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-1.5 text-xs font-semibold text-cyan-600 border border-cyan-500 rounded-full hover:bg-cyan-50 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:opacity-95 shadow-sm hover:shadow transition"
                  >
                    Signup
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </header>

      {/* MOBILE BACKDROP & OVERLAY MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide Drawer */}
          <div className="relative ml-auto w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col pt-20 pb-6 px-5 z-50 overflow-y-auto">
            
            {/* User Profile Bar (if logged in) */}
            {isAuthenticate && (
              <div className="flex items-center gap-3 p-3 mb-4 bg-blue-50/60 rounded-xl border border-blue-100">
                <FaUserCircle className="text-3xl text-blue-600" />
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {user?.name || "User"}
                  </p>
                </div>
              </div>
            )}

            <nav className="flex-1 space-y-1">
              <NavLink to="/" className={mobileNavLinkStyle}>
                Home
              </NavLink>

              <NavLink to="/blog" className={mobileNavLinkStyle}>
                Blog
              </NavLink>

              {isAuthenticate ? (
                <NavLink to="/like" className={mobileNavLinkStyle}>
                  <FaHeart className="text-red-500" />
                  Liked Posts
                </NavLink>
              ) : (
                <>
                  <NavLink to="/about" className={mobileNavLinkStyle}>
                    About
                  </NavLink>
                  <NavLink to="/contact" className={mobileNavLinkStyle}>
                    Contact
                  </NavLink>
                </>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              {isAuthenticate ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition shadow-sm"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 border border-cyan-500 text-cyan-600 font-semibold text-sm rounded-xl hover:bg-cyan-50 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm rounded-xl hover:opacity-90 transition shadow-sm"
                  >
                    Signup
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent page content from hiding under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default Header;