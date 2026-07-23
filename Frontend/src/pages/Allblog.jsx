import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

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

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [searchVal, setSearchVal] =
    useState("");

  const [deletingId, setDeletingId] =
    useState(null);


  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (image) => {

    if (!image) {
      return "https://via.placeholder.com/500x300?text=No+Image";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const cleanImage =
      image.replace(/^\/+/, "");

    const baseUrl =
      import.meta.env.VITE_RENDER_URL ||
      "";

    const cleanBaseUrl =
      baseUrl.endsWith("/")
        ? baseUrl
        : `${baseUrl}/`;

    return `${cleanBaseUrl}uploads/${cleanImage}`;
  };


  // ==========================================
  // FETCH BLOG
  // ==========================================

  const blogfetch = async () => {

    try {

      setLoading(true);

      setError("");

      const res =
        await api.get(
          "/api/getblog",
          {
            params: {
              page,
              limit: 5,
            },
            withCredentials: true,
          }
        );

      const blogs =
        Array.isArray(
          res?.data?.blog
        )
          ? res.data.blog
          : [];

      setData(blogs);

      const pages =
        Number(
          res?.data?.totalpages
        );

      setTotalPages(
        pages > 0
          ? pages
          : 1
      );

    } catch (error) {

      console.error(
        "Blog fetch error:",
        error
      );

      setError(
        error?.response?.data
          ?.message ||
        "Failed to load blogs"
      );

      setData([]);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    blogfetch();

  }, [page]);


  // ==========================================
  // DELETE
  // ==========================================

  const deleteblog =
    async (id) => {

      if (!id) return;

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this blog?"
        );

      if (!confirmDelete)
        return;

      try {

        setDeletingId(id);

        await api.delete(
          `/api/blogdelete/${id}`,
          {
            withCredentials: true,
          }
        );

        setData(
          (previous) =>
            previous.filter(
              (item) =>
                item?._id !== id
            )
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Delete failed"
        );

      } finally {

        setDeletingId(null);

      }

    };


  // ==========================================
  // SEARCH
  // ==========================================

  const handlesearch =
    () => {

      if (
        searchVal.trim() === ""
      ) {

        blogfetch();

        return;

      }

      const search =
        searchVal
          .trim()
          .toLowerCase();

      const filtered =
        data.filter(
          (blog) =>
            blog?.title
              ?.toLowerCase()
              .includes(search)
        );

      setData(filtered);

    };


  // ==========================================
  // IMAGE ERROR
  // ==========================================

  const handleImageError =
    (event) => {

      event.currentTarget.src =
        "https://via.placeholder.com/500x300?text=Image+Not+Found";

    };


  return (

    <div
      className="
        min-h-screen
        w-full
        bg-slate-100
      "
    >

      {/* ====================================
          SIDEBAR
      ===================================== */}

      <Sidebar />


      {/* ====================================
          MAIN CONTENT
      ===================================== */}

      <main
        className="
          min-h-screen
          pt-20
          md:pt-0
          md:ml-72
          w-auto
        "
      >

        <div
          className="
            w-full
            max-w-[1600px]
            mx-auto
            p-4
            sm:p-6
            lg:p-8
          "
        >

          {/* ==================================
              HEADER
          ================================== */}

          <div
            className="
              flex
              flex-col
              gap-4
              xl:flex-row
              xl:items-center
              xl:justify-between
              mb-6
            "
          >

            <div>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-bold
                  text-slate-800
                "
              >
                All Blogs
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Manage all your blog posts
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
                xl:w-auto
              "
            >

              <div
                className="
                  relative
                  w-full
                  sm:w-80
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
                  onChange={(e) =>
                    setSearchVal(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

                    if (
                      e.key ===
                      "Enter"
                    ) {
                      handlesearch();
                    }

                  }}
                  placeholder="
                    Search blog title...
                  "
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                />

              </div>


              <button
                onClick={
                  handlesearch
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  rounded-xl
                  bg-indigo-600
                  text-white
                  hover:bg-indigo-700
                "
              >

                <FaSearch />

                Search

              </button>

            </div>


            {/* ADD BLOG */}

            <button
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
                px-5
                py-3
                rounded-xl
                bg-blue-600
                text-white
                hover:bg-blue-700
                shadow-sm
              "
            >

              <FaPlus />

              Add Blog

            </button>

          </div>


          {/* ==================================
              ERROR
          ================================== */}

          {error && (

            <div
              className="
                mb-5
                p-4
                rounded-xl
                bg-red-50
                text-red-600
                border
                border-red-200
              "
            >
              {error}
            </div>

          )}


          {/* ==================================
              BLOG CARD
          ================================== */}

          <div
            className="
              bg-white
              rounded-2xl
              shadow-sm
              border
              border-gray-200
              overflow-hidden
            "
          >

            {loading ? (

              <div
                className="
                  min-h-[300px]
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
                  "
                />

                <p
                  className="
                    mt-4
                    text-gray-500
                  "
                >
                  Loading blogs...
                </p>

              </div>

            ) : data.length === 0 ? (

              <div
                className="
                  min-h-[300px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  p-6
                "
              >

                <h2
                  className="
                    text-xl
                    font-semibold
                    text-gray-700
                  "
                >
                  No Blogs Found
                </h2>

                <p
                  className="
                    mt-2
                    text-gray-500
                  "
                >
                  Start by creating your first blog.
                </p>

              </div>

            ) : (

              <>

                {/* ==================================
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
                      min-w-[900px]
                    "
                  >

                    <thead
                      className="
                        bg-slate-50
                        border-b
                      "
                    >

                      <tr>

                        <th className="p-4 text-left">
                          SN
                        </th>

                        <th className="p-4 text-left">
                          Image
                        </th>

                        <th className="p-4 text-left">
                          Title
                        </th>

                        <th className="p-4 text-left">
                          Category
                        </th>

                        <th className="p-4 text-left">
                          Description
                        </th>

                        <th className="p-4 text-center">
                          Actions
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {data.map(
                        (blog, index) => (

                          <tr
                            key={
                              blog?._id ||
                              index
                            }
                            className="
                              border-b
                              hover:bg-slate-50
                            "
                          >

                            <td className="p-4">
                              {(page - 1) *
                                5 +
                                index +
                                1}
                            </td>


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
                                  h-14
                                  object-cover
                                  rounded-lg
                                "
                              />

                            </td>


                            <td
                              className="
                                p-4
                                font-semibold
                                max-w-xs
                              "
                            >
                              {blog?.title ||
                                "Untitled"}
                            </td>


                            <td className="p-4">

                              <span
                                className="
                                  px-3
                                  py-1
                                  rounded-full
                                  bg-blue-100
                                  text-blue-700
                                  text-xs
                                "
                              >
                                {blog
                                  ?.category
                                  ?.name ||
                                  "No Category"}
                              </span>

                            </td>


                            <td
                              className="
                                p-4
                                max-w-xs
                              "
                            >
                              <p className="truncate">
                                {blog
                                  ?.description ||
                                  "No description"}
                              </p>
                            </td>


                            <td className="p-4">

                              <div
                                className="
                                  flex
                                  justify-center
                                  gap-2
                                "
                              >

                                <button
                                  onClick={() =>
                                    navigate(
                                      `/adminblog/${blog._id}`
                                    )
                                  }
                                  className="
                                    p-3
                                    rounded-lg
                                    bg-yellow-100
                                    text-yellow-700
                                  "
                                >
                                  <FaEdit />
                                </button>


                                <button
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
                                    p-3
                                    rounded-lg
                                    bg-red-100
                                    text-red-700
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


                {/* ==================================
                    MOBILE CARDS
                ================================== */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                    p-4
                    lg:hidden
                  "
                >

                  {data.map(
                    (blog, index) => (

                      <div
                        key={
                          blog?._id ||
                          index
                        }
                        className="
                          border
                          rounded-2xl
                          overflow-hidden
                          bg-white
                          shadow-sm
                        "
                      >

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
                            object-cover
                          "
                        />


                        <div className="p-4">

                          <div
                            className="
                              flex
                              justify-between
                              items-center
                            "
                          >

                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                bg-blue-100
                                text-blue-700
                                text-xs
                              "
                            >
                              {blog
                                ?.category
                                ?.name ||
                                "No Category"}
                            </span>

                            <span
                              className="
                                text-xs
                                text-gray-400
                              "
                            >
                              #
                              {index + 1}
                            </span>

                          </div>


                          <h2
                            className="
                              mt-3
                              font-bold
                              text-lg
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
                              text-gray-500
                              line-clamp-3
                            "
                          >
                            {blog
                              ?.description ||
                              "No description"}
                          </p>


                          <div
                            className="
                              flex
                              gap-2
                              mt-5
                            "
                          >

                            <button
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
                                py-3
                                rounded-xl
                                bg-yellow-100
                                text-yellow-700
                              "
                            >
                              <FaEdit />

                              Edit
                            </button>


                            <button
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
                                py-3
                                rounded-xl
                                bg-red-100
                                text-red-700
                              "
                            >
                              <FaTrash />

                              Delete
                            </button>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </>

            )}


            {/* ==================================
                PAGINATION
            ================================== */}

            {!loading &&
              data.length > 0 && (

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    p-4
                    border-t
                    bg-slate-50
                  "
                >

                  <button
                    disabled={
                      page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (prev) =>
                          prev - 1
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-lg
                      bg-white
                      border
                      disabled:opacity-40
                    "
                  >
                    <FaChevronLeft />

                    <span className="hidden sm:block">
                      Previous
                    </span>

                  </button>


                  <span
                    className="
                      text-sm
                      font-semibold
                    "
                  >
                    Page {page} of{" "}
                    {totalPages}
                  </span>


                  <button
                    disabled={
                      page >=
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (prev) =>
                          prev + 1
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-lg
                      bg-white
                      border
                      disabled:opacity-40
                    "
                  >

                    <span className="hidden sm:block">
                      Next
                    </span>

                    <FaChevronRight />

                  </button>

                </div>

              )}

          </div>

        </div>

      </main>

    </div>

  );

};

export default Allblog;