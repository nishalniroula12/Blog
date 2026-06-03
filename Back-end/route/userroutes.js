import express from 'express'
import {  deleteuser, forgetpass, getuserdata, Login, logout, resetpassword, user, verifyotped } from '../controller/User.js'

const router =express.Router()

router.post("/register",user)
router.get("/get",getuserdata)
router.delete("/remove/:id", deleteuser)

router.post("/login" ,Login)
router.post("/logout",logout)
router.post("/check", verifyotped)
router.post("/forget" ,forgetpass)
router.post("/reset" ,resetpassword)

export default router