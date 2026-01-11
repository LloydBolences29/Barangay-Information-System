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
      relationship_to_head,
      resident_status,
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
    const residentSql = `INSERT INTO resident_info (firstname, lastname, middlename, name_extension, dob, place_of_birth, sex, civil_status, citizenship, occupation, householdId, relationship_to_head, resident_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
      relationship_to_head,
      resident_status ? resident_status : "active",
    ]);

    return res.status(201).json({ message: "Resident added successfully." });
  } catch (error) {
    console.error("Error adding resident.", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//add to an existing one
router.post("/add-resident-existing-household", async (req, res) => {
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
      household_id,
      relationship_to_head,
      resident_status,
    } = req.body;

    //check if the user provided the householdId
    if (!household_id) {
      return res.status(400).json({ message: "Please provide a valid household ID." })
    }

    // Ensure it's a string first
    let idString = household_id.toString();

    // Remove "HH-" if it's already there to avoid "HH-HH-"
    if (idString.startsWith("HH-")) {
      idString = idString.replace("HH-", "");
    }

    // Pad it with zeros (e.g., "1" becomes "0001")
    // Then add the prefix
    const formattedId = `HH-${idString.padStart(4, '0')}`;

    //check if the user provided all the fields
    if (!firstname ||
      !lastname ||
      !middlename ||
      !dob ||
      !place_of_birth ||
      !sex ||
      !civil_status ||
      !citizenship ||
      !relationship_to_head) {
      return res.status(400).json({ message: "Please provide all required fields." })
    }


    const db = await connectToDatabase();

    const sql =
      `INSERT INTO resident_info 
    (firstname, lastname, middlename, name_extension, dob, place_of_birth, sex, civil_status, citizenship, occupation, householdId, relationship_to_head, resident_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.execute(sql, [
      firstname,
      lastname,
      middlename,
      name_extension ? name_extension : "N/A",
      dob,
      place_of_birth,
      sex,
      civil_status,
      citizenship,
      occupation,
      household_id,
      relationship_to_head,
      resident_status ? resident_status : "active",
    ]);
    return res.status(200).json({ message: "Resident added successfully." });
  } catch (error) {
    console.log("Error adding resident to existing household.", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please Check your console" });
  }
})

//search resident by name or last name
router.get("/search-resident/:searchterm", async (req, res) => {
  try {
    const { searchterm } = req.params;
    const { resident_status } = req.query;
    const db = await connectToDatabase();

    let searchSql = `SELECT 
      resident_info.id,
      resident_info.lastname,
      resident_info.firstname,
      resident_info.middlename,
      resident_info.name_extension,
      DATE_FORMAT(resident_info.dob, '%Y-%m-%d') AS dob,
      resident_info.place_of_birth,
      resident_info.sex,
      resident_info.civil_status,
      resident_info.citizenship,
      resident_info.occupation,
      resident_info.relationship_to_head,
      resident_info.resident_status,
      households.id as HouseHoldID,
      households.household_number,
      address.house_no,
      address.street,
      address.address,
      DATE_FORMAT(households.date_registered, '%Y-%m-%d') AS date_registered
      FROM resident_info
      JOIN households ON resident_info.householdId = households.id
      JOIN address ON households.addressID = address.id
      WHERE (firstname LIKE ? OR lastname LIKE ?)`;

    const params = [`%${searchterm}%`, `%${searchterm}%`];
    if (resident_status && resident_status !== "all") {
      searchSql += ` AND resident_info.resident_status = ?`;
      params.push(resident_status);
    }

    const [results] = await db.execute(searchSql, params);

    if (results.length === 0) {
      return res.status(404).json({ message: "No residents found." });
    }
    return res
      .status(200)
      .json({ message: "Successfully fetched patient.", residents: results });
  } catch (error) {
    console.log("Error searching resident.", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please Check your console" });
  }
});

//fetching all the members of a certain household
router.get("/get-household-members/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();

    const sql = `SELECT 
    r.id,
    r.firstname, 
    r.lastname, 
    r.relationship_to_head,
    a.street,
    a.house_no,
    h.id AS householdId
  FROM 
    resident_info AS r
  JOIN 
    households AS h ON r.householdId = h.id
  JOIN 
    address AS a ON h.addressId = a.id
  WHERE 
    r.householdId = (
      SELECT householdId 
      FROM resident_info 
      WHERE id = ?
    )`;

    const [results] = await db.execute(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No household members found." });
    }
    return res.status(200).json({
      message: "Successfully fetched household members.",
      members: results,
    });
  } catch (error) {
    console.log("Error fetching household members:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please Check your console" });
  }
});

//update resident info
router.patch("/update-resident/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      lastname,
      firstname,
      middlename,
      name_extension,
      dob,
      place_of_birth,
      civil_status,
      citizenship,
      occupation,
      resident_status = "active",
    } = req.body;

    const db = await connectToDatabase();

    //check if resident exists
    const checkSql = `SELECT * FROM resident_info WHERE id = ?`;
    const [existingResidents] = await db.execute(checkSql, [id]);

    if (existingResidents.length === 0) {
      return res.status(404).json({ message: "Resident not found." });
    }




    const sql = `
    UPDATE resident_info 
    SET 
      lastname = ?, 
      firstname = ?, 
      middlename = ?, 
      name_extension = ?, 
      dob = ?, 
      place_of_birth = ?, 
      civil_status = ?, 
      citizenship = ?, 
      occupation = ?,
      resident_status = ?
    WHERE 
      id = ?`;

    await db.execute(sql, [
      lastname,
      firstname,
      middlename,
      name_extension,
      dob,
      place_of_birth,
      civil_status,
      citizenship,
      occupation,
      resident_status,
      id,
    ]);

    return res
      .status(200)
      .json({ message: "Resident information updated successfully." });
  } catch (error) {
    console.log("Error updating resident info:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please Check your console" });
  }
});

//search for households by head of household's last name
router.get("/household-search/:searchterm", async (req, res) => {
  try {
    const { searchterm } = req.params;
    const db = await connectToDatabase();

    const searchSql = `SELECT 
      h.id AS householdId,
      h.household_number,
      a.house_no,
      a.street,
      a.address,
      r.firstname AS head_firstname,
      r.lastname AS head_lastname
    FROM
      households AS h
    JOIN
      address AS a ON h.addressID = a.id
    JOIN
      resident_info AS r ON h.id = r.householdId
    WHERE
      r.relationship_to_head = 'Head'
      AND r.lastname LIKE ?`;
    const [results] = await db.execute(searchSql, [`%${searchterm}%`]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No households found." });
    }
    return res
      .status(200)
      .json({ message: "Successfully fetched households.", households: results });

  } catch (error) {
    console.log("Error searching households:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please Check your console" });
  }
})

//soft deletion of resident by setting the status to inactive
router.patch("/soft-delete-resident/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { resident_status } = req.body;
    
    const db = await connectToDatabase();

    const sql = `UPDATE resident_info 
    SET resident_status = ? 
    WHERE id = ?`;

    await db.execute(sql, [resident_status, id]);

    return res
      .status(200)
      .json({ message: "Resident deleted successfully." });
  } catch (error) {
    console.log("Error soft deleting resident:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please Check your console" });
  }

})

//getting the info of a current barangay officials





module.exports = router;
