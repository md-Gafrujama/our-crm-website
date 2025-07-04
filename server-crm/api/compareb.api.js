import express from "express"
import prisma from "../prisma/prismaClient.js"
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json()); 

router.post("/", async (req, res) => {
  try {
    const { userFirstName, userLastName,comment } = req.body;

     const qb2bform = await prisma.compare.create({
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

router.get("/", jwtTokenMiddleware,async (req, res) => {
  try {
    const comments = await prisma.compare.findMany();
    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching data", error);
    return res.status(500).json({ 
      message: "Internal server error",
    });
  }
});

export default router