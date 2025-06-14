import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import authRoutes from "./routes/authRoutes.js";
import googleRoutes from "./routes/googleAuthRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import openRouterRoutes from "./routes/openRouterRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import "./config/passport.js";



const app = express();
app.use(
  cors({
    origin: "https://visualexcel.netlify.app", // ✅ Netlify frontend
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: true,       // ✅ needed for https (Render)
      sameSite: "None",   // ✅ needed for cross-site cookies (Netlify ↔ Render)
      httpOnly: true,
      maxAge: 86400000,
    },
  })
);
app.use(express.json());


// 🧠 MongoDB session store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
});




app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use("/auth", authRoutes);        // Email+Password
app.use("/auth", googleRoutes);      // Google OAuth
app.use("/api/upload", uploadRoutes); // Excel Upload
app.use("/api/contact", contactRoutes); //Contact 
app.use("/api/gemini", openRouterRoutes);  // AI Summarization
app.use("/api/admin", adminRoutes);      // Admin Routes

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
