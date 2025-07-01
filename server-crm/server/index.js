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

// Import all your routes
import signUp from "./api/signUp.api.js";
import logIn from "./api/logIn.api.js";
import checkingOTP from "./api/checkingOTP.js";
import userProfile from "./api/userProfile.api.js";
import addCustomer from "./api/addCustomer.api.js";
import updateUserRoutes from "./api/updateUser.js"; 
import recentActivities from "./api/recentActivities.api.js";
import loggedData from "./api/loggedData.api.js";
import addLeads from "./api/addLeads.api.js";
import udleads from "./api/udleads.api.js";
import downloadLeadsRouter from './api/downloadLeads.api.js';
import alertRouter from "./api/alerts&remainder.api.js";
import changePass from "./api/changePass.api.js";
import qb2b from "./api/qb2b.api.js";
import compareb from "./api/compareb.api.js";

// Import middlewares
import updatePassword from "./middleware/updatePassword.middleware.js";
import jwtTokenMiddleware from "./middleware/jwtoken.middleware.js"; 

const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_PROD_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Body parser with size limit (to prevent FUNCTION_PAYLOAD_TOO_LARGE)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection with error handling
connectDB().catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

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

// Health check endpoint for Vercel
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    status: "running",
    documentation: process.env.API_DOCS_URL || 'No docs URL set'
  });
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  // Handle CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({ 
      error: 'Forbidden',
      message: err.message 
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Invalid token' 
    });
  }

  // Handle payload too large errors
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: 'Payload Too Large',
      message: 'Request body exceeds allowed limit' 
    });
  }

  // Default error handler
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong' 
  });
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Server configuration
const port = process.env.PORT || 3333;

// Start server only when not in Vercel environment
if (process.env.VERCEL !== "1") {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Handle server timeouts (to prevent FUNCTION_INVOCATION_TIMEOUT)
  server.setTimeout(10 * 1000); // 10 seconds
}

// Export for Vercel
export default app;