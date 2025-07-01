import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();

router.post("/", jwtTokenMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const {
      cid = "0",
      alerttopic,
      reminder,
      alertdate,
      remindertime, 
      description,
    } = req.body;

  
    const alertData = await prisma.alertsandremainder.create({
      data: {
        uid,
        cid,
        topic: alerttopic,
        remainder: reminder,
        date: new Date(alertdate),
        time: remindertime,
        description,
      },
    });

    console.log("alert added", alertData);
    res.status(200).json(alertData);

  } catch (error) {
    console.error("Unable to add alert in server for now:", error);
    res.status(500).json({
      msg: error.message || "Internal server error",
    });
  }
});

export default router;
