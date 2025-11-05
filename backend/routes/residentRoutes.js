const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../db/db');

//adding a resident
router.post('/add-resident', async (req, res) => {
    try {
        const { 
            firstname, 
            lastname,
            middlename,
            name_extension,
            dob,
            place_of_birth,
            sex, 
            civil_status,
            citizenship,
            occupation,
            house_no,
            street,
            address
         } = req.body;

         //CHECKING IF THE BODY HAS AN NAME EXTENSION
         let nameExt = name_extension ? name_extension : "N/A";
         let occupationStatus = occupation ? occupation : "N/A";

         if(!firstname || !lastname || !middlename|| !dob || !place_of_birth || sex || civil_status || citizenship){
            return res.status(400).json({ message: 'Please provide all required fields.' });
         }

         //check if that resident already exists
            const db = await connectToDatabase();
            const sql = `SELECT * FROM resident_info WHERE firstname = ? AND lastname = ? AND middlename = ? AND dob = ?`;
            const [existingResidents] = await db.execute(sql, [
                firstname,
                lastname,
                middlename,
                dob
            ]);

            if (existingResidents.length > 0) {
                return res.status(400).json({ message: 'Resident already exists.' });
            }

            //insert the address first

            const addressSql = `INSERT INTO address (house_no, street, address) VALUES (?, ?, ?)`;
            const [addressResult] = await db.execute(addressSql, [
                house_no,
                street,
                address
            ]);

            const addressID = addressResult.insertId;

            //insert the resident
            const residentSql = `INSERT INTO resident_info (firstname, lastname, middlename, name_extension, dob, place_of_birth, sex, civil_status, citizenship, occupation, addressID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const [residentResult] = await db.execute(residentSql, [
                firstname,
                lastname,
                middlename,
                nameExt,
                dob,
                place_of_birth,
                sex,
                civil_status,
                citizenship,
                occupationStatus,
                addressID
            ]);

            return  res.status(201).json({ message: 'Resident added successfully.' });
    } catch (error) {
        console.error('Error adding resident.', error)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;