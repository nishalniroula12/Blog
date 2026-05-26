import { Routes, Route } from "react-router-dom";


import Blog from "./pages/Blog";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Admindashboard from "./pages/Admindashboard";
import Adminblog from "./pages/Adminblog";
import Allblog from "./pages/Allblog";

import AddCategory from "./pages/AddCategory";
import Allcategory from "./pages/Allcategory";

import LikeBlog from "./pages/LikeBlog";

import ProtectedRoute from "./pages/ProtectedRoute";
import Publicroute from "./pages/Publicroute";
import View from "./pages/View";
import Mainlayout from './components/Mainlayout'
import Likedata from "./pages/Likedata";

const App = () => {
  
  return (
    <>

      <Routes>

        {/* PUBLIC */}
        <Route element={<Publicroute />}>
         <Route path="/" element={<Homepage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/view/:id" element={<View/>}/>
        <Route path="/like" element={<LikeBlog />} />

 
        


        {/* ADMIN ONLY (KEEP YOUR LOGIC SAME) */}
          <Route element={<ProtectedRoute />}>
          <Route element={<Mainlayout/>}>
                      <Route path="/admindashboard" element={<Admindashboard />} />
            <Route path="/allblog" element={<Allblog />} />
            <Route path="/adminblog" element={<Adminblog />} />
            <Route path="/adminblog/:id" element={<Adminblog />} />
            <Route path="/addcategory" element={<AddCategory />} />
            <Route path="/allcategory" element={<Allcategory />} />
            <Route path="/allcategory/:id" element={<Allcategory />} />
            <Route path="/likedata" element={<Likedata/>}/>

            </Route>
            </Route>

        

      </Routes>
    </>
  );
};

export default App;