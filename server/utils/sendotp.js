import nodemailer from "nodemailer";
import { Otp } from "../models/otp.js";

export async function sendOtp(email) {
  // 4-digit random OTP as a string
  const otp = String(Math.floor(1000 + Math.random() * 9000));

  await Otp.findOneAndUpdate(
    { email }, // find by email
    { otp, createdAt: Date.now() }, // update OTP and reset TTL
    { upsert: true, new: true } // create if not found, return new doc
  );

  // transporter setup (Gmail)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "kishanraj420000@gmail.com",
      pass: "yqcl gcox isnu lsbr", // Gmail App Password
    },
  });

  // email options
  const mailOptions = {
    from: "kishanraj420000@gmail.com",
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="font-family:Arial;padding:20px;">
        <h2>🔐 Email Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#2563eb;letter-spacing:4px;">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP "${otp}" sent to ${email}`);
    return otp; // OTP as string
  } catch (error) {
    console.error("Error sending OTP:", error);
    return null;
  }
}

export default sendOtp;
