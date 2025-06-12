import express from "express";
import passport from "passport";

const router = express.Router();

// 🔵 Start Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// ✅ Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://visualexcel.netlify.app/login",
  }),
  (req, res) => {
    // Store session manually
    req.session.user = req.user;
    res.redirect("https://visualexcel.netlify.app/dashboard");
  }
);

export default router;
