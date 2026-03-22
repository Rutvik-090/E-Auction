// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized, No token",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decoded.id).select("-password");

//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     console.log("Decoded:", decoded);
//     console.log("User:", req.user);

//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: "Not Authorized" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // ✅ FIX HERE
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

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.log("ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not Authorized",
    });
  }
};
