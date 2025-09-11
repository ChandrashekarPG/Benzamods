const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;

      // If role in token is admin, fetch from Admin model
      if (decoded.role === "admin") {
        user = await Admin.findById(decoded.id || decoded._id);
        if (!user) return res.status(401).json({ msg: "Admin not found" });
        user.role = "admin"; // normalize role
      } else {
        // Otherwise, fetch from User model
        user = await User.findById(decoded.id || decoded._id);
        if (!user) return res.status(401).json({ msg: "User not found" });
        user.role = user.role.toLowerCase(); // normalize role
      }

      req.user = user;

      // Check access based on allowed roles
      if (roles.length && !roles.map(r => r.toLowerCase()).includes(user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

module.exports = authMiddleware;
