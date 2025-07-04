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
import rateLimit from "express-rate-limit";

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

// Rate limiting to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true
});

router.post("/logIn", loginLimiter, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Input validation
    if ((!email && !username) || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required"
      });
    }

    // Find user with case-insensitive search
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email || undefined, mode: 'insensitive' } },
          { username: { equals: username || undefined, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        hashedPassword: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" // Generic message for security
      });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" // Generic message for security
      });
    }

    // Create JWT token
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

    // Set secure cookie (alternative to localStorage)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000 // 1 hour
    });

    // Return success response without sensitive data
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token, // Still returning token for flexibility (consider removing in production)
      expiresIn: 3600 // Token expiry in seconds
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
});

export default router;