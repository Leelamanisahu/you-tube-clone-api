import express from "express";
import { signin, signup } from "../controller/auth.js";

const router = express.Router();

//Create a User
router.post("/signup", signup);
//sign in
router.post("/signin", signin);
// Google auth
router.post("/google");

export default router;
