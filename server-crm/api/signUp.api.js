import express from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";
import { upload, uploadToCloudinary } from "../utilis/fileUpload.js";
import path from 'path';
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";
import corsMiddleware from "../middleware/cors.middleware.js";
// const router = express.Router();
// router.use((req, res, next) => {
//   // res.header('Access-Control-Allow-Origin', 'https://our-crm-website-99fa.vercel.app , http://localhost:5173, https://our-crm-website.vercel.app'); 
//   res.header('Access-Control-Allow-Origin', 'https://our-crm-website-99fa.vercel.app'); 
//   res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
//   res.header('Access-Control-Allow-Methods', 'GET POST PUT DELETE OPTIONS');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

const router = express.Router();

router.use(corsMiddleware); // Use the CORS middleware


router.post("/", upload.single('profilePhoto'),  uploadToCloudinary, async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, phone, role } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !phone || !role) {
      return res.status(400).json({ 
        message: "All fields are required.",
        requiredFields: ["firstName", "lastName", "username", "email", "password", "phone", "role"]
      });
    }

    // if (!email.includes('@') || !email.includes('.') || email.includes("gmail")) {
    //   return res.status(400).json({ message: "Invalid email format." });
    // }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "User already exists",
        conflict: existingUser.username === username ? "username" 
                 : existingUser.email === email ? "email" 
                 : "phone"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      firstName,
      lastName,
      username,
      email,
      hashedPassword,
      phoneNumber: phone,
      role,
      photo: req.cloudinaryUrl || null
    };
    console.log(userData)

    const user = await prisma.user.create({
      data: userData
    });

     return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo, 
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});
export default router;