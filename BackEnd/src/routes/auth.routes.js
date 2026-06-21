import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { registerSchema } from "../validation/auth.validation.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Public Authentication Routes
router.post("/register", validate(registerSchema), register);
router.post("/login", login);

// Example of a Protected Route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "You are authenticated!", user: req.user });
});

export default router;
