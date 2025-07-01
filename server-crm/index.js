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

// Updated CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://your-frontend-domain.com'] 
    : 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Content-Disposition']
};

app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 3333;

// Connect to database
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

app.get("/api/protected-route", jwtTokenMiddleware, (req, res) => {
  res.json({
    message: 'Protected route accessed!',
    user: req.user
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    status: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

// 404 handler for unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// For serverless deployment, export the app
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}