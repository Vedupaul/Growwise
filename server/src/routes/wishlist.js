import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all wishlist items
router.get('/', auth, async (req, res) => {
    try {
        const items = await prisma.wishlistItem.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create wishlist item
router.post('/', auth, async (req, res) => {
    try {
        const { name, price, link, priority } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ error: 'Name and price are required' });
        }
        const item = await prisma.wishlistItem.create({
            data: {
                name,
                price: parseFloat(price),
                link: link || null,
                priority: priority || 'Medium',
                userId: req.userId,
            },
        });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update wishlist item
router.put('/:id', auth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.wishlistItem.findFirst({ where: { id, userId: req.userId } });
        if (!existing) return res.status(404).json({ error: 'Item not found' });

        const { name, price, link, priority, purchased } = req.body;
        const updated = await prisma.wishlistItem.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price: parseFloat(price) }),
                ...(link !== undefined && { link }),
                ...(priority !== undefined && { priority }),
                ...(purchased !== undefined && { purchased }),
            },
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete wishlist item
router.delete('/:id', auth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.wishlistItem.findFirst({ where: { id, userId: req.userId } });
        if (!existing) return res.status(404).json({ error: 'Item not found' });

        await prisma.wishlistItem.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
