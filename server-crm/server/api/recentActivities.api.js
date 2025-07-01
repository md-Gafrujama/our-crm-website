import express from "express";
import prisma from "../prisma/prismaClient.js";
import jwtTokenMiddleware from "../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json());

router.get("/", jwtTokenMiddleware , async(req,res)=>{
    try{
        const user = await prisma.user.findMany();
        const company = await prisma.company.findMany();
        const leads = await prisma.Lead.findMany();
        const userCount = await prisma.user.count();
        const leadsCount = await prisma.Lead.count();
        const companyCount = await prisma.company.count();

        //console.log(user,company,leads,"usercount: ",userCount,"leadsCount: ",leadsCount,"company count: ",companyCount);

        res.status(200).json({
           msg :" got data from mongodb",
           userData : user,
           companyData : company,
           leads : leads,
           userNumber : userCount,
           leadsNumber : leadsCount,
           company : companyCount
        })

    }
    catch(e){
        console.log(e);
        res.status(500).send(e);
    }

})

export default router;