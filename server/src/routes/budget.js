import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get budget for user
router.get('/', auth, async (req, res) => {
    try {
        let budget = await prisma.budget.findUnique({ where: { userId: req.userId } });
        if (!budget) {
            budget = await prisma.budget.create({
                data: { userId: req.userId, weeklyBudget: 12000, monthlyBudget: 50000, income: 85000 },
            });
        }
        res.json(budget);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update budget
router.put('/', auth, async (req, res) => {
    try {
        const { weeklyBudget, monthlyBudget, income } = req.body;
        const budget = await prisma.budget.upsert({
            where: { userId: req.userId },
            update: {
                ...(weeklyBudget !== undefined && { weeklyBudget: parseFloat(weeklyBudget) }),
                ...(monthlyBudget !== undefined && { monthlyBudget: parseFloat(monthlyBudget) }),
                ...(income !== undefined && { income: parseFloat(income) }),
            },
            create: {
                userId: req.userId,
                weeklyBudget: parseFloat(weeklyBudget || 12000),
                monthlyBudget: parseFloat(monthlyBudget || 50000),
                income: parseFloat(income || 85000),
            },
        });
        res.json(budget);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
