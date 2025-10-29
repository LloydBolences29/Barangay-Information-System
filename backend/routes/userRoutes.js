const express = require("express");
const router = express.Router();
const { connectToDatabase } = require("../db/db");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET;

//LOGIN USER
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //checking if the email is provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const db = await connectToDatabase();

    const sql = "SELECT * FROM user_info WHERE username = ?";
    const [rows] = await db.execute(sql, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username" });
    }

    //check if the password is correct
    const user = rows[0];
    console.log("User found:", rows[0]);
    const isPasswordValid = await bcyrpt.compare(password, user.user_password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If login is successful, generate a JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.user_role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    //creation of tokens
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    }); // 1 hour
    return res
      .status(200)
      .json({
        message: "Login successful",
        user: { id: user.id, username: user.username, role: user.user_role },
      });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      user_password,
      user_role
    } = req.body;

    console.log("Registering user:", req.body);

    // Hash the password before storing it and salt it
    const salt = bcyrpt.genSaltSync(10);
    const hashedPassword = bcyrpt.hashSync(user_password, salt);

    //connect to database
    const db = await connectToDatabase();

    const userCheckSql =
      "SELECT * FROM user_info WHERE firstname = ? AND lastname = ? AND username = ? AND user_role = ?";
    const [existingUsers] = await db.execute(userCheckSql, [
      firstName,
      lastName,
      username,
      user_role,
    ]);

    if (existingUsers.length > 0) {
      return res
        .status(409)
        .json({ message: "User with the same details already exists" });
    }

    const sql =
      "INSERT INTO user_info (firstname, lastname, username, user_password, user_role, is_active) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [
      firstName,
      lastName,
      username,
      hashedPassword,
      user_role,
      1,
    ]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get the authenticated user and its details
router.get("/auth", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);

    res.json({
      message: "Authenticated user fetched successfully",
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error("Error during fetching authenticated user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
