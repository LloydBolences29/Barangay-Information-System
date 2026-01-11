const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/db");

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads'); // Adjust path to your project structure
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure Storage (Where to save & what to name it)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files here
  },
  filename: function (req, file, cb) {
    // Create a unique filename (e.g., "barangay-logo-1738492.png")
    // Using a timestamp prevents browser caching issues when you update the logo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'barangay-logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 3. Initialize Multer
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB (optional but recommended)
    fileFilter: (req, file, cb) => {
        // Optional: Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

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

//change barangay name
router.patch("/update-barangay-name", async (req, res) => {
  // 1. Get name AND logo from the request
  let { barangay_name, barangay_logo } = req.body;

  // 2. LOGIC: Set defaults if they are empty/undefined
  if (!barangay_name) {
    barangay_name = "New Barangay"; 
  }
  
  if (!barangay_logo) {
    barangay_logo = "default_logo.png"; // <--- Default logo logic
  }

  try {
    const db = await connectToDatabase();

    // 3. Update SQL to use '?' for the logo too
    //    And add it to the 'ON DUPLICATE KEY UPDATE' section
const sql = `
      INSERT INTO barangayInformation (id, brgyName, brgyLogo) 
      VALUES (1, ?, ?) 
      ON DUPLICATE KEY UPDATE 
      brgyName = VALUES(brgyName),
      -- Only update logo if the NEW value is NOT the default one
      brgyLogo = IF(VALUES(brgyLogo) = 'default_logo.png', brgyLogo, VALUES(brgyLogo))
    `;

    // 4. Pass both variables to the array
    await db.execute(sql, [barangay_name, barangay_logo]);

    return res.status(200).json({ 
        message: "Barangay details updated successfully",
        savedName: barangay_name,
        savedLogo: barangay_logo
    });

  } catch (error) {
    console.log("Error updating barangay info:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Note the middleware: upload.single('barangay_logo')
router.patch("/update-barangay-logo", upload.single('barangay_logo'), async (req, res) => {
  try {
    // 1. Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File Uploaded:", req.file.filename);

    // 2. Prepare the filepath to save in the database
    // Usually, we store just the filename (e.g., "barangay-logo-123.png")
    // or the relative path (e.g., "/uploads/barangay-logo-123.png")
    const logoPath = req.file.filename; 

    const db = await connectToDatabase();

    // 3. Update the database (Upsert logic)
    const sql = `
      INSERT INTO barangayInformation (id, brgyName, brgyLogo) 
      VALUES (1, 'New Barangay', ?) 
      ON DUPLICATE KEY UPDATE 
      brgyLogo = VALUES(brgyLogo)
    `;

    // Note: We are NOT updating the name here, so we only pass the logo
    await db.execute(sql, [logoPath]);

    return res.status(200).json({ 
      message: "Barangay logo updated successfully", 
      logoPath: logoPath 
    });

  } catch (error) {
    console.error("Error updating logo:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


//fetch everything in the barangayInformation table
// GET: Fetch current system settings (Barangay Name, Logo, etc.)
router.get("/get-settings", async (req, res) => {
  try {
    const db = await connectToDatabase();
    
    // We assume ID 1 is always your main settings row
    const [rows] = await db.execute("SELECT * FROM barangayInformation WHERE id = 1");

    if (rows.length > 0) {
      // Return the first row found
      return res.status(200).json(rows[0]); 
    } else {
      // If no settings exist yet, return defaults
      return res.status(200).json({ 
        brgyName: "New Barangay", 
        brgyLogo: "default_logo.png" 
      });
    }

  } catch (error) {
    console.error("Error fetching settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
