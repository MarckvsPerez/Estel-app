import express from "express";

import { signup, login, updateProfile, checkAuth } from "@/controllers/auth.controller";
import { protectRoute } from "@/middlewares/auth.middleware";
import { validateLogin, validateSignup, validateUpdateProfile } from "@/validators/auth.validator";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);


router.put("/update-profile", protectRoute, validateUpdateProfile, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;  

