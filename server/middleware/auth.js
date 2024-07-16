const jwd = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer", "");
  if (!token) {
    console.log("Access denied. no token provided.");
    return res.status(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("invalid token.", error);
    res.status(400);
  }
};
module.exports = authenticate;
