import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";
import dotenv from "dotenv";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json());

router.post("/", jwtTokenMiddleware , async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        companyName,
        gstNumber,
        plan,
        agreeToterms,
        timezone,
        couponCode
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);    
    const altTimeZone = timezone.altName;

    const existingCompany = await prisma.company.findFirst({
        where: {
            OR: [
                { companyName },
                { GSTNumber: gstNumber },
                { email }
            ]
        }
    });

    let planDetails = null;
    const trialDays = 7; 

    switch (plan) {
        case "Basic":
            planDetails = {
                planName: "Basic",
                price: "$0.00",
                users: 2,
                trialDays: trialDays,
                remainingDays: trialDays,
            };
            break;
        case "Silver":
            planDetails = {
                planName: "Silver",
                price: "¥1000.00",
                users: 2,
                trialDays: trialDays,
                remainingDays: trialDays
            };
            break;
        case "Gold":
            planDetails = {
                planName: "Gold",
                price: "¥1500.00",
                users: 3,
                trialDays: trialDays,
                remainingDays: trialDays
            };
            break;
        case "Platinum":
            planDetails = {
                planName: "Platinum",
                price: "¥2000.00",
                users: 4,
                trialDays: trialDays,
                remainingDays: trialDays
            };
            break;
        case "Diamond":
            planDetails = {
                planName: "Diamond",
                price: "¥2500.00",
                users: 6,
                trialDays: trialDays,
                remainingDays: trialDays
            };
            break;
        case "Diamond Pro":
            planDetails = {
                planName: "Diamond Pro",
                price: "¥3950.00",
                users: 6,
                trialDays: trialDays,
                remainingDays: trialDays
            };
            break;
        default:
            return res.status(400).json({
                message: "Invalid plan selected"
            });
    }
    let agreeToterm;
    if(agreeToterms==="true")
    {
        agreeToterm=true
    }
    else{
        agreeToterm=false
    }

    const companyMetaData = {
        companyName,
        GSTNumber: gstNumber,
        firstName,
        lastName,
        email,
        hashedPassword,
        phone,
        timeZone:altTimeZone,
        couponCode : couponCode || "0",
        agreeToterms:agreeToterm,
        plan: JSON.stringify(planDetails), 
        remainingDays: planDetails.remainingDays,
        paidStatus: false,  // false => trial version :: true => bought the package
        role: "admin"
    };

    const companyMetaDataForLogIn = {
        username: companyName,
        firstName,
        lastName,
        email,
        hashedPassword,
        phone,
        role: "admin"
    };

    if (existingCompany) {
        return res.status(200).json({
            message: "There is already a company with this name or GST number",
        });
    } else {
        try {
            const createCompanyRecord = await prisma.company.create({
                data: companyMetaData
            });

            await prisma.user.create({
            data: {
                    firstName,
                    lastName,
                    username: companyName,
                    email,
                    hashedPassword, 
                    phoneNumber: phone,
                    role: "admin",
                    photo: null 
                }
            });

            return res.status(201).json({
                message: "User  created successfully",
                user: {
                    id: createCompanyRecord.id,
                    companyName: createCompanyRecord.companyName,
                    email: createCompanyRecord.email,
                    createdAt: createCompanyRecord.createdAt
                }
            });
        } catch (e) {
            console.error(e); 
            return res.status(500).json({
                message: "Something went wrong in server while registering a place in CRM for your company. Try again.",
            });
        }
    }
});

export default router;
