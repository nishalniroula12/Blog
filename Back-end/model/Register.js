
import mongoose from 'mongoose'
 
const registers =new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    },
    password:{
        type:String,
        required:true

    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isVerify:{
        type:Boolean,
        default: false
    },
    verifyOtp:{
        type:String,
    },
    expireVerifyOtp:{
        type:Date
    },
    otp:{
        type:String,
    },
    otpExpire:{
        type:Date

    }
},{timestamps:true})
const Register =mongoose.model("register",registers)
export default Register