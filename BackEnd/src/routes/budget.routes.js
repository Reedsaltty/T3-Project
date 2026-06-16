import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All budget/expense routes are protected — user must be logged in
router.use(authMiddleware);

// GET    /api/budget               — Get all expenses for an event (?eventId=)
router.get("/", (req, res) => { res.sendStatus(501); });

// POST   /api/budget               — Add a new expense to an event
router.post("/", (req, res) => { res.sendStatus(501); });

// GET    /api/budget/:expenseId    — Get a specific expense by ID
router.get("/:expenseId", (req, res) => { res.sendStatus(501); });

// PUT    /api/budget/:expenseId    — Update an expense (e.g. actual cost)
router.put("/:expenseId", (req, res) => { res.sendStatus(501); });

// DELETE /api/budget/:expenseId    — Remove an expense from the budget
router.delete("/:expenseId", (req, res) => { res.sendStatus(501); });

export default router;
