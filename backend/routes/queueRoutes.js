const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/db");

//get all the queues that has a "Pending Payment" status
router.get("/pending-payment-queues", async (req, res) => {
    try {
        const db = await connectToDatabase();

        const sql = `
        SELECT * from queueTable where request_status = "Pending"
        `;
        
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        console.log("Error fetching pending payment queues:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
})

// 1. FOR CAPTAIN (Treasurer has accepted payment)
router.get("/captain-approval-queues", async (req, res) => {
    try {
        const db = await connectToDatabase();
        // Adjust 'Paid' to whatever status you use after Treasurer accepts money
        const sql = `SELECT * from queueTable where request_status = 'Paid'`; 
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. FOR DISPATCHING (Captain has signed it)
router.get("/ready-dispatch-queues", async (req, res) => {
    try {
        const db = await connectToDatabase();
        // Adjust 'Approved' or 'Signed' to your specific status
        const sql = `SELECT * from queueTable where request_status = 'Approved'`; 
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

//for the treasuerer
//accept routes
router.patch('/accept-payment/:queueId', async (req, res) => {
    const { queueId } = req.params;

    try {
        const db = await connectToDatabase();
        const sql = `
            UPDATE queueTable 
            SET request_status = 'Paid' 
            WHERE id = ?
        `;
        const [result] = await db.execute(sql, [queueId]);
        return res.status(200).json({ message: "Payment accepted and queue updated." });
    } catch (error) {
        console.log("Error accepting payment:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
})



module.exports = router;