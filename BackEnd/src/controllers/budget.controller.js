import prisma from "../config/prisma.config.js";
import { handleServerError } from "../utils/error.utils.js";

// GET /api/budget?eventId=  — Get all expenses for an event
export const getExpenses = async (req, res) => {
  try {
    const eventId = parseInt(req.query.eventId);
    if (!eventId) {
      return res.status(400).json({ message: "eventId query parameter is required" });
    }

    // Ownership check
    const event = await prisma.event.findFirst({
      where: { eventId, userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const expenses = await prisma.expense.findMany({
      where: { eventId },
      orderBy: { expenseId: "asc" },
    });

    // Calculate summary totals
    const totalEstimated = expenses.reduce((sum, e) => sum + parseFloat(e.estimatedCost), 0);
    const totalActual = expenses.reduce((sum, e) => sum + parseFloat(e.actualCost), 0);
    const budget = event.budget ? parseFloat(event.budget) : null;

    res.status(200).json({
      expenses,
      summary: {
        budget,
        totalEstimated,
        totalActual,
        remainingBudget: budget !== null ? budget - totalActual : null,
      },
    });
  } catch (err) {
    handleServerError(res, err, "Error fetching expenses");
  }
};

// POST /api/budget  — Add a new expense
export const addExpense = async (req, res) => {
  try {
    const { eventId, name, category, estimatedCost, actualCost } = req.body;

    // Ownership check
    const event = await prisma.event.findFirst({
      where: { eventId: parseInt(eventId), userId: req.user.userId },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const expense = await prisma.expense.create({
      data: {
        eventId: parseInt(eventId),
        name: String(name),
        category: String(category),
        estimatedCost: parseFloat(estimatedCost),
        actualCost: parseFloat(actualCost ?? 0),
      },
    });
    res.status(201).json(expense);
  } catch (err) {
    handleServerError(res, err, "Error adding expense");
  }
};

// GET /api/budget/:expenseId  — Get a specific expense
export const getExpenseById = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);
    const expense = await prisma.expense.findUnique({ where: { expenseId } });

    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Ownership check via event
    const event = await prisma.event.findFirst({
      where: { eventId: expense.eventId, userId: req.user.userId },
    });
    if (!event) return res.status(403).json({ message: "Forbidden" });

    res.status(200).json(expense);
  } catch (err) {
    handleServerError(res, err, "Error fetching expense");
  }
};

// PUT /api/budget/:expenseId  — Update an expense
export const updateExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);
    const { name, category, estimatedCost, actualCost } = req.body;

    const expense = await prisma.expense.findUnique({ where: { expenseId } });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    // Ownership check via event
    const event = await prisma.event.findFirst({
      where: { eventId: expense.eventId, userId: req.user.userId },
    });
    if (!event) return res.status(403).json({ message: "Forbidden" });

    const updated = await prisma.expense.update({
      where: { expenseId },
      data: {
        name: name ? String(name) : undefined,
        category: category ? String(category) : undefined,
        estimatedCost: estimatedCost !== undefined ? parseFloat(estimatedCost) : undefined,
        actualCost: actualCost !== undefined ? parseFloat(actualCost) : undefined,
      },
    });
    res.status(200).json(updated);
  } catch (err) {
    handleServerError(res, err, "Error updating expense");
  }
};

// DELETE /api/budget/:expenseId  — Remove an expense
export const deleteExpense = async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);

    const expense = await prisma.expense.findUnique({ where: { expenseId } });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    const event = await prisma.event.findFirst({
      where: { eventId: expense.eventId, userId: req.user.userId },
    });
    if (!event) return res.status(403).json({ message: "Forbidden" });

    await prisma.expense.delete({ where: { expenseId } });
    res.status(204).send();
  } catch (err) {
    handleServerError(res, err, "Error deleting expense");
  }
};
