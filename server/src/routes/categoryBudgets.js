import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all category budgets for user
router.get('/', auth, async (req, res) => {
    try {
        const items = await prisma.categoryBudget.findMany({
            where: { userId: req.userId },
            orderBy: { category: 'asc' },
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create or update a category budget (upsert)
router.post('/', auth, async (req, res) => {
    try {
        const { category, limit, color } = req.body;
        if (!category) return res.status(400).json({ error: 'Category is required' });

        const item = await prisma.categoryBudget.upsert({
            where: {
                userId_category: { userId: req.userId, category },
            },
            update: {
                ...(limit !== undefined && { limit: parseFloat(limit) }),
                ...(color !== undefined && { color }),
            },
            create: {
                category,
                limit: parseFloat(limit || 0),
                color: color || '#a855f7',
                userId: req.userId,
            },
        });
        res.json(item);
    } catch (err) {
        console.error('Category budget error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a category budget by id
router.put('/:id', auth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.categoryBudget.findFirst({ where: { id, userId: req.userId } });
        if (!existing) return res.status(404).json({ error: 'Category budget not found' });

        const { category, limit, color } = req.body;
        const updated = await prisma.categoryBudget.update({
            where: { id },
            data: {
                ...(category !== undefined && { category }),
                ...(limit !== undefined && { limit: parseFloat(limit) }),
                ...(color !== undefined && { color }),
            },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a category budget
router.delete('/:id', auth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.categoryBudget.findFirst({ where: { id, userId: req.userId } });
        if (!existing) return res.status(404).json({ error: 'Category budget not found' });

        await prisma.categoryBudget.delete({ where: { id } });
        res.json({ message: 'Category budget deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
