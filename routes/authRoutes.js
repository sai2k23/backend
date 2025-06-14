import passport from "passport";
import express from "express";
import User from "../models/User.js";
const router = express.Router();
import jwt from "jsonwebtoken";
import { transporter } from "../utils/emailService.js";


// ✅ Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed due to server error" });
  }
});


// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    // ✅ Use Passport to login session properly
    req.login(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      res.status(200).json({ user });
    });
  } catch (err) {
    console.error("Login route error:", err);
    res.status(500).json({ message: "Login error" });
  }
});


// ✅ Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out" });
  });
});

// ✅ Get Current User
router.get("/user", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session content:", req.session);
  console.log("Current logged-in user:", req.user);
  res.json({ user: req.user || null });
});




// ✅ Forgot Password - send email
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found with that email" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, {
      expiresIn: "15m",
    });

    const resetUrl = `https://visualexcel.netlify.app/reset-password/${token}`;

    const mailOptions = {
      from: `ExcelAnalytics <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hi ${user.name || "User"},</p>
        <p>You requested to reset your password.</p>
        <p><a href="${resetUrl}">Click here to reset</a> (valid for 15 mins)</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Failed to send reset link" });
  }
});

// ✅ Reset Password - save new password
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

export default router;
