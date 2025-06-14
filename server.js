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
app.set("trust proxy", 1); // ✅ Enables secure cookies behind Render's proxy
app.use(express.json());


// ✅ Define session store BEFORE using it
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
});

// ✅ Session middleware (after store is defined)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: true,       // for HTTPS (Render)
      sameSite: "None",   // for cross-origin
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// ✅ CORS middleware
app.use(
  cors({
    origin: "https://visualexcel.netlify.app",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/auth", googleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/gemini", openRouterRoutes);
app.use("/api/admin", adminRoutes);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// ✅ Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
