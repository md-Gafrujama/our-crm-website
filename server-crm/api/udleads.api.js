import express from "express";
import prisma from "../prisma/prismaClient.js";
const router = express.Router();

// Delete lead by ID with error handling
router.delete("/delete-lead/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const lead = await prisma.lead.delete({
            where: { id: id }
        });
        res.status(200).json(lead);
    } catch (error) {
        if (error.code === 'P2025') { // Prisma not found error
            res.status(404).json({ error: "Lead not found" });
        } else {
            res.status(500).json({ error: "Failed to delete lead", details: error.message });
        }
    }
});

// Update lead by ID with error handling
router.put("/update-lead/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { id: _id, ...updateData } = req.body;
        console.log("updateData", updateData); // Add this line
        const lead = await prisma.lead.update({
            where: { id: id },
            data: updateData
        });
        res.status(200).json(lead);
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: "Lead not found" });
        } else {
            res.status(500).json({ error: "Failed to update lead", details: error.message });
        }
    }
});

export default router;






