import apiClient from "./axios";

// ==========================================
// Budget / Expenses Endpoints (/api/budget)
// ==========================================

// GET /api/budget?eventId= — Get all expenses + budget summary for an event
export const getExpenses = async (eventId) => {
    try {
        const res = await apiClient.get("/budget", { params: { eventId } });
        return res.data;
    } catch (err) {
        console.error("Budget API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// POST /api/budget — Add a new expense to an event
export const addExpense = async (expenseData) => {
    try {
        const res = await apiClient.post("/budget", expenseData);
        return res.data;
    } catch (err) {
        console.error("Budget API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// GET /api/budget/:expenseId — Get a specific expense
export const getExpenseById = async (expenseId) => {
    try {
        const res = await apiClient.get(`/budget/${expenseId}`);
        return res.data;
    } catch (err) {
        console.error("Budget API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// PUT /api/budget/:expenseId — Update an expense (e.g. fill in actual cost)
export const updateExpense = async (expenseId, expenseData) => {
    try {
        const res = await apiClient.put(`/budget/${expenseId}`, expenseData);
        return res.data;
    } catch (err) {
        console.error("Budget API error", err.response?.data?.message || err.message);
        throw err;
    }
};

// DELETE /api/budget/:expenseId — Remove an expense
export const deleteExpense = async (expenseId) => {
    try {
        const res = await apiClient.delete(`/budget/${expenseId}`);
        return res.data;
    } catch (err) {
        console.error("Budget API error", err.response?.data?.message || err.message);
        throw err;
    }
};
