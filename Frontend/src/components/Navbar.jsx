import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [handle, setHandle] = useState([]);
  const [dropdown, setDropdown] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!search.trim()) {
        setHandle([]);
        setDropdown(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:4000/api/search?search=${search}`
        );

        setHandle(res.data.blogs || []);
        setDropdown(true);
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setTimeout(loadData, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = () => {
    if (search.trim()) {
      nav(`/blog?search=${search}`);
    } else {
      nav("/blog");
    }
    setDropdown(false);
  };
  console.log(dropdown)

  return (
    <div className="relative flex items-center gap-2 w-full">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search blogs..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 sm:flex-none sm:w-64 px-3 py-2 border rounded-md"
      />

      <button
        onClick={handleSearch}
        className="px-3 py-2 border rounded-md"
      >
        Search
      </button>

      {dropdown && handle.length > 0 && (
        <div className="absolute top-12 left-0 w-64 bg-white border rounded-md shadow-lg z-50">
          {handle.map((item) => (
            <div
              key={item._id}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b"
              onClick={() => {
                setDropdown(false);
                nav(`/blog/${item._id}`);
              }}
            >
              <p className="font-medium">{item.title}</p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;