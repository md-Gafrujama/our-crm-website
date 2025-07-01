import nodemailer from "nodemailer";
import prisma from "../prisma/prismaClient.js";

async function checking(mail) {
    try {
        const verifying = await prisma.user.findFirst({
            where: {
                email: mail,
            },
        });
        if (verifying) {
            console.log(`User found with email: ${mail}`);
            return true;
        } else {
            console.log(`No user found with email: ${mail}`);
            return false;
        }
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
}

async function mailer(mailling, otp) {
    // const transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.PASSWORD,
    //     },
    //     connectionTimeout: 1 * 60 * 1000,
    //     socketTimeout: 1 * 60 * 1000,
    // });

    // try {
    //     await transporter.sendMail({
    //         from: process.env.EMAIL,
    //         to: mailling,
    //         subject: "Verify it's you....",
    //         text: `Your OTP is ${otp}`,
    //     });
    //     console.log("Message sent");
    // } catch (error) {
    //     console.log("Error sending mail:", error);
    //     throw error;
    // }
    console.log(otp)
}

export async function sendVerificationMail(mailling, otp) {
    try {
        const isUserValid = await checking(mailling);
        if (!isUserValid) {
            return { success: false, status: 404, message: "There is no such email" };
        }
        await mailer(mailling, otp);
        return { success: true, status: 200, message: "OTP sent successfully" };
    } catch (error) {
        return { success: false, status: 500, message: "Failed to send OTP", error: error.message };
    }
}

