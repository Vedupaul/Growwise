import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import wishlistRoutes from './routes/wishlist.js';
import budgetRoutes from './routes/budget.js';
import categoryBudgetRoutes from './routes/categoryBudgets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/category-budgets', categoryBudgetRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'GrowWise API is running' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 GrowWise server running on http://localhost:${PORT}`);
    });
}

export default app;
