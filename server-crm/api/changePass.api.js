import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post('/', jwtTokenMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const userId = req.user.uid; 
    const userEmail = req.user.email;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current and new passwords are required' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, hashedPassword: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;