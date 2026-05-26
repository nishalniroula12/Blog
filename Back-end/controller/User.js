import Register from "../model/Register.js";
import bcrypt from "bcrypt";
import { generate } from "../utils/generatetoken.js";

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

    const newuser = new Register({
      username,
      email,
      password: hashpassword,
      role,
    });
    await newuser.save();
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
