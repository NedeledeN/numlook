import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint de recherche
app.get("/search", async (req, res) => {
  const phone = req.query.phone;
  if (!phone) return res.status(400).json({ error: "Numéro manquant" });

  try {
    const API_KEY = process.env.NUMVERIFY_API_KEY;
    const url = `http://apilayer.net/api/validate?access_key=${API_KEY}&number=${phone}&country_code=&format=1`;

    const apiRes = await fetch(url);
    const data = await apiRes.json();

    res.json(data);
  } catch (err) {
    console.error("Erreur API:", err);
    res.status(500).json({ error: "Erreur interne" });
  }
});

app.listen(3000, () => {
  console.log("Backend lancé sur http://localhost:3000");
});
