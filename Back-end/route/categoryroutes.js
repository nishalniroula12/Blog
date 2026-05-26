import express from "express";
import { createcatgory, deletecategory, getalldata, getdatabyid, updatecategory } from "../controller/Category.js";
import { authenticate,adminonly } from "../middleware/user.js";

const router = express.Router();


router.post("/createcategory", authenticate,adminonly,createcatgory);
router.get("/getdata",authenticate,adminonly,getalldata)
router.get("/getcategory/:id",authenticate,adminonly,getdatabyid)
router.put("/updatecategory/:id",authenticate,adminonly,updatecategory)
router.delete("/delete/:id",authenticate,adminonly,deletecategory)

export default router;
