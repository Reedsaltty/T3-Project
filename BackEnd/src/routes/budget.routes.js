import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addExpenseSchema, updateExpenseSchema } from "../validation/budget.validation.js";
import {
  getExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.use(authMiddleware);

// GET    /api/budget?eventId=   — Get all expenses + budget summary for an event
router.get("/", getExpenses);

// POST   /api/budget            — Add a new expense to an event
router.post("/", validate(addExpenseSchema), addExpense);

// GET    /api/budget/:expenseId — Get a specific expense
router.get("/:expenseId", getExpenseById);

// PUT    /api/budget/:expenseId — Update an expense (e.g. fill in actual cost)
router.put("/:expenseId", validate(updateExpenseSchema), updateExpense);

// DELETE /api/budget/:expenseId — Remove an expense
router.delete("/:expenseId", deleteExpense);

export default router;
