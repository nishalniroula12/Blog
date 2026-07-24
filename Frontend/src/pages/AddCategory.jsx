
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import api from "../api/axios";

const AllCategory = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(0);

  // STORE CURRENT PAGE CATEGORIES
  const [allcategory, setAllcategory] = useState([]);

  // SEARCH VALUE
  const [searchVal, setSearchVal] = useState("");

  // LOADING
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  // ==================================================
  // FETCH CATEGORY
  // ==================================================

  const categoryFetch = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/getdata", {
        params: {
          page,
          limit: 10,
        },
      });

      const categories =
        res.data?.category || [];

      setTotalpages(
        res.data?.totalpages || 1
      );

      setData(categories);

      setAllcategory(categories);
    } catch (error) {
      console.log(
        "Category Fetch Error:",
        error.response?.data ||
          error.message
      );

      setData([]);
      setAllcategory([]);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FETCH DATA WHEN PAGE CHANGES
  // ==================================================

  useEffect(() => {
    categoryFetch();
  }, [page]);

  // ==================================================
  // DELETE CATEGORY
  // ==================================================

  const deletecategory = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/api/delete/${id}`
      );

      // REMOVE FROM CURRENT DATA
      setData((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      // REMOVE FROM SEARCH DATA
      setAllcategory((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (error) {
      console.log(
        "Delete Category Error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  // ==================================================
  // SEARCH CATEGORY
  // ==================================================

  const handlesearch = () => {
    const value =
      searchVal.trim().toLowerCase();

    // EMPTY SEARCH
    if (!value) {
      setData(allcategory);
      return;
    }

    // FILTER CATEGORY
    const filteredcategory =
      allcategory.filter((item) =>
        item.name
          ?.toLowerCase()
          .includes(value)
      );

    setData(filteredcategory);
  };

  // ==================================================
  // CLEAR SEARCH
  // ==================================================

  const clearSearch = () => {
    setSearchVal("");
    setData(allcategory);
  };

  // ==================================================
  // SEARCH ENTER KEY
  // ==================================================

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handlesearch();
    }
  };

  // ==================================================
  // PREVIOUS PAGE
  // ==================================================

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // ==================================================
  // NEXT PAGE
  // ==================================================

  const handleNext = () => {
    if (page < totalpages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-gray-100
        overflow-x-hidden
      "
    >
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar />

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        className="
          w-full
          min-h-screen
          p-3
          sm:p-5
          md:p-6
          lg:p-8
        "
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            w-full
            mb-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
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
                Categories
              </h1>

              <p
                className="
                  text-sm
                  sm:text-base
                  text-gray-500
                  mt-1
                "
              >
                Manage all blog categories
              </p>
            </div>

            {/* ADD CATEGORY */}

            <button
              type="button"
              onClick={() =>
                nav("/addcategory")
              }
              className="
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
                gap-2
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                px-5
                py-3
                rounded-xl
                shadow
                transition
                active:scale-95
                font-medium
              "
            >
              <FaPlus size={14} />

              <span>
                Add Category
              </span>
            </button>
          </div>
        </div>

        {/* ==================================================
            SEARCH SECTION
        ================================================== */}

        <div
          className="
            w-full
            bg-white
            rounded-2xl
            shadow-sm
            border
            border-gray-100
            p-3
            sm:p-4
            mb-6
          "
        >
          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-3
              w-full
            "
          >
            {/* SEARCH INPUT */}

            <div
              className="
                relative
                flex-1
                min-w-0
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
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Search category..."
                className="
                  w-full
                  pl-11
                  pr-4
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  bg-gray-50
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-400
                  focus:border-indigo-400
                "
              />
            </div>

            {/* SEARCH BUTTON */}

            <button
              type="button"
              onClick={handlesearch}
              className="
                w-full
                sm:w-auto
                px-6
                py-3
                rounded-xl
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-medium
                flex
                items-center
                justify-center
                gap-2
                transition
                active:scale-95
              "
            >
              <FaSearch size={14} />

              <span>
                Search
              </span>
            </button>

            {/* CLEAR BUTTON */}

            {searchVal && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  w-full
                  sm:w-auto
                  px-5
                  py-3
                  rounded-xl
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-600
                  font-medium
                  transition
                "
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            CATEGORY CONTAINER
        ================================================== */}

        <div
          className="
            w-full
            bg-white
            rounded-2xl
            shadow-sm
            border
            border-gray-100
            overflow-hidden
          "
        >
          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}

          <div
            className="
              hidden
              md:block
              w-full
              overflow-x-auto
            "
          >
            <table
              className="
                w-full
                min-w-[700px]
                border-collapse
              "
            >
              {/* TABLE HEAD */}

              <thead
                className="
                  bg-indigo-600
                  text-white
                "
              >
                <tr>
                  <th
                    className="
                      text-left
                      px-5
                      lg:px-6
                      py-4
                      text-sm
                      font-semibold
                    "
                  >
                    SN
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      lg:px-6
                      py-4
                      text-sm
                      font-semibold
                    "
                  >
                    Category Name
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      lg:px-6
                      py-4
                      text-sm
                      font-semibold
                    "
                  >
                    Description
                  </th>

                  <th
                    className="
                      text-left
                      px-5
                      lg:px-6
                      py-4
                      text-sm
                      font-semibold
                    "
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="
                        text-center
                        py-12
                        text-gray-500
                      "
                    >
                      Loading categories...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map(
                    (item, index) => (
                      <tr
                        key={item._id}
                        className="
                          border-b
                          border-gray-100
                          hover:bg-gray-50
                          transition
                        "
                      >
                        {/* SN */}

                        <td
                          className="
                            px-5
                            lg:px-6
                            py-4
                            font-medium
                            text-gray-700
                          "
                        >
                          {(page - 1) * 10 +
                            index +
                            1}
                        </td>

                        {/* NAME */}

                        <td
                          className="
                            px-5
                            lg:px-6
                            py-4
                            font-semibold
                            text-gray-800
                          "
                        >
                          {item.name}
                        </td>

                        {/* DESCRIPTION */}

                        <td
                          className="
                            px-5
                            lg:px-6
                            py-4
                            text-gray-600
                            max-w-md
                          "
                        >
                          <p className="line-clamp-2">
                            {item.description ||
                              "No description"}
                          </p>
                        </td>

                        {/* ACTION */}

                        <td
                          className="
                            px-5
                            lg:px-6
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() =>
                                nav(
                                  `/allcategory/${item._id}`
                                )
                              }
                              className="
                                bg-yellow-100
                                hover:bg-yellow-200
                                text-yellow-700
                                p-3
                                rounded-xl
                                transition
                                active:scale-95
                              "
                              title="Edit category"
                            >
                              <FaEdit
                                size={17}
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                deletecategory(
                                  item._id
                                )
                              }
                              className="
                                bg-red-100
                                hover:bg-red-200
                                text-red-700
                                p-3
                                rounded-xl
                                transition
                                active:scale-95
                              "
                              title="Delete category"
                            >
                              <FaTrash
                                size={17}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="
                        text-center
                        py-12
                        text-gray-500
                      "
                    >
                      No Categories Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ==================================================
              MOBILE CARDS
          ================================================== */}

          <div
            className="
              block
              md:hidden
            "
          >
            {loading ? (
              <div
                className="
                  py-12
                  text-center
                  text-gray-500
                "
              >
                Loading categories...
              </div>
            ) : data.length > 0 ? (
              <div
                className="
                  divide-y
                  divide-gray-100
                "
              >
                {data.map(
                  (item, index) => (
                    <div
                      key={item._id}
                      className="
                        p-4
                        sm:p-5
                      "
                    >
                      {/* CARD HEADER */}

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                          mb-3
                        "
                      >
                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >
                          <p
                            className="
                              text-xs
                              text-gray-400
                              mb-1
                            "
                          >
                            Category #
                            {(page - 1) *
                              10 +
                              index +
                              1}
                          </p>

                          <h3
                            className="
                              text-lg
                              font-bold
                              text-gray-800
                              break-words
                            "
                          >
                            {item.name}
                          </h3>
                        </div>

                        {/* ACTION BUTTONS */}

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            flex-shrink-0
                          "
                        >
                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              nav(
                                `/allcategory/${item._id}`
                              )
                            }
                            className="
                              bg-yellow-100
                              hover:bg-yellow-200
                              text-yellow-700
                              p-2.5
                              rounded-lg
                              transition
                            "
                            title="Edit category"
                          >
                            <FaEdit
                              size={16}
                            />
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              deletecategory(
                                item._id
                              )
                            }
                            className="
                              bg-red-100
                              hover:bg-red-200
                              text-red-700
                              p-2.5
                              rounded-lg
                              transition
                            "
                            title="Delete category"
                          >
                            <FaTrash
                              size={16}
                            />
                          </button>
                        </div>
                      </div>

                      {/* DESCRIPTION */}

                      <div>
                        <p
                          className="
                            text-xs
                            font-semibold
                            text-gray-400
                            uppercase
                            tracking-wide
                            mb-1
                          "
                        >
                          Description
                        </p>

                        <p
                          className="
                            text-sm
                            text-gray-600
                            leading-6
                            break-words
                          "
                        >
                          {item.description ||
                            "No description available"}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  py-12
                  px-4
                  text-center
                  text-gray-500
                "
              >
                No Categories Found
              </div>
            )}
          </div>

          {/* ==================================================
              PAGINATION
          ================================================== */}

          {totalpages > 0 && (
            <div
              className="
                border-t
                border-gray-100
                p-4
                sm:p-5
              "
            >
              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  justify-between
                  gap-4
                "
              >
                {/* PAGE INFO */}

                <p
                  className="
                    text-sm
                    text-gray-500
                    order-2
                    sm:order-1
                  "
                >
                  Page{" "}
                  <span
                    className="
                      font-semibold
                      text-gray-700
                    "
                  >
                    {page}
                  </span>{" "}
                  of{" "}
                  <span
                    className="
                      font-semibold
                      text-gray-700
                    "
                  >
                    {totalpages}
                  </span>
                </p>

                {/* PAGINATION BUTTONS */}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    order-1
                    sm:order-2
                  "
                >
                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={
                      handlePrevious
                    }
                    className={`
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                      transition
                      ${
                        page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                      }
                    `}
                  >
                    ←
                    <span className="hidden sm:inline ml-1">
                      Prev
                    </span>
                  </button>

                  {/* CURRENT PAGE */}

                  <div
                    className="
                      min-w-[44px]
                      h-[42px]
                      px-3
                      flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-indigo-50
                      border
                      border-indigo-100
                      text-indigo-700
                      font-semibold
                    "
                  >
                    {page}
                  </div>

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      page >= totalpages
                    }
                    onClick={handleNext}
                    className={`
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                      transition
                      ${
                        page >= totalpages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                      }
                    `}
                  >
                    <span className="hidden sm:inline mr-1">
                      Next
                    </span>
                    →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllCategory;

