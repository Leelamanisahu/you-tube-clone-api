import jwt from "jsonwebtoken";
import { creatError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(creatError(401, "you are not authenticated"));

  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) return next(creatError(403, "Token is not valid"));
    req.user = user;
    next();
  });
};
