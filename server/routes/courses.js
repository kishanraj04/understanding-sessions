import express from "express";
import Course from "../models/Course.js";
import Session from "../models/Session.js";

const router = express.Router();

// GET all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    //guest session
    const {sessio_id} = req.signedCookies
    if(!sessio_id){
      const {_id} =await Session.create({cart:[]});

    res.cookie('sessio_id',_id,{
      maxAge:1000*60*60*60,
      signed:true
    })
    }
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
