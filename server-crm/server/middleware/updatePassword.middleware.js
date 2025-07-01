import express from "express"
import prisma from "../prisma/prismaClient.js"
import bcrypt from "bcrypt"
const router = express.Router()

router.post("/", async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  console.log(email,newPassword,confirmPassword)
  if (newPassword === confirmPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
      const updatedUser = await prisma.user.update({
        where: { email: email },
        data: { hashedPassword: hashedPassword },
      });
      return res.status(200).json({ message: "Password updated successfully." }); 
    } catch (e) {
  return res.status(500).json({
    message: e.message || "Server error while updating in DB.",
  });
}
    
  } else {
    console.log("failed to change password")
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }
});


export default router;