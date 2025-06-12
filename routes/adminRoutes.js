// routes/adminRoutes.js
import express from "express";
import User from "../models/User.js"; // if not exists, create one
const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
