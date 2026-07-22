import Register from "../model/Register.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generate } from "../utils/generatetoken.js";
import {transporter} from '../config/nodemailer.js'

//Register one
export const user = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "user field required",
      });
    }
    const existing = await Register.findOne({ email });

    if (existing) {
      return res.status(200).json({
        success: false, 
        message: "user already exist",
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const otp =Math.floor(100000 + Math.random() * 900000).toString()

    const newuser = new Register({
      username,
      email,
      password: hashpassword,
      verifyOtp:otp,
      expireVerifyOtp:Date.now() +10 *60*1000,
      role,
    });
    await newuser.save();
    await transporter.sendMail({
      from:process.env.SMTP_SENDER,
      to:email,
      subject:"try this otp",
      text:"how are you",
      html:`hello  ${otp} world`
    })
    res.json({
      success:true,
      message:"user created successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error",
    });
  }
};
export const getuserdata = async (req, res) => {
  try {
    const users = await Register.find();
    res.status(200).json({
      success: true,
      message: "get user",
      users,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deleteuser = async (req, res) => {
  try {
    const { id } = req.params;
    await Register.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "userdeleted",
    });
  } catch (error) {
    console.log(error);
  }
};

//login user

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "all field requried",
      });
    const user = await Register.findOne({ email });
    console.log(user);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match)
      return res.status(400).json({
        success: false,
        message: "invalid password",
      });
    const tokens = generate({ id: user._id }, process.env.secret, "7d");
    res.cookie("tokens", tokens, {
      httpOnly: true,
      secure: false,
      semeSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(tokens);
    return res.status(200).json({
      success: true,
      message: "user login successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      tokens,
    });
  } catch (error) {
    console.log(error);
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("tokens", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(200).json({
      success: false,
      message: "Server error",
    });
  }
};
export const verifyotped =async(req,res)=>{
  try {
    const {email ,otp} =req.body
    const user =await Register.findOne({email})
    if(!user){
      return res.status(400).json({
        success:false,
        message:"user not found"
      })
    }
    if(Date.now() >user.expireVerifyOtp){
      return res.status(400).json({
        success:false,
        message:"opt expired"
      })
    }
    if(user .verifyOtp !==otp){
      return res.status(400).json({
        success:false,
        message:"Invalid otp"
      })
    }
    user.isVerify=true,
    user.verifyOtp=null,
    user.expireVerifyOtp=null,

    await user.save()
    return res.status(200).json({
      success:true,
      message:"Email  verified successfully"
    })

    
  } catch (error) {
    console.log(error)
    
  }
}
export const forgetpass =async(req,res)=>{
  try {
    const {email} =req.body
    const user =await Register.findOne({email})
    if(!user){
    return res.status(401).json({
      success:false,
      message:"user not found"
    })  
  }

  const otp =Math.floor(100000 + Math.random() * 900000).toString()
  user.otp = otp,
  user.otpExpire=Date.now() + 10 *60 *1000

  await user.save()

  await transporter.sendMail({
    from: process.env.SMPT_USER,
    to:user.email,
    subject:"Reset password",
    html: `
        <p>Your reset token is:</p>
        <h2>${otp}</h2>
        <p>This token expires in 10 minutes.</p>
      `,
    });

   res.status(200).json({
    success:true,
    message:"password link sent"
  })
}


   catch (error) {
    console.log(error)
    
  }

}
export const resetpassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await Register.findOne({
      otp: token,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
  }
};