const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/db");

router.get("/all-stats", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const sql = `
            SELECT 
                (SELECT COUNT(*) FROM resident_info WHERE resident_status = 'active') AS total_active_residents,
                (SELECT COUNT(*) FROM resident_info WHERE resident_status = 'inactive') AS total_inactive_residents,
                (SELECT COUNT(*) FROM households) AS total_households,
                (SELECT COUNT(*) FROM resident_info WHERE DATE(created_at) = CURDATE()) AS resident_added_today,
                (SELECT COUNT(*) FROM resident_info WHERE sex = 'male') AS total_male_residents,
                (SELECT COUNT(*) FROM resident_info WHERE sex = 'female') AS total_female_residents
        `;

    const [rows] = await db.execute(sql, []);
    const stats = rows[0];
    return res.status(200).json(stats);
  } catch (error) {
    console.log("Error fetching stats:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

//get the number of resident added per day for the last 7 days, week or month
router.get("/number-of-added-residents", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { period } = req.query;

    let sql = "";

    if (period === "monthly") {
      sql = `SELECT 
          DATE_FORMAT(created_at, '%Y-%m-%d') as label, 
          COUNT(*) as count 
        FROM resident_info 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC`;
    }

    else if (period === "weekly") {
        sql = `
        SELECT 
          DATE_FORMAT(created_at, 'Week %u %Y') as label, 
          COUNT(*) as count 
        FROM resident_info 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 WEEK)
        GROUP BY YEARWEEK(created_at)
        ORDER BY YEARWEEK(created_at) ASC
      `;

    }
    else{
        // DEFAULT: GROUP BY DAY (Last 7 Days)
      sql = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m-%d') as label, 
          COUNT(*) as count 
        FROM resident_info 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
      `;
    }

    const [rows] = await db.execute(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log("Error fetching number of added residents:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
