import express from "express"
import prisma from "../prisma/prismaClient.js"

const router = express.Router();
router.use(express.json()); 
router.post("/", async (req, res) => {
  try {
    const { userFirstName, userLastName,comment } = req.body;

     const qb2bform = await prisma.QB2b.create({
      data: {
        firstName :userFirstName,
        lastName : userLastName,
        comment,
      },
    });

     return res.status(201).json({
      message: "Your comment has been send.",
    });

  } catch (error) {
    console.error("Something went wrong", error);
    return res.status(500).json({ 
      message: "Internal server error",
    });
  }
});

export default router