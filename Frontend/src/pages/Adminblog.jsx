import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  // ================= CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/getdata",
          {
            withCredentials: true,
          }
        );

        setCategories(res.data.category || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
  }, []);

  // ================= SINGLE BLOG =================
  useEffect(() => {
    if (!isEditMode) return;

    const fetchSingleBlog = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/blogget/${id}`,
          {
            withCredentials: true,
          }
        );

        const blog = res.data.blog;

        setFormData({
          title: blog.title || "",
          description: blog.description || "",
          category: blog.category?._id || "",
        });

        if (blog.image) {
          setPreview(`http://localhost:4000/uploads/${blog.image}`);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleBlog();
  }, [id, isEditMode]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);

      if (image) {
        data.append("image", image);
      }

      if (isEditMode) {
        await axios.put(
          `http://localhost:4000/api/updateblog/${id}`,
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Blog Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:4000/api/blogcreates",
          data,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Blog Created Successfully");
      }

      navigate("/allblog");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      
      {/* SIDEBAR */}
      <Sidebar />
      

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? "Edit Blog" : "Create Blog"}
          </h1>

          <p className="text-gray-500 mt-1">
            Fill the details below to manage your blog
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 w-full max-w-4xl mx-auto">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blog Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                required
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write blog content..."
                required
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>

                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Featured Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full border border-gray-300 rounded-xl p-3"
              />

              {/* IMAGE PREVIEW */}
              {preview && (
                <div className="mt-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-56 h-44 object-cover rounded-xl border shadow"
                  />
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col md:flex-row gap-4 pt-2">

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
              >
                {isEditMode ? "Update Blog" : "Create Blog"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/allblog")}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition duration-200"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;