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

// // Updated CORS configuration
// app.use(cors({
//   origin: ['https://our-crm-website-rnhs.vercel.app', 'http://localhost:3000'], // Removed trailing slash
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Disposition'] 
// }));

// app.use(express.json()); 

// connectDB();

// // API routes
// app.use("/api/signUp", signUp);
// app.use("/api/logIn", logIn);
// app.use("/api/checkingOTP", checkingOTP);
// app.use("/api/allUser", userProfile);
// app.use("/updatePassword", updatePassword);
// app.use("/api/addCustomer", addCustomer);
// app.use("/api", updateUserRoutes); 
// app.use("/api/recent", recentActivities);
// app.use("/api/loggedData", loggedData);
// app.use("/api/leads", addLeads);
// app.use("/api/udleads", udleads);
// app.use('/api/downloadLeads', downloadLeadsRouter);
// app.use("/api/alert", alertRouter);
// app.use("/api/changePass", changePass);
// app.use("/api/quareb2b/form", qb2b);
// app.use("/api/compareb/form", compareb);

// app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
//   res.json({
//     message: 'Protected route accessed!',
//     user: req.user
//   });
// });

// app.get("/", (req, res) => {
//   res.send("Welcome to index page");
// });

// // Vercel will provide the port automatically
// const port = process.env.PORT || 3333;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// // Export the Express API for Vercel
// export default app;






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

// Enhanced CORS configuration
const allowedOrigins = [
  'https://our-crm-website-rnhs.vercel.app',
  'https://our-crm-website.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      const msg = `CORS policy: ${origin} not allowed`;
      return callback(new Error(msg), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Connect to database
connectDB();

// API routes
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
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to CRM Backend API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export for Vercel
export default app;