import express from 'express'
import {  deleteuser, getuserdata, Login, logout, user } from '../controller/User.js'

const router =express.Router()

router.post("/register",user)
router.get("/get",getuserdata)
router.delete("/remove/:id", deleteuser)

router.post("/login" ,Login)
router.post("/logout",logout)

export default router