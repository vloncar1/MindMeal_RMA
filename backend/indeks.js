const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database configuration
const db = mysql.createConnection({
  host: "ucka.veleri.hr",
  user: "vmarcelja",
  password: "11",
  database: "vmarcelja",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Successfully connected to the database!");
  }
});

// Route for user registration
app.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const query = "INSERT INTO korisnikrma (korime, lozinka, role) VALUES (?, ?, ?)";
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      return res.status(500).json({ error: "Server error." });
    }
    res.status(201).json({ message: "User successfully registered!" });
  });
});

// Route for user login (this is the one you provided)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const query = "SELECT * FROM korisnikrma WHERE korime = ? AND lozinka = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error during user verification:", err);
      return res.status(500).json({ error: "Server error." });
    }

    if (results.length > 0) {
      const user = results[0];
      res.json({
        message: "Login successful!",
        user: { id: user.id, korime: user.korime, role: user.role },
      });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  });
});

// Route to save the selected plan
app.post("/savePlan", (req, res) => {
  const { userId, planId } = req.body;

  if (!userId || !planId) {
    return res.status(400).json({ error: "User and plan are required!" });
  }

  const checkUserQuery = "SELECT * FROM korisnikrma WHERE id = ?";
  db.query(checkUserQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ error: "Server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const query = "UPDATE korisnikrma SET plan_id = ? WHERE id = ?";
    db.query(query, [planId, userId], (err, results) => {
      if (err) {
        console.error("Error saving plan:", err);
        return res.status(500).json({ error: "Server error." });
      }

      console.log("Plan successfully saved for user ID:", userId);
      res.status(200).json({ message: "Plan successfully saved!" });
    });
  });
});

// Route to fetch a user's selected plan
app.get("/getUserPlan/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required!" });
  }

  const query = "SELECT plan_id FROM korisnikrma WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching plan:", err);
      return res.status(500).json({ error: "Server error." });
    }

    if (results.length > 0 && results[0].plan_id) {
      const planId = results[0].plan_id;
      res.json({ plan_id: planId });
    } else {
      res.status(404).json({ error: "User has no saved plan." });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
