const jwt = require("jsonwebtoken");

const authMiddleware = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({message: "Access denied. no token provided"})
  }
  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user =  decoded;
    next();
  }catch(err){
    return res.status(400).json({message:"Invalid or expired token"});
  }
};
module.exports = {authMiddleware}