import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

const View = () => {
  const { id } = useParams();
  const [data, setdata] = useState(null);

  const fetchdata = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/blogget/${id}`
      );

      setdata(res.data.blog);
      console.log(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-400 text-white pt-30">
      <Header />

      {data ? (
        <div className="max-w-6xl mx-auto px-5 py-12">
          
          {/* Main Card */}
          <div className="bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* LEFT IMAGE */}
              <div className="p-5">
                <img
                  src={`http://localhost:4000/uploads/${data.image}`}
                  alt="blog"
                  className="w-full h-[550px] object-cover rounded-2xl"
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                
                {/* CATEGORY */}
                <div className="mb-5">
                  <span>
                   Category: {data.category?.name}
                  </span>
                </div>

                {/* TITLE */}
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                 Title: {data.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="text-gray-300 leading-8 text-[16px] mb-8">
                  Description:{data.description}
                </p>

                {/* INFO BOXES */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700">
                    <h2 className="text-sm text-gray-400 mb-1">
                      Status
                    </h2>

                    <p className="font-semibold text-green-400">
                      Published
                    </p>
                  </div>

                </div>

                {/* BUTTONS */}
              
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[80vh]">
          <h1 className="text-xl font-semibold animate-pulse text-gray-400">
            Loading...
          </h1>
        </div>
      )}
    </div>
  );
};

export default View;