import express from "express";
import { transporter } from "../utils/emailService.js";
import mongoose from "mongoose";

const router = express.Router();

// Schema (Optional: Save to MongoDB)
const ContactMessage = mongoose.model("ContactMessage", new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
}));

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    // Save to MongoDB
    await ContactMessage.create({ name, email, message });

    // Send Email to Admin (you)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `📨 New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

export default router;
