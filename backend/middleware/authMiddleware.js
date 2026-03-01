import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized, No token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne(decoded.id).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};
