// openRouterRoutes.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/summarize", async (req, res) => {
  const { data } = req.body;
  if (!data) return res.status(400).json({ error: "No data provided" });

  const prompt = `Summarize the following Excel data:\n\n${JSON.stringify(data)}`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // or try "mistralai/mixtral-8x7b"
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes Excel data." },
          { role: "user", content: prompt },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://visualexcel.netlify.app", // your frontend domain
          "X-Title": "ExcelAnalytics AI",
        },
      }
    );

    const summary = response.data.choices?.[0]?.message?.content?.trim();
    res.json({ summary });
  } catch (error) {
    console.error("OpenRouter Error:", error.message);
    res.status(500).json({ error: "Failed to summarize using OpenRouter" });
  }
});

export default router;
