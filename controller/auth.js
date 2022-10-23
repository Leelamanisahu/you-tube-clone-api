import mongoose from "mongoose";
import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import { creatError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const user = new User({ ...req.body, password: hash });

    await user.save();
    res.status(200).send("User has been created");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return next(creatError(404, "User not found"));
    }
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      return next(creatError(400, "Wrong Credential"));
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRETKEY);
    const { password, ...others } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {}
};