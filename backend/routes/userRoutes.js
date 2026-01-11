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

    //check if the user is active or not
    if(rows.length > 0 && rows[0].is_active === 0) {
      return res.status(403).json({ message: "User account is inactive. Please contact your administrator." });
    }

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
      { id: user.id, username: user.username, role: user.user_role, is_first_logged_in: user.is_first_logged_in },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    //creation of tokens
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    }); // 1 hour
    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.user_role, is_first_logged_in: user.is_first_logged_in },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, user_password, user_role } = req.body;

    console.log("Registering user:", req.body);

    const db = await connectToDatabase();

    // ---------------------------------------------------------
    // STEP 1: STRICT ROLE CHECKING
    // "Is there already a person with this role who is ACTIVE?"
    // ---------------------------------------------------------
    const activeRoleCheckSql = "SELECT * FROM user_info WHERE user_role = ? AND is_active = 1";
    const [existingActiveUser] = await db.execute(activeRoleCheckSql, [user_role]);

    // If the array is NOT empty, it means someone is already active.
    if (existingActiveUser.length > 0) {
      return res.status(409).json({ 
        message: `Registration Failed: There is already an ACTIVE account with the role '${user_role}'. Please deactivate the existing user first.` 
      });
    }


    const usernameCheckSql = "SELECT * FROM user_info WHERE username = ?";
    const [existingUsername] = await db.execute(usernameCheckSql, [username]);

    if (existingUsername.length > 0) {
      return res.status(409).json({ message: "Username is already taken." });
    }

    // ---------------------------------------------------------
    // STEP 3: REGISTER THE NEW USER
    // ---------------------------------------------------------
    const salt = bcyrpt.genSaltSync(10);
    const hashedPassword = bcyrpt.hashSync(user_password, salt);

    const insertSql =
      "INSERT INTO user_info (firstname, lastname, username, user_password, user_role, is_active, is_first_logged_in) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    await db.execute(insertSql, [
      firstName,
      lastName,
      username,
      hashedPassword,
      user_role,
      1, 
      1
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
        is_first_logged_in: decoded.is_first_logged_in,
      },
    });
  } catch (error) {
    console.error("Error during fetching authenticated user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/change-password", async(req, res)=>{
  try {
    const { id, newPassword } = req.body;
    const db = await connectToDatabase();

    // Hash the new password before storing it
    const salt = bcyrpt.genSaltSync(10);
    const hashedPassword = bcyrpt.hashSync(newPassword, salt);
    const sql = "UPDATE user_info SET user_password = ?, is_first_logged_in = ? WHERE id = ?";
    const [result] = await db.execute(sql, [hashedPassword, 0, id]);

    return res.status(200).json({ message: "Password changed successfully", result: result });
  } catch (error) {
    console.log("Error changing password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

router.patch("/reset-password", async(req, res)=>{
  try {
    const { id, newPassword } = req.body;
    const db = await connectToDatabase();

    // Hash the new password before storing it
    const salt = bcyrpt.genSaltSync(10);
    const hashedPassword = bcyrpt.hashSync(newPassword, salt);
    const sql = "UPDATE user_info SET user_password = ?, is_first_logged_in = ? WHERE id = ?";
    const [result] = await db.execute(sql, [hashedPassword, 1, id]);

    return res.status(200).json({ message: "Password reset successfully", result: result });
  } catch (error) {
    console.log("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
})

router.get("/get-all-users", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const sql =
      "SELECT id, firstname, lastname, username, user_role, is_active FROM user_info where is_active = 1";
    const [rows] = await db.execute(sql);

    return res
      .status(200)
      .json({ message: "Users fetched successfully", users: rows });
  } catch (error) {
    console.log(
      "Error in Getting the user's information. Please check your console."
    );
    return res
      .status(500)
      .json({ message: "Internal server error. Plase check your server logs" });
  }
});

//logout user
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.status(200).json({ message: "Logout successfully. Plase wait while navigate to Log in Page." });
  } catch (error) {
    console.error("Error during user logout:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please contact your admin" });
  }
});

router.patch("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, username, user_role, is_active } = req.body;

    const db = await connectToDatabase();
    const sql =
      "UPDATE user_info SET firstname = ?, lastname = ?, username = ?, user_role = ?, is_active = ? WHERE id = ?";
    const [result] = await db.execute(sql, [
      firstName,
      lastName,
      username,
      user_role,
      is_active,
      id,
    ]);

    return res
      .status(200)
      .json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error during updating user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please contact your admin" });
  }
})

module.exports = router;
