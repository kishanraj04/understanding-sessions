import express from "express";
import sendOtp from "../utils/sendotp.js";
import { Otp } from "../models/otp.js";

const router = express.Router();

router.post("/send-otp",async(req,res)=>{
    try {
        const {email} = req.body;
        const op =await sendOtp(email);
        if(op) return res.status(200).json({success:true,message:"otp sent"})
    } catch (error) {
     
    }
})

router.post("/verify-otp",async(req,res)=>{
    try {
        const {email,otp} = req.body;
        const isExist = await Otp.findOne({email,otp})
        if(isExist){
            return res.status(200).json({success:true,message:"verified"})
        }
        return res.status(501).json({success:false,message:"unauthorized"})
    } catch (error) {
     
    }
})


export default router;
