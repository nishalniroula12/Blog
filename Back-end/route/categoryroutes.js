import express from "express";
import { createcatgory, deletecategory, getalldata, getdatabyid, updatecategory } from "../controller/Category.js";
import { authenticate } from "../middleware/user.js";

const router = express.Router();


router.post("/createcategory", authenticate,createcatgory);
router.get("/getdata",authenticate,getalldata)
router.get("/getcategory/:id",authenticate,getdatabyid)
router.put("/updatecategory/:id",authenticate,updatecategory)
router.delete("/delete/:id",authenticate,deletecategory)

export default router;
