import jwt from 'jsonwebtoken'
import Register from '../model/Register.js';
  
export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.tokens ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

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

  export const adminauth = (req, res, next) => {
    if (req.user?.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "access denied",
      });
    }
  };
