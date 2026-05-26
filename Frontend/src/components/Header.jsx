import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutUser } from "../Redux/Slice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch =useDispatch()

const isAuthenticate = useSelector((item)=>item.data.isAuthenticate)
console.log(isAuthenticate)
const user = useSelector((item)=>item.data.user)
console.log(user)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  

  const handleLogout = async() => {
    try {
      const res= await axios.post("http://localhost:4000/api/logout",)
    console.log(res)
dispatch(logoutUser())
navigate("/login");

      
    } catch (error) {
      console.log(error)
    }
    
 



  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ================= LOGO ================= */}

        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR63-MFsRn0_jWL46D70ITZomtbQGr3Au9Stw&s"
            alt="logo"
            className="w-12 h-12 rounded-full"
          />

          <h1 className="text-2xl font-bold text-blue-600">
            Blogify
          </h1>
        </div>

        {/* ================= DESKTOP MENU ================= */}

        <nav className="hidden lg:flex items-center gap-6 text-lg font-medium">

          {/* ALWAYS */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-bold"
                : "hover:text-blue-600"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 font-bold"
                : "hover:text-blue-600"
            }
          >
            Blog
          </NavLink>

          {/* ================= BEFORE LOGIN ================= */}

          {!isAuthenticate ? (
            <>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold"
                    : "hover:text-blue-600"
                }
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-bold"
                    : "hover:text-blue-600"
                }
              >
                Contact
              </NavLink>

              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 border border-cyan-500 text-cyan-600 rounded-full hover:bg-cyan-50 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:opacity-90 transition"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              {/* ================= AFTER LOGIN ================= */}

              <NavLink
                to="/like"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 text-blue-600 font-bold"
                    : "flex items-center gap-2 hover:text-blue-600"
                }
              >
                <FaHeart />
                Like
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* ================= MOBILE BUTTON ================= */}

        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <FaTimes size={24} />
          ) : (
            <FaBars size={24} />
          )}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t p-4 space-y-4">

          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-blue-600"
          >
            Home
          </NavLink>

          <NavLink
            to="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-blue-600"
          >
            Blog
          </NavLink>

          {/* BEFORE LOGIN */}
          {!isAuthenticate ? (
            <>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-600"
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-600"
              >
                Contact
              </NavLink>

              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 border border-cyan-500 text-cyan-600 rounded"
              >
                Login
              </button>

              <button
                onClick={() => {
                  navigate("/signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-blue-500 text-white rounded"
              >
                Signup
              </button>
            </>
          ) : (
            <>
              {/* AFTER LOGIN */}
              <NavLink
                to="/like"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-600"
              >
                ❤️ Like
              </NavLink>

              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;