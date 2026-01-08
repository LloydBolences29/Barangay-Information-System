const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/db");

//GET SYSTEM SETTINGS
//get all settings
router.get("/all", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const [rows] = await db.execute("SELECT * FROM system_settings");

    return res.status(200).json({
      message: "System settings fetched successfully",
      settings: rows,
    });
  } catch (error) {
    console.log("Error fetching system settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update
router.patch("/update", async (req, res) => {
  const { key, value } = req.body;
  try {
    const db = await connectToDatabase();

    const dbValue = value === true || value === "true" || value === 1 ? 1 : 0;
    await db.execute(
      "UPDATE system_settings SET setting_value = ? WHERE setting_key = ?",
      [dbValue, key]
    );
    res.json({ success: true, savedValue: dbValue });
  } catch (error) {
    console.log("Error updating system settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
