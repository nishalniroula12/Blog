import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";


const AllCategory = () => {
  const [data, setData] = useState([]);

  const nav = useNavigate();

  const categoryFetch = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/getdata",{withCredentials:true});

      setData(res.data.category || []);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    categoryFetch();
  }, []);

  const deletecategory =async(id)=>{

    try {
      const res= await axios.delete(`http://localhost:4000/api/delete/${id}`,{withCredentials:true})
      console.log(res)
      setData((prev)=> prev.filter((item)=>item._id !==id))
      
    } catch (error) {
      console.log(error)
      
    }
  }
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Categories
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all blog categories
            </p>
          </div>

          <button
            onClick={() => nav("/allcategory")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            + Add Category
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            
            {/* Table Head */}
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="text-left px-6 py-4">SN</th>
                <th className="text-left px-6 py-4">Category Name</th>
                <th className="text-left px-6 py-4">Description</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {item.description}
                    </td>
                    <td className="flex gap-5">
                      
                      <button 
                            onClick={()=>nav(`/allcategory/${item._id}`)}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-3 rounded-xl transition"

                            
                            >
                              <FaEdit size={18}/>
                              </button>
                      <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-xl transition"

                       onClick={()=>deletecategory(item._id)} ><FaTrash size={18}/></button>
                    </td>
                    
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500"
                  >
                    No Categories Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;