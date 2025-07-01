import express from "express";
import { sendVerificationMail } from "../middleware/authenication.middleware.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js"

const router = express.Router();
router.use(express.json());

let ogOTP = null;

router.post("/send", jwtTokenMiddleware ,async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    ogOTP = otp; 
    //console.log("Generated OTP:", otp);

    await sendVerificationMail(email, otp); 
    return res.status(200).json({ message: "OTP sent to email." });
});

router.post("/", (req, res) => {
    const { otp } = req.body;
    // console.log("Received OTP:", otp);
    // console.log("Stored OTP:", ogOTP);

    if (!otp) {
        return res.status(400).json({ message: "OTP is required." });
    }

    if (otp === ogOTP) {
        return res.status(200).json({ message: "OTP is valid." });
    } else {
        return res.status(400).json({ message: "Invalid OTP." });
    }
});

export default router;
