import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import Sidebar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";


const AllCategory = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
  });

  const { id } = useParams();

  const nav = useNavigate();

  const iseditmode = Boolean(id);

  // get single category for edit
  const getsinglecategory = async () => {
    try {
      const res = await api.get(
        `api/getcategory/${id}`,
            );

      setInitialValues({
        name: res.data.category.name,
        description: res.data.category.description,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (iseditmode) {
      getsinglecategory();
    }
  }, [id]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {iseditmode ? "Edit Category" : "Add Category"}
            </h1>

            <p className="text-gray-500 mt-2">
              {iseditmode
                ? "Update your category details."
                : "Create a new blog category here."}
            </p>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={async (values, { resetForm }) => {
              try {
                // UPDATE
                if (iseditmode) {
                  const res = await api.put(
                    `api/updatecategory/${id}`,
                    values,
                    {
                      withCredentials: true,
                    }
                  );

                  console.log(res);

                  // navigate after edit
                  nav("/addcategory");
                }

                // CREATE
                else {
                  const res = await api.post(
                    "api/createcategory",
                    values
                  );

                  console.log(res);

                  resetForm();

                  // navigate after create
                  nav("/addcategory");
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ handleSubmit, values, handleChange }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter category name"
                    value={values.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter category description"
                    value={values.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                  />
                </div>

<button onClick={()=>nav("/addcategory")}>
  Back
</button>
                {/* Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
                >
                  {iseditmode ? "Update Category" : "Add Category"}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;