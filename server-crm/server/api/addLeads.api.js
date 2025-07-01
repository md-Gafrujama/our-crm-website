import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js"

const router = express.Router();

function convertStringToISODateString(dateString) {
  if (!dateString) return null;
  
  try {
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      console.error("Invalid date.");
      return null;
    }
    return dateObject.toISOString();
  } catch (error) {
    console.error("Date conversion error:", error);
    return null;
  }
}

router.post('/', jwtTokenMiddleware, async (req, res) => {
  try {
    const { uid } = req.user;
    const {
      title,
      customerFirstName,
      customerLastName,
      emailAddress,
      phoneNumber,
      companyName,
      jobTitle,
      topicOfWork,
      industry,              
      status,                 
      serviceInterestedIn,    
      closingDate,
      notes
    } = req.body;


    const closingDateISO = convertStringToISODateString(closingDate);
    if (closingDateISO === null) {
      return res.status(400).json({ error: "Invalid closingDate provided." });
    }

    const newLead = await prisma.lead.create({
      data: {
        uid,
        cid: "0",
        title,
        customerFirstName,
        customerLastName,
        emailAddress,
        phoneNumber,
        companyName,
        jobTitle,
        topicOfWork,
        industry,
        status,
        serviceInterestedIn,
        closingDate: closingDateISO,
        notes
      },
    });

    res.status(201).json(newLead);

  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
  console.log("POSTexecuted");
});

export default router;
