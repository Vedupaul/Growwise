import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all expenses for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create expense
router.post('/', auth, async (req, res) => {
    try {
        const { title, amount, category, dueDate, status } = req.body;
        if (!title || amount === undefined) {
            return res.status(400).json({ error: 'Title and amount are required' });
        }
        const expense = await prisma.expense.create({
            data: {
                title,
                amount: parseFloat(amount),
                category: category || 'Other',
                dueDate: dueDate || null,
                status: status || 'Pending',
                userId: req.userId,
            },
        });
        res.status(201).json(expense);
    } catch (err) {
        console.error('Create expense error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.expense.findFirst({ where: { id, userId: req.userId } });
        if (!existing) return res.status(404).json({ error: 'Expense not found' });

        const { title, amount, category, dueDate, status } = req.body;
        const updated = await prisma.expense.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(amount !== undefined && { amount: parseFloat(amount) }),
                ...(category !== undefined && { category }),
                ...(dueDate !== undefined && { dueDate }),
                ...(status !== undefined && { status }),
            },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.expense.findFirst({ where: { id, userId: req.userId } });
        if (!existing) return res.status(404).json({ error: 'Expense not found' });

        await prisma.expense.delete({ where: { id } });
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
