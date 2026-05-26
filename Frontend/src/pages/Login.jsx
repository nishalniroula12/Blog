import axios from "axios";
import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate, Link, data } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../Redux/Slice";

const Login = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to your Blogify account</p>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              setLoading(true);

              const res = await axios.post(
                "http://localhost:4000/api/login",
                values,
                {
                  withCredentials: true,
                }
              );

              console.log(res.data);

              // FIXED

              setLogin(res.data.user);
              dispatch(loginUser(res.data.user))


              alert("Login Successful");
              localStorage.setItem("loggedin", "true");
              console.log(res.data);

              // save user type

              // save token if available
              alert("Login Successful");

              // redirect
              if (res.data.user.role === "admin") {
                navigate("/admindashboard");
              } else {
                navigate("/");
              }

              resetForm();
            } catch (error) {
              console.log(error);

              alert(error.response?.data?.message || "Login Failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ handleChange, values, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition duration-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Signup */}
              <p className="text-center text-gray-500 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
