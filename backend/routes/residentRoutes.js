const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/db");

//adding a resident
router.post("/add-resident", async (req, res) => {
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
      address,
      relationship_to_head
    } = req.body;

    //CHECKING IF THE BODY HAS AN NAME EXTENSION
    let nameExt = name_extension ? name_extension : "N/A";
    let occupationStatus = occupation ? occupation : "N/A";

    if (
      !firstname ||
      !lastname ||
      !middlename ||
      !dob ||
      !place_of_birth ||
      !sex ||
      !civil_status ||
      !citizenship ||
      !relationship_to_head
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    //check if that resident already exists
    const db = await connectToDatabase();
    const sql = `SELECT * FROM resident_info WHERE firstname = ? AND lastname = ? AND middlename = ? AND dob = ?`;
    const [existingResidents] = await db.execute(sql, [
      firstname,
      lastname,
      middlename,
      dob,
    ]);

    if (existingResidents.length > 0) {
      return res.status(400).json({ message: "Resident already exists." });
    }

    //check the latest houshold id number in the households table
    const getLastHouseholdSql = `SELECT household_number FROM households 
                                ORDER BY id DESC 
                                LIMIT 1`;

    const [householdRows] = await db.execute(getLastHouseholdSql);

    let newHouseholdNumber;

    if (householdRows.length === 0) {
      // Your table is empty, so this is the first one
      newHouseholdNumber = "HH-0001";
    } else {
      // Your table has data, e.g., "HH-0050"
      const lastNumberString = householdRows[0].household_number; // "HH-0050"
      const lastNumber = parseInt(lastNumberString.split("-")[1]); // 50
      const newNumber = lastNumber + 1; // 51
      const newNumberPadded = String(newNumber).padStart(4, "0"); // "0051"
      newHouseholdNumber = `HH-${newNumberPadded}`; // "HH-0051"
    }

    //insert the address first

    const addressSql = `INSERT INTO address (house_no, street, address) VALUES (?, ?, ?)`;
    const [addressResult] = await db.execute(addressSql, [
      house_no,
      street,
      address,
    ]);

    const addressID = addressResult.insertId;

    //insert the resident
    const householdsSql = `INSERT INTO households (household_number, addressID) VALUES (?, ?)`;
    const [householdResult] = await db.execute(householdsSql, [
      newHouseholdNumber,
      addressID,
    ]);

    const householdId = householdResult.insertId;

    //insert the resident
    const residentSql = `INSERT INTO resident_info (firstname, lastname, middlename, name_extension, dob, place_of_birth, sex, civil_status, citizenship, occupation, householdId, relationship_to_head) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    await db.execute(residentSql, [
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
      householdId,
      relationship_to_head
    ]);

    return res.status(201).json({ message: "Resident added successfully." });
  } catch (error) {
    console.error("Error adding resident.", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
