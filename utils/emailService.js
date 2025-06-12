// utils/emailService.js
import dotenv from "dotenv";
dotenv.config(); // 👈 Required to load .env in utility files
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
