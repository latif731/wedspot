// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken"

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming you store the token in a cookie

  if (!token) {
    return res.status(401).json({ message: "Token not found. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach the user data to the request object
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default verifyToken;