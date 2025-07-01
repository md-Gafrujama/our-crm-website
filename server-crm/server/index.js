// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import jwt from 'jsonwebtoken';

// import connectDB from "./prisma/dbConnect.js";

// import signUp from "./api/signUp.api.js";
// import logIn from "./api/logIn.api.js";
// import checkingOTP from "./api/checkingOTP.js";
// import userProfile from "./api/userProfile.api.js";
// import addCustomer from "./api/addCustomer.api.js";
// import updateUserRoutes from "./api/updateUser.js"; 
// import recentActivities from "./api/recentActivities.api.js";
// import loggedData from "./api/loggedData.api.js"
// import addLeads from "./api/addLeads.api.js"
// import udleads from "./api/udleads.api.js"
// import downloadLeadsRouter from './api/downloadLeads.api.js';
// import alertRouter from "./api/alerts&remainder.api.js";
// import changePass from "./api/changePass.api.js";
// import qb2b from "./api/qb2b.api.js"
// import compareb from "./api/compareb.api.js"

// import updatePassword from "./middleware/updatePassword.middleware.js";
// import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js"; 

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:5173', 
//   credentials: true,
//   exposedHeaders: ['Content-Disposition'] 
// }));
// app.use(express.json()); 

// const port =  3333;

// connectDB();

// app.use("/api/signUp", signUp);
// app.use("/api/logIn", logIn);
// app.use("/api/checkingOTP", checkingOTP);
// app.use("/api/allUser", userProfile);
// app.use("/updatePassword", updatePassword);
// app.use("/api/addCustomer", addCustomer);
// app.use("/api", updateUserRoutes); 
// app.use("/api/recent",recentActivities);
// app.use("/api/loggedData",loggedData);
// app.use("/api/leads",addLeads);
// app.use("/api/udleads",udleads);
// app.use('/api/downloadLeads', downloadLeadsRouter);
// app.use("/api/alert",alertRouter);
// app.use("/api/changePass",changePass);
// app.use("/api/quareb2b/form",qb2b);
// app.use("/api/compareb/form",compareb);

// app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
//   res.json({
//     message: 'Protected route accessed!',
//     user: req.user
//   });
// });


// app.get("/", (req, res) => {
//     res.send("Welcome to index page");
// });

// app.listen(port, () => {
//     console.log(`Server is running with port ${port}`);
// });





























import express from "express";
import "dotenv/config";
import cors from "cors";
import jwt from 'jsonwebtoken';

import connectDB from "./prisma/dbConnect.js";

import signUp from "./api/signUp.api.js";
import logIn from "./api/logIn.api.js";
import checkingOTP from "./api/checkingOTP.js";
import userProfile from "./api/userProfile.api.js";
import addCustomer from "./api/addCustomer.api.js";
import updateUserRoutes from "./api/updateUser.js"; 
import recentActivities from "./api/recentActivities.api.js";
import loggedData from "./api/loggedData.api.js"
import addLeads from "./api/addLeads.api.js"
import udleads from "./api/udleads.api.js"
import downloadLeadsRouter from './api/downloadLeads.api.js';
import alertRouter from "./api/alerts&remainder.api.js";
import changePass from "./api/changePass.api.js";
import qb2b from "./api/qb2b.api.js"
import compareb from "./api/compareb.api.js"

import updatePassword from "./middleware/updatePassword.middleware.js";
import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js"; 

const app = express();

// Enhanced CORS configuration for Vercel deployment
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_PROD_URL // Add your production frontend URL here
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());

// Use PORT from environment variables for Vercel, fallback to 3333 for local development
const port = process.env.PORT || 3333;

// Database connection
connectDB();

// API Routes
app.use("/api/signUp", signUp);
app.use("/api/logIn", logIn);
app.use("/api/checkingOTP", checkingOTP);
app.use("/api/allUser", userProfile);
app.use("/updatePassword", updatePassword);
app.use("/api/addCustomer", addCustomer);
app.use("/api", updateUserRoutes); 
app.use("/api/recent", recentActivities);
app.use("/api/loggedData", loggedData);
app.use("/api/leads", addLeads);
app.use("/api/udleads", udleads);
app.use('/api/downloadLeads', downloadLeadsRouter);
app.use("/api/alert", alertRouter);
app.use("/api/changePass", changePass);
app.use("/api/quareb2b/form", qb2b);
app.use("/api/compareb/form", compareb);

// Protected route example
app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed!',
    user: req.user
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to index page");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only when not in Vercel environment
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel
export default app;