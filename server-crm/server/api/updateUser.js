import express from 'express';
import prisma from '../prisma/prismaClient.js';
import jwtTokenMiddleware from '../middleware/jwtoken.middleware.js';

const router = express.Router();

function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

router.get('/user/:id',  async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/user/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'email',
      'assignedWork',
      'statusOfWork',
      'username',
      'phoneNumber',
      'role',
      'userType',
      'photo'
    ];
    const data = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        data[key] = req.body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });
    res.json(updatedUser);
  } catch (err) {
    // Log the error for debugging
    console.error('Update error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(400).json({ error: err.message });
  }
});

router.delete('/user/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(400).json({ error: err.message });
  }
});

export default router;
