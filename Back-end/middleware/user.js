import jwt from "jsonwebtoken";
import Register from "../model/Register.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.tokens;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decode = jwt.verify(token, process.env.secret);

    const user = await Register.findById(decode.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export const adminonly = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied (admin only)",
    });
  }
};