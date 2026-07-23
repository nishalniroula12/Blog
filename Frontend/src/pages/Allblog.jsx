import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import api from "../api/axios";
import Sidebar from "./Sidebar";

const Allblog = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATES
  // ==========================================

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [searchVal, setSearchVal] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  // ==========================================
  // IMAGE URL FUNCTION
  // ==========================================

  const getImageUrl = (image) => {
    // No image
    if (!image) {
      return "https://via.placeholder.com/400x250?text=No+Image";
    }

    // If backend already returns full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Remove starting slash
    const cleanImage = image.replace(/^\/+/, "");

    // Get environment URL
    const baseUrl =
      import.meta.env.VITE_RENDER_URL || "";

    // Make sure slash exists
    const cleanBaseUrl = baseUrl.endsWith("/")
      ? baseUrl
      : `${baseUrl}/`;

    return `${cleanBaseUrl}uploads/${cleanImage}`;
  };

  // ==========================================
  // FETCH BLOGS
  // ==========================================

  const blogfetch = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        "/api/getblog",
        {
          params: {
            page: page,
            limit: 2,
          },

          withCredentials: true,
        }
      );

      console.log(
        "Blog API Response:",
        res.data
      );

      // Safe response
      const blogs = Array.isArray(
        res?.data?.blog
      )
        ? res.data.blog
        : [];

      // Set blogs
      setData(blogs);

      // Set total pages safely
      const pages = Number(
        res?.data?.totalpages
      );

      setTotalPages(
        pages > 0 ? pages : 1
      );

    } catch (error) {
      console.error(
        "Blog Fetch Error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load blogs. Please try again."
      );

      setData([]);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN PAGE CHANGES
  // ==========================================

  useEffect(() => {
    blogfetch();
  }, [page]);

  // ==========================================
  // DELETE BLOG
  // ==========================================

  const deleteblog = async (id) => {
    if (!id) {
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(
        `/api/blogdelete/${id}`,
        {
          withCredentials: true,
        }
      );

      // Remove deleted blog
      setData((previousData) =>
        previousData.filter(
          (item) =>
            item?._id !== id
        )
      );

      alert(
        "Blog deleted successfully"
      );

    } catch (error) {
      console.error(
        "Delete Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Delete failed"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handlesearch = () => {
    // If search is empty
    // reload first page
    if (
      searchVal.trim() === ""
    ) {
      setPage(1);
      blogfetch();
      return;
    }

    const searchText =
      searchVal
        .trim()
        .toLowerCase();

    // This searches the current page
    // because your backend pagination
    // only returns 2 blogs.
    const filteredBlogs =
      data.filter((item) =>
        item?.title
          ?.toLowerCase()
          .includes(searchText)
      );

    setData(filteredBlogs);
  };

  // ==========================================
  // ENTER SEARCH
  // ==========================================

  const handleSearchKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter"
    ) {
      handlesearch();
    }
  };

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  const handleImageError = (
    event
  ) => {
    event.currentTarget.src =
      "https://via.placeholder.com/400x250?text=Image+Not+Found";
  };

  // ==========================================
  // PREVIOUS PAGE
  // ==========================================

  const previousPage = () => {
    if (page > 1) {
      setPage(
        (previousPage) =>
          previousPage - 1
      );
    }
  };

  // ==========================================
  // NEXT PAGE
  // ==========================================

  const nextPage = () => {
    if (
      page < totalPages
    ) {
      setPage(
        (previousPage) =>
          previousPage + 1
      );
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gray-100
      "
    >
      <Sidebar/>

      {/* =====================================
          HEADER
      ====================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          mb-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* TITLE */}

        <div>
          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-gray-800
            "
          >
            All Blogs
          </h1>

          <p
            className="
              text-gray-500
              mt-1
              text-sm
              sm:text-base
            "
          >
            Manage all your blog posts here
          </p>
        </div>


        {/* SEARCH */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
            w-full
            lg:w-auto
          "
        >

          <div
            className="
              relative
              w-full
              sm:w-72
              lg:w-80
            "
          >

            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={searchVal}
              onChange={(event) =>
                setSearchVal(
                  event.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
              placeholder="Search Blog Title"
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-xl
                border
                border-gray-300
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
              "
            />

          </div>


          <button
            type="button"
            onClick={handlesearch}
            className="
              flex
              items-center
              justify-center
              gap-2
              bg-indigo-600
              hover:bg-indigo-700
              text-white
              px-6
              py-3
              rounded-xl
              font-medium
              transition
            "
          >
            <FaSearch />

            Search
          </button>

        </div>


        {/* ADD BLOG */}

        <button
          type="button"
          onClick={() =>
            navigate(
              "/adminblog"
            )
          }
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            shadow-md
            font-medium
            transition
            w-full
            lg:w-auto
          "
        >
          <FaPlus />

          Add Blog
        </button>

      </div>


      {/* =====================================
          ERROR
      ====================================== */}

      {error && (

        <div
          className="
            mb-5
            p-4
            rounded-xl
            bg-red-50
            border
            border-red-200
            text-red-600
          "
        >
          {error}
        </div>

      )}


      {/* =====================================
          BLOG CONTAINER
      ====================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow-lg
          overflow-hidden
        "
      >

        {/* ===================================
            LOADING
        ==================================== */}

        {loading ? (

          <div
            className="
              p-10
              flex
              flex-col
              items-center
              justify-center
            "
          >

            <div
              className="
                w-10
                h-10
                border-4
                border-indigo-200
                border-t-indigo-600
                rounded-full
                animate-spin
                mb-4
              "
            />

            <p className="text-gray-500">
              Loading blogs...
            </p>

          </div>

        ) : data.length > 0 ? (

          <>

            {/* =================================
                DESKTOP TABLE
            ================================== */}

            <div
              className="
                hidden
                lg:block
                overflow-x-auto
              "
            >

              <table
                className="
                  w-full
                  text-left
                  border-collapse
                "
              >

                <thead
                  className="
                    bg-gray-100
                    border-b
                  "
                >

                  <tr>

                    <th className="p-4">
                      SN
                    </th>

                    <th className="p-4">
                      Image
                    </th>

                    <th className="p-4">
                      Title
                    </th>

                    <th className="p-4">
                      Category
                    </th>

                    <th className="p-4">
                      Description
                    </th>

                    <th className="p-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {data.map(
                    (
                      blog,
                      index
                    ) => (

                      <tr
                        key={
                          blog?._id ||
                          index
                        }
                        className="
                          border-b
                          hover:bg-gray-50
                        "
                      >

                        {/* SN */}

                        <td className="p-4">
                          {index + 1}
                        </td>


                        {/* IMAGE */}

                        <td className="p-4">

                          <img
                            src={getImageUrl(
                              blog?.image
                            )}
                            alt={
                              blog?.title ||
                              "Blog"
                            }
                            onError={
                              handleImageError
                            }
                            className="
                              w-20
                              h-16
                              object-cover
                              rounded-lg
                              border
                            "
                          />

                        </td>


                        {/* TITLE */}

                        <td
                          className="
                            p-4
                            font-medium
                            text-gray-800
                          "
                        >
                          {blog?.title ||
                            "Untitled"}
                        </td>


                        {/* CATEGORY */}

                        <td className="p-4">

                          <span
                            className="
                              bg-blue-100
                              text-blue-700
                              px-3
                              py-1
                              rounded-full
                              text-sm
                            "
                          >
                            {blog?.category
                              ?.name ||
                              "No Category"}
                          </span>

                        </td>


                        {/* DESCRIPTION */}

                        <td
                          className="
                            p-4
                            text-gray-600
                            max-w-xs
                          "
                        >
                          <p className="truncate">
                            {blog?.description ||
                              "No description"}
                          </p>
                        </td>


                        {/* ACTIONS */}

                        <td className="p-4">

                          <div
                            className="
                              flex
                              items-center
                              justify-center
                              gap-3
                            "
                          >

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/adminblog/${blog._id}`
                                )
                              }
                              className="
                                bg-yellow-100
                                hover:bg-yellow-200
                                text-yellow-700
                                p-3
                                rounded-xl
                              "
                            >
                              <FaEdit />
                            </button>


                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                blog._id
                              }
                              onClick={() =>
                                deleteblog(
                                  blog._id
                                )
                              }
                              className="
                                bg-red-100
                                hover:bg-red-200
                                text-red-700
                                p-3
                                rounded-xl
                                disabled:opacity-50
                              "
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* =================================
                MOBILE / TABLET CARDS
            ================================== */}

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:hidden
                gap-5
                p-4
                sm:p-6
              "
            >

              {data.map(
                (
                  blog,
                  index
                ) => (

                  <div
                    key={
                      blog?._id ||
                      index
                    }
                    className="
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      overflow-hidden
                      shadow-sm
                    "
                  >

                    {/* IMAGE */}

                    <img
                      src={getImageUrl(
                        blog?.image
                      )}
                      alt={
                        blog?.title ||
                        "Blog"
                      }
                      onError={
                        handleImageError
                      }
                      className="
                        w-full
                        h-48
                        sm:h-56
                        object-cover
                      "
                    />


                    {/* CONTENT */}

                    <div className="p-5">

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          mb-3
                        "
                      >

                        <span
                          className="
                            bg-blue-100
                            text-blue-700
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                          "
                        >
                          {blog?.category
                            ?.name ||
                            "No Category"}
                        </span>

                        <span
                          className="
                            text-xs
                            text-gray-400
                          "
                        >
                          #{index + 1}
                        </span>

                      </div>


                      <h2
                        className="
                          text-lg
                          font-bold
                          text-gray-800
                          line-clamp-2
                        "
                      >
                        {blog?.title ||
                          "Untitled"}
                      </h2>


                      <p
                        className="
                          mt-2
                          text-sm
                          text-gray-600
                          line-clamp-3
                        "
                      >
                        {blog?.description ||
                          "No description available"}
                      </p>


                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          gap-3
                          mt-5
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/adminblog/${blog._id}`
                            )
                          }
                          className="
                            flex-1
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-yellow-100
                            hover:bg-yellow-200
                            text-yellow-700
                            py-3
                            rounded-xl
                            font-medium
                          "
                        >
                          <FaEdit />

                          Edit
                        </button>


                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            blog._id
                          }
                          onClick={() =>
                            deleteblog(
                              blog._id
                            )
                          }
                          className="
                            flex-1
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-red-100
                            hover:bg-red-200
                            text-red-700
                            py-3
                            rounded-xl
                            font-medium
                            disabled:opacity-50
                          "
                        >
                          <FaTrash />

                          {deletingId ===
                          blog._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </>

        ) : (

          /* =================================
              EMPTY
          ================================== */

          <div
            className="
              p-10
              text-center
            "
          >

            <h2
              className="
                text-2xl
                font-semibold
                text-gray-700
              "
            >
              No Blogs Found
            </h2>

            <p
              className="
                text-gray-500
                mt-2
              "
            >
              Start by creating your first blog.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/adminblog"
                )
              }
              className="
                mt-5
                bg-blue-600
                text-white
                px-5
                py-3
                rounded-xl
              "
            >
              Create Blog
            </button>

          </div>

        )}


        {/* =====================================
            PAGINATION
        ====================================== */}

        {!loading &&
          data.length > 0 && (

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                p-5
                border-t
              "
            >

              <button
                type="button"
                disabled={
                  page <= 1
                }
                onClick={
                  previousPage
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  font-medium
                  bg-indigo-600
                  text-white
                  disabled:bg-slate-200
                  disabled:text-slate-400
                "
              >
                <FaChevronLeft />

                Prev
              </button>


              <div
                className="
                  px-4
                  py-2
                  rounded-xl
                  border
                  bg-white
                "
              >
                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  Page {page} of{" "}
                  {totalPages}
                </span>
              </div>


              <button
                type="button"
                disabled={
                  page >=
                  totalPages
                }
                onClick={
                  nextPage
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  font-medium
                  bg-indigo-600
                  text-white
                  disabled:bg-slate-200
                  disabled:text-slate-400
                "
              >
                Next

                <FaChevronRight />

              </button>

            </div>

          )}

      </div>

    </div>
  );
};

export default Allblog;