import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllCategory = () => {
  const [data, setData] = useState([]);
  const [page, setpage] = useState(1);
  const [totalpages, settotalpages] = useState(0);

  // STORE ALL CATEGORY
  const [allcategory, setallcategory] = useState([]);

  // SEARCH VALUE
  const [searchVal, setsearchVal] = useState("");

  const nav = useNavigate();

  // ================= FETCH CATEGORY =================
  const categoryFetch = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/getdata",
        {
          withCredentials: true,
          params: {
            page,
            limit: 2,
          },
        }
      );

      settotalpages(res.data.totalpages);

      // CURRENT PAGE DATA
      setData(res.data.category || []);

      // STORE ALL CATEGORY FOR SEARCH
      setallcategory(res.data.category || []);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    categoryFetch();
  }, [page]);

  // ================= DELETE CATEGORY =================
  const deletecategory = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      console.log(res);

      // UPDATE UI
      setData((prev) =>
        prev.filter((item) => item._id !== id)
      );

    } catch (error) {
      console.log(error);
    }
  };

  // ================= SEARCH CATEGORY =================
  const handlesearch = () => {

    // IF EMPTY SHOW ALL
    if (searchVal.trim() === "") {
      setData(allcategory);
      return;
    }

    // FILTER CATEGORY
    const filteredcategory = allcategory.filter((item) =>
      item.name
        .toLowerCase()
        .includes(searchVal.toLowerCase())
    );

    setData(filteredcategory);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Categories
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all blog categories
            </p>
          </div>

          {/* SEARCH */}
          <div className="flex items-center gap-3">

            <input
              type="text"
              value={searchVal}
              onChange={(e) =>
                setsearchVal(e.target.value)
              }
              placeholder="Search Category"
              className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onKeyDown={(e)=>{
                if(e.key === "Enter"){
                  handlesearch()
                }
              }}
            />

            <button
              onClick={handlesearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Search
            </button>

          </div>

          {/* ADD CATEGORY */}
          <button
            onClick={() => nav("/addcategory")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow transition"
          >
            + Add Category
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <table className="w-full border-collapse">

            {/* TABLE HEAD */}
            <thead className="bg-indigo-600 text-white">

              <tr>
                <th className="text-left px-6 py-4">
                  SN
                </th>

                <th className="text-left px-6 py-4">
                  Category Name
                </th>

                <th className="text-left px-6 py-4">
                  Description
                </th>

                <th className="text-left px-6 py-4">
                  Action
                </th>
              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody>

              {data.length > 0 ? (

                data.map((item, index) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* SN */}
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>

                    {/* CATEGORY NAME */}
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.name}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-6 py-4 text-gray-600">
                      {item.description}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">

                      <div className="flex gap-4">

                        {/* EDIT */}
                        <button
                          onClick={() =>
                            nav(`/allcategory/${item._id}`)
                          }
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-3 rounded-xl transition"
                        >
                          <FaEdit size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-xl transition"
                          onClick={() =>
                            deletecategory(item._id)
                          }
                        >
                          <FaTrash size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No Categories Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-4 mt-8 pb-6">

            {/* PREV */}
            <button
              disabled={page === 1}
              onClick={() => setpage(page - 1)}
              className={`px-5 py-2 rounded-xl font-medium transition
              ${
                page === 1
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              ← Prev
            </button>

            {/* PAGE */}
            <div className="bg-white shadow px-5 py-2 rounded-xl border">

              <span className="font-semibold text-slate-700">
                Page {page} of {totalpages}
              </span>

            </div>

            {/* NEXT */}
            <button
              disabled={page === totalpages}
              onClick={() => setpage(page + 1)}
              className={`px-5 py-2 rounded-xl font-medium transition
              ${
                page === totalpages
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Next →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AllCategory;