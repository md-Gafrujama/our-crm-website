import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; 

router.post("/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ((!email && !username) || !password) {
      return res.status(400).json({
        message: "Email/username and password are required"
      });
    }

  
    // gmail users signin nhi kar payenge
    // const pp = email.split('@')
    // if(pp[1] === "gmail.com")
    // {
    //   return res.status(400).json({
    //     message: "Invalid Email"
    //   });
    // }

    // const isEnvAdmin =
    //   email === process.env.ADMIN_EMAIL &&
    //   username === process.env.ADMIN_USERNAME &&
    //   password === process.env.ADMIN_PASSWORD;

    // if (isEnvAdmin) {
    //   const token = jwt.sign(
    //     {
    //       uid: "env-admin",
    //       username: process.env.ADMIN_USERNAME,
    //       email: process.env.ADMIN_EMAIL,
    //       role: "admin"
    //     },
    //     JWT_SECRET,
    //     { expiresIn: "1h" }
    //   );

    //   return res.status(200).json({
    //     message: "Login successful (.env admin)",
    //     user: {
    //       id: "env-admin",
    //       username: process.env.ADMIN_USERNAME,
    //       email: process.env.ADMIN_EMAIL,
    //       firstName: "Admin",
    //       lastName: "User",
    //       role: "admin"
    //     },
    //     token,
    //     userType: "admin"
    //   });
    // }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { username: username || undefined }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        uid: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({
      message: "Login successful (DB)",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token,
      userType: user.role
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;
