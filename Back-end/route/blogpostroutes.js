import express from "express";
import { blogcreate, bloggetdata, blogupdate, deleted, getblogbyid, getlikeblog, like, searchblog, unlike } from "../controller/blogpost.js";
import upload from "../middleware/blog.js";
import { authenticate } from "../middleware/user.js";
const router =express.Router()

router.post("/blogcreates",authenticate,upload.single("image"), blogcreate)
router.get("/getblog",bloggetdata)
router.get("/search",searchblog)


router.post("/like/:id",authenticate,like)
router.delete("/unlike/:id",authenticate,unlike )
router.get("/getlike", authenticate,getlikeblog)




router.get("/blogget/:id",getblogbyid)
router.put("/updateblog/:id",upload.single("image"),blogupdate)
router.delete("/blogdelete/:id" ,deleted)


export default router