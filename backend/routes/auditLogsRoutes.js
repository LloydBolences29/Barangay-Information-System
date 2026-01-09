const express = require('express');
const { connect } = require('./statsRoutes');
const router = express.Router();
const { connectToDatabase } = require('../db/db');


//the counter for the queue number will be handled in the frontend
//per day count
router.get('/today-count', async (req, res) => {
    try {
        // 1. Get today's date in SQL format (YYYY-MM-DD)
        const today = new Date().toISOString().slice(0, 10);

        const db = await connectToDatabase();

        // 2. Count how many requests exist for TODAY only
        // This ensures the number resets to 1 tomorrow
        const [rows] = await db.execute(
            "SELECT COUNT(*) as count FROM certificateRequestLogs WHERE DATE(createdAt) = ?", 
            [today]
        );

        res.json({ count: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch count" });
    }
});

//audit log route for the secretary
//for submitting every certificate request
router.post('/submit-certificate', async (req, res) =>{
    const { resident_id, certificate_type, queueNo, reqStatus, request_status, updatedByUserId } = req.body;

    if (!resident_id || !certificate_type || !queueNo || !reqStatus || !updatedByUserId) {
        return res.status(400).json({ message: "Missing required fields." });
    }
    try {
        const db = await connectToDatabase();
        const sql = `
            INSERT INTO certificateRequestLogs 
            (residentId, certType, queueNo, reqStatus, updatedByUser, createdAt) 
            VALUES (?, ?, ?, ?, ?, NOW())
        `;

        const values = [resident_id, certificate_type, queueNo, reqStatus, updatedByUserId];
        await db.execute(sql, values);

        //add the data to the queue table as well

        const queueSql = `
            INSERT INTO queueTable 
            (queueNo, residentId, certType, request_status) 
            VALUES (?, ?, ?, ?)
        `;

        await db.execute(queueSql, [queueNo, resident_id, certificate_type, request_status]);
        return res.status(200).json({ message: 'Certificate request logged successfully.' });
    } catch (error) {
        console.log("Error submitting certificate request:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
})



module.exports = router;