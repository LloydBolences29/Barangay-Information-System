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
                (SELECT COUNT(*) FROM resident_info WHERE sex = 'male' and resident_status = 'active') AS total_male_residents,
                (SELECT COUNT(*) FROM resident_info WHERE sex = 'female' AND resident_status = 'active') AS total_female_residents,
                -- Senior Citizens: Anyone 60 years old or older
                (SELECT COUNT(*) FROM resident_info 
                WHERE TIMESTAMPDIFF(YEAR, dob, CURDATE()) >= 60 
                AND resident_status = 'active') AS total_senior_citizens,

                -- SK Eligible (Sangguniang Kabataan): Usually 15 to 30 years old
                (SELECT COUNT(*) FROM resident_info 
                 WHERE TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN 15 AND 30 
                 AND resident_status = 'active') AS total_sk_eligible,

                -- Minors: Below 18
                (SELECT COUNT(*) FROM resident_info 
                 WHERE TIMESTAMPDIFF(YEAR, dob, CURDATE()) < 18 
                 AND resident_status = 'active') AS total_minors;
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
// backend route

router.get("/number-of-added-residents", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { period } = req.query; // Now this will work because frontend sends ?period=...

    let sql = "";

    if (period === "monthly") {
      // FIX: Look back 12 months, Group by Year-Month, Format as YYYY-MM
      sql = `
        SELECT 
          DATE_FORMAT(created_at, '%Y-%m') as label, 
          COUNT(*) as count 
        FROM resident_info 
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC
      `;
    } 
    else if (period === "weekly") {
      // Weekly looks okay, but ensures standard "Week U Year" format
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
    else {
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
