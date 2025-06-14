import express from "express";
import passport from "passport";

const router = express.Router();

// 🔵 Start Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  (req, res) => {
    // Store session manually
    req.session.user = req.user;
    res.redirect("http://localhost:3000/dashboard");
  }
);

export default router;
