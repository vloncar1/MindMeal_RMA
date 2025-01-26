const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Konfiguracija baze podataka
const db = mysql.createConnection({
  host: "ucka.veleri.hr",
  user: "vmarcelja",
  password: "11",
  database: "vmarcelja",
});

// Povezivanje s bazom podataka
db.connect((err) => {
  if (err) {
    console.error("Greška prilikom spajanja na bazu podataka:", err);
  } else {
    console.log("Uspješno spojeno na bazu podataka!");
  }
});

// Ruta za registraciju korisnika
app.post("/register", (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Sva polja su obavezna!" });
  }

  const query = "INSERT INTO korisnikrma (korime, lozinka, role) VALUES (?, ?, ?)";
  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error("Greška prilikom unosa u bazu:", err);
      return res.status(500).json({ error: "Greška na serveru." });
    }
    res.status(201).json({ message: "Korisnik uspješno registriran!" });
  });
});

// Ruta za prijavu korisnika
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Sva polja su obavezna!" });
  }

  const query = "SELECT * FROM korisnikrma WHERE korime = ? AND lozinka = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Greška prilikom provjere korisnika:", err);
      return res.status(500).json({ error: "Greška na serveru." });
    }

    if (results.length > 0) {
      res.json({ message: "Prijava uspješna!", user: results[0] });
    } else {
      res.status(401).json({ error: "Neispravno korisničko ime ili lozinka." });
    }
  });
});

// Ruta za spremanje odabranog plana u korisničku tablicu
app.post("/savePlan", (req, res) => {
    const { userId, planId } = req.body;

    // Provjera ako su userId i planId poslani
    if (!userId || !planId) {
        return res.status(400).json({ error: "Korisnik i plan su obavezni!" });
    }

    // Provjera ako korisnik postoji u bazi
    const checkUserQuery = "SELECT * FROM korisnikrma WHERE id = ?";
    db.query(checkUserQuery, [userId], (err, results) => {
        if (err) {
            console.error("Greška pri provjeri korisnika:", err);
            return res.status(500).json({ error: "Greška na serveru." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Korisnik nije pronađen." });
        }

        // Ažuriranje plan_id u korisnikrma tablici
        const query = "UPDATE korisnikrma SET plan_id = ? WHERE id = ?";
        db.query(query, [planId, userId], (err, results) => {
            if (err) {
                console.error("Greška prilikom spremanja plana:", err);
                return res.status(500).json({ error: "Greška na serveru." });
            }

            console.log("Plan uspješno spremljen za korisnika ID:", userId);
            res.status(200).json({ message: "Plan uspješno spremljen!" });
        });
    });
});

// Ruta za dohvat odabranog plana korisnika iz korisnikrma tablice
app.get("/getUserPlan/:userId", (req, res) => {
    const userId = req.params.userId;

    // Provjera ako je korisnički ID poslan
    if (!userId) {
        return res.status(400).json({ error: "Korisnički ID je obavezan!" });
    }

    // Dohvaćanje ID odabranog plana korisnika
    const query = "SELECT plan_id FROM korisnikrma WHERE id = ?";
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Greška prilikom dohvaćanja plana:", err);
            return res.status(500).json({ error: "Greška na serveru." });
        }

        if (results.length > 0 && results[0].plan_id) {
            const planId = results[0].plan_id;

            // Dohvat plana iz tablice korisnikrma (plan_id se povezuje sa zapisom)
            res.json({ plan_id: planId });
        } else {
            res.status(404).json({ error: "Korisnik nema pohranjen plan." });
        }
    });
});

// Pokretanje servera
app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});