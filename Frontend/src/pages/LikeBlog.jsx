import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const LikeBlog = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(0)
  const [page,setpage] =useState(1)
  const [totalpages ,settotalpages] =useState(0)

  const blogfetch = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/getlike",
        {
          withCredentials: true,
          params:{
            page,
            limit:3

          }
        }
      );

      console.log(res.data);
      settotalpages(res.data.totalpages)

      // ✅ ONLY THIS
      setData(res.data.likeblogs);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    blogfetch();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="p-5">
        <h1 className="text-3xl font-bold mb-5">
          Liked Blogs
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No liked blogs found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl shadow-md"
              >
                <img src={`http://localhost:4000/uploads/${item.image}`} alt={item.title}/>
                <h1 className="text-2xl font-bold mb-2">
                 Title: {item.title}
                </h1>

                <p className="text-gray-600 mb-3">
                 Description: {item.description}
                </p>
                
                <p className="text-gray-600 mb-3">
                 Category:{item.category?.name}
                </p>


                <p className="text-pink-500 font-semibold">
                  ❤️ {item.countlike || 0} Likes
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
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

        <div className="bg-white shadow px-5 py-2 rounded-xl border">
          <span className="font-semibold text-slate-700">
            Page {page} of {totalpages}
          </span>
        </div>

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
  );
};

export default LikeBlog;