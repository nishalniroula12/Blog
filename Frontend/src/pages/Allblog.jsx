import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const Allblog = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH BLOGS =================
  const blogfetch = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:4000/api/getblog",
        {
          withCredentials: true,
        }
      );

      setData(res.data.blog || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    blogfetch();
  }, []);

  // ================= DELETE BLOG =================
  const deleteblog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:4000/api/blogdelete/${id}`,
        {
          withCredentials: true,
        }
      );

      // UPDATE UI
      setData((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Blog Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              All Blogs
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all your blog posts here
            </p>
          </div>

          <button
            onClick={() => navigate("/adminblog")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md font-medium transition"
          >
            + Add Blog
          </button>

        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading blogs...
            </div>
          ) : data.length > 0 ? (

            <div className="overflow-x-auto">

              <table className="w-full text-left border-collapse">

                {/* TABLE HEAD */}
                <thead className="bg-gray-100 border-b">

                  <tr>
                    <th className="p-4 font-semibold text-gray-700">
                      SN
                    </th>

                    <th className="p-4 font-semibold text-gray-700">
                      Image
                    </th>

                    <th className="p-4 font-semibold text-gray-700">
                      Title
                    </th>

                    <th className="p-4 font-semibold text-gray-700">
                      Category
                    </th>

                    <th className="p-4 font-semibold text-gray-700">
                      Description
                    </th>

                    <th className="p-4 font-semibold text-center text-gray-700">
                      Actions
                    </th>
                  </tr>

                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {data.map((blog, index) => (
                    <tr
                      key={blog._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* SN */}
                      <td className="p-4 text-gray-700">
                        {index + 1}
                      </td>

                      {/* IMAGE */}
                      <td className="p-4">
                        <img
                          src={`http://localhost:4000/uploads/${blog.image}`}
                          alt={blog.title}
                          className="w-20 h-16 object-cover rounded-lg border"
                        />
                      </td>

                      {/* TITLE */}
                      <td className="p-4 font-medium text-gray-800">
                        {blog.title}
                      </td>

                      {/* CATEGORY */}
                      <td className="p-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {blog.category?.name || "No Category"}
                        </span>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="p-4 text-gray-600 max-w-xs truncate">
                        {blog.description}
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">

                        <div className="flex items-center justify-center gap-3">

                          {/* EDIT */}
                          <button
                            onClick={() =>
                              navigate(`/adminblog/${blog._id}`)
                            }
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-3 rounded-xl transition"
                          >
                            <FaEdit size={18} />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => deleteblog(blog._id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-xl transition"
                          >
                            <FaTrash size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="p-10 text-center">

              <h2 className="text-2xl font-semibold text-gray-700">
                No Blogs Found
              </h2>

              <p className="text-gray-500 mt-2">
                Start by creating your first blog.
              </p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
};

export default Allblog;