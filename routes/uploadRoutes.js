import express from "express";
import multer from "multer";
import XLSX from "xlsx";

const router = express.Router();
// Multer config (memory storage for in-memory parsing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    const buffer = req.file.buffer;
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetNames = workbook.SheetNames;
    const firstSheet = sheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {
      header: 1,
    });

    // Log parsed data or store it in DB (for now, just send back)
    return res.status(200).json({ success: true, data,  sheets: sheetNames,});
  } catch (err) {
    console.error("Excel parse error:", err);
    return res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
