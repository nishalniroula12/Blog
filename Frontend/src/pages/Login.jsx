import React, { useState } from "react";
import { Formik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { loginUser } from "../Redux/Slice";
import api from "../api/axios";
const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
          <CardContent className="p-8">
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-2">
                Login to your Blogify account
              </p>
            </motion.div>

            {/* Form-level error */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    {formError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Formik
              initialValues={{ email: "", password: "" }}
              validate={validate}
              onSubmit={async (values, { resetForm }) => {
                setFormError("");
                try {
                  setLoading(true);

                  const res = await api.post("api/login", values);

                  // SAVE ONLY USER IN REDUX
                  if (res.data.user.role === "user") {
                    dispatch(loginUser(res.data.user));
                  }

                  localStorage.setItem("loggedin", "true");

                  // REDIRECT
                  if (res.data.user.role === "admin") {
                    navigate("/admindashboard");
                  } else {
                    navigate("/");
                  }

                  resetForm();
                } catch (error) {
                  setFormError(
                    error.response?.data?.message ||
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
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                  >
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-600"
                    >
                      Email Address
                    </Label>

                    <div className="relative mt-2">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        autoComplete="email"
                        className={`pl-10 py-5 rounded-xl border-gray-300 focus-visible:ring-cyan-400 ${
                          touched.email && errors.email
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }`}
                      />
                    </div>

                    <AnimatePresence>
                      {touched.email && errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-xs text-red-500 mt-1.5 ml-1"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                  >
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-600"
                    >
                      Password
                    </Label>

                    <div className="relative mt-2">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={`pl-10 pr-11 py-5 rounded-xl border-gray-300 focus-visible:ring-cyan-400 ${
                          touched.password && errors.password
                            ? "border-red-400 focus-visible:ring-red-400"
                            : ""
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {touched.password && errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-xs text-red-500 mt-1.5 ml-1"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <div className="text-right mt-2">
                      <Link
                        to="/forgot-password"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                  >
                    <motion.div
                      whileTap={{ scale: loading ? 1 : 0.97 }}
                    >
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-6 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin" />
                            Logging in...
                          </span>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Signup */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="text-center text-gray-500 text-sm"
                  >
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Sign Up
                    </Link>
                  </motion.p>
                </form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;