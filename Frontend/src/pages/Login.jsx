
import React, { useState } from "react";
import { Formik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";

import { loginUser } from "../Redux/Slice";
import api from "../api/axios";

// ==================================================
// FORM VALIDATION
// ==================================================

const validate = (values) => {
  const errors = {};

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
  ) {
    errors.email = "Enter a valid email address";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password =
      "Password must be at least 6 characters";
  }

  return errors;
};

// ==================================================
// LOGIN COMPONENT
// ==================================================

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-cyan-100
        via-white
        to-blue-100
        px-4
        py-8
      "
    >
      {/* ==================================================
          ANIMATED LOGIN CONTAINER
      ================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="
          w-full
          max-w-md
        "
      >
        {/* ==================================================
            LOGIN CARD
        ================================================== */}

        <div
          className="
            w-full
            bg-white
            shadow-2xl
            rounded-3xl
            border
            border-gray-100
            overflow-hidden
          "
        >
          <div
            className="
              p-6
              sm:p-8
            "
          >
            {/* ==================================================
                HEADING
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: 0.1,
              }}
              className="
                text-center
                mb-8
              "
            >
              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  bg-clip-text
                  text-transparent
                "
              >
                Welcome Back
              </h1>

              <p
                className="
                  text-gray-500
                  mt-2
                  text-sm
                  sm:text-base
                "
              >
                Login to your Blogify account
              </p>
            </motion.div>

            {/* ==================================================
                FORM ERROR
            ================================================== */}

            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="
                    mb-5
                    overflow-hidden
                  "
                >
                  <p
                    className="
                      text-sm
                      text-red-600
                      bg-red-50
                      border
                      border-red-100
                      rounded-xl
                      px-4
                      py-2.5
                    "
                  >
                    {formError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ==================================================
                FORMIK FORM
            ================================================== */}

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validate={validate}
              onSubmit={async (
                values,
                { resetForm }
              ) => {
                setFormError("");

                try {
                  setLoading(true);

                  // ==================================================
                  // LOGIN API
                  // ==================================================

                  const res = await api.post(
                    "/api/login",
                    values,
                    {
                      withCredentials: true,
                    }
                  );

                  console.log(
                    "Login Response:",
                    res.data
                  );

                  // ==================================================
                  // CHECK USER RESPONSE
                  // ==================================================

                  if (!res.data?.user) {
                    setFormError(
                      "Invalid response from server."
                    );
                    return;
                  }

                  const user = res.data.user;

                  // ==================================================
                  // SAVE USER IN REDUX
                  // ==================================================

                  dispatch(loginUser(user));

                  // ==================================================
                  // SAVE LOGIN STATUS
                  // ==================================================

                  localStorage.setItem(
                    "loggedin",
                    "true"
                  );

                  localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                  );

                  // ==================================================
                  // REDIRECT BASED ON ROLE
                  // ==================================================

                  if (user.role === "admin") {
                    navigate(
                      "/admindashboard",
                      {
                        replace: true,
                      }
                    );
                  } else {
                    navigate("/", {
                      replace: true,
                    });
                  }

                  // ==================================================
                  // RESET FORM
                  // ==================================================

                  resetForm();
                } catch (error) {
                  console.log(
                    "Login Error:",
                    error.response?.data ||
                      error.message
                  );

                  setFormError(
                    error.response?.data
                      ?.message ||
                      "Login failed. Please check your credentials."
                  );
                } finally {
                  setLoading(false);
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <form
                  onSubmit={handleSubmit}
                  className="
                    space-y-5
                  "
                >
                  {/* ==================================================
                      EMAIL FIELD
                  ================================================== */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: 0.15,
                    }}
                  >
                    {/* EMAIL LABEL */}

                    <label
                      htmlFor="email"
                      className="
                        block
                        text-sm
                        font-semibold
                        text-gray-600
                      "
                    >
                      Email Address
                    </label>

                    {/* EMAIL INPUT */}

                    <div
                      className="
                        relative
                        mt-2
                      "
                    >
                      <Mail
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                        "
                      />

                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        autoComplete="email"
                        className={`
                          w-full
                          pl-10
                          pr-4
                          py-3
                          rounded-xl
                          border
                          bg-white
                          text-gray-700
                          outline-none
                          transition
                          focus:ring-2
                          focus:ring-cyan-400
                          focus:border-cyan-400
                          ${
                            touched.email &&
                            errors.email
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-300"
                          }
                        `}
                      />
                    </div>

                    {/* EMAIL ERROR */}

                    <AnimatePresence>
                      {touched.email &&
                        errors.email && (
                          <motion.p
                            initial={{
                              opacity: 0,
                              y: -4,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -4,
                            }}
                            className="
                              text-xs
                              text-red-500
                              mt-1.5
                              ml-1
                            "
                          >
                            {errors.email}
                          </motion.p>
                        )}
                    </AnimatePresence>
                  </motion.div>

                  {/* ==================================================
                      PASSWORD FIELD
                  ================================================== */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: 0.2,
                    }}
                  >
                    {/* PASSWORD LABEL */}

                    <label
                      htmlFor="password"
                      className="
                        block
                        text-sm
                        font-semibold
                        text-gray-600
                      "
                    >
                      Password
                    </label>

                    {/* PASSWORD INPUT */}

                    <div
                      className="
                        relative
                        mt-2
                      "
                    >
                      <Lock
                        size={18}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                        "
                      />

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={`
                          w-full
                          pl-10
                          pr-11
                          py-3
                          rounded-xl
                          border
                          bg-white
                          text-gray-700
                          outline-none
                          transition
                          focus:ring-2
                          focus:ring-cyan-400
                          focus:border-cyan-400
                          ${
                            touched.password &&
                            errors.password
                              ? "border-red-400 focus:ring-red-400"
                              : "border-gray-300"
                          }
                        `}
                      />

                      {/* SHOW / HIDE PASSWORD */}

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                        className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          hover:text-gray-600
                          transition
                        "
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* PASSWORD ERROR */}

                    <AnimatePresence>
                      {touched.password &&
                        errors.password && (
                          <motion.p
                            initial={{
                              opacity: 0,
                              y: -4,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -4,
                            }}
                            className="
                              text-xs
                              text-red-500
                              mt-1.5
                              ml-1
                            "
                          >
                            {errors.password}
                          </motion.p>
                        )}
                    </AnimatePresence>

                    {/* FORGOT PASSWORD */}

                    <div
                      className="
                        text-right
                        mt-2
                      "
                    >
                      <Link
                        to="/forgot-password"
                        className="
                          text-xs
                          text-blue-600
                          hover:underline
                          font-medium
                        "
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </motion.div>

                  {/* ==================================================
                      LOGIN BUTTON
                  ================================================== */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: 0.25,
                    }}
                  >
                    <motion.div
                      whileTap={{
                        scale: loading
                          ? 1
                          : 0.97,
                      }}
                    >
                      <button
                        type="submit"
                        disabled={loading}
                        className="
                          w-full
                          flex
                          items-center
                          justify-center
                          bg-gradient-to-r
                          from-cyan-500
                          to-blue-500
                          hover:from-cyan-600
                          hover:to-blue-600
                          disabled:opacity-60
                          disabled:cursor-not-allowed
                          text-white
                          py-3.5
                          rounded-xl
                          font-semibold
                          shadow-lg
                          shadow-blue-500/20
                          transition-all
                        "
                      >
                        {loading ? (
                          <span
                            className="
                              flex
                              items-center
                              justify-center
                              gap-2
                            "
                          >
                            <Loader2
                              size={18}
                              className="
                                animate-spin
                              "
                            />

                            Logging in...
                          </span>
                        ) : (
                          "Login"
                        )}
                      </button>
                    </motion.div>
                  </motion.div>

                  {/* ==================================================
                      SIGNUP LINK
                  ================================================== */}

                  <motion.p
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: 0.3,
                    }}
                    className="
                      text-center
                      text-gray-500
                      text-sm
                    "
                  >
                    Don&apos;t have an account?{" "}

                    <Link
                      to="/signup"
                      className="
                        text-blue-600
                        font-semibold
                        hover:underline
                      "
                    >
                      Sign Up
                    </Link>
                  </motion.p>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
