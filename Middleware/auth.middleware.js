const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.auth = async (req, res, next) => {
  //req headers   {authorization:token}
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(402).json({ message: "you must login first" });
  }
  try {
    let decode = await promisify(jwt.verify)(authorization, process.env.SECRET);
    console.log(decode);
    req.role = decode.data.role;
    req.id = decode.data.id;

    next();
  } catch (err) {
    res.status(401).json({ message: "you are not authenticated" });
  }
};

exports.restrictTo = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "you are not authorized" });
    } else {
      next();
    }
  };
};
