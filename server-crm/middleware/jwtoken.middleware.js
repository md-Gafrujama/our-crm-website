import jwt from 'jsonwebtoken';
import prisma from "../prisma/prismaClient.js";

const jwtTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.uid || !decoded.role) {
      return res.status(400).json({ message: 'Token payload missing uid or role' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.uid },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      uid: user.id,
      email: user.email,
      userType: decoded.role
    };

    next();
  } catch (error) {
    console.error('JWT error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Authentication failed' });
  }
};

export default jwtTokenMiddleware;