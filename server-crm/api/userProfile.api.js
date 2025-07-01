import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json());

router.get("/", jwtTokenMiddleware, async (req, res) => {
    try {
        
        const users = await prisma.user.findMany(); 
        if (!users || users.length === 0) { 
            return res.status(404).json({
                message: "No users found."
            });
        } else {
            return res.status(200).json(users);
        }
    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            error: e.message 
        });
    }
});

export default router;
