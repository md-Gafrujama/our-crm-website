// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import prisma from "../prisma/prismaClient.js";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// const JWT_SECRET = process.env.JWT_SECRET; 

// // Changed from "/" to "/logIn" to match your frontend endpoint
// router.post("/", async (req, res) => {
//   try {
//     const { email, username, password } = req.body;
//     if ((!email && !username) || !password) {
//       return res.status(400).json({
//         message: "Email/username and password are required"
//       });
//     }

//     const user = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { email: email || undefined },
//           { username: username || undefined }
//         ]
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ message: "No such user exists" });
//     }

//     const validPassword = await bcrypt.compare(password, user.hashedPassword);
//     if (!validPassword) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       {
//         uid: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role
//       },
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );
    
//     return res.status(200).json({
//       message: "Login successful (DB)",
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         role: user.role
//       },
//       token,
//       userType: user.role
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// });

// export default router;

import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;

// Pre-compile JWT options for better performance
const JWT_OPTIONS = { expiresIn: "1h" };

// Validation helper
const validateInput = (email, username, password) => {
  return (email || username) && password;
};

// Optimized user query with selective field retrieval
const getUserByCredentials = async (email, username) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : undefined,
        username ? { username } : undefined
      ].filter(Boolean)
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      hashedPassword: true
    }
  });
};

// Main login route
router.post("/", async (req, res) => {
  const { email, username, password } = req.body;
  
  // Early validation
  if (!validateInput(email, username, password)) {
    return res.status(400).json({
      message: "Email/username and password are required"
    });
  }

  try {
    // Fetch user with optimized query
    const user = await getUserByCredentials(email, username);
    
    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token with pre-compiled options
    const token = jwt.sign(
      {
        uid: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      JWT_OPTIONS
    );

    // Prepare response data (excluding hashedPassword)
    const { hashedPassword, ...userResponse } = user;

    return res.status(200).json({
      message: "Login successful (DB)",
      user: userResponse,
      token,
      userType: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;