import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleWare.js";

const router = express.Router();

// Public Authentication Routes
router.post("/register", register);
router.post("/login", login);

// Example of a Protected Route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "You are authenticated!", user: req.user });
});

export default router;
