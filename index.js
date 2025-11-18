import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// =========================
//   ENDPOINT /search
// =========================
app.get("/search", async (req, res) => {
  const phone = req.query.phone;

  if (!phone) {
    return res.status(400).json({ error: "Numéro manquant" });
  }

  try {
    const API_KEY = process.env.NUMVERIFY_API_KEY;

    const url = `http://apilayer.net/api/validate?access_key=${API_KEY}&number=${phone}&country_code=&format=1`;

    const apiRes = await fetch(url);
    const data = await apiRes.json();

    console.log("Réponse numverify :", data);  // 🔍 utile pour diagnostiquer

    // Gestion des erreurs de l'API
    if (data.error) {
      return res.status(400).json({
        error: "Erreur API Numverify",
        info: data.error
      });
    }

    // Construction de la réponse propre
    const result = {
      valid: data.valid ?? null,
      number: data.international_format ?? null,
      local_format: data.local_format ?? null,
      country: data.country_name ?? null,
      country_code: data.country_code ?? null,
      location: data.location ?? null,       // souvent vide en version gratuite
      carrier: data.carrier ?? null,         // souvent vide en version gratuite
      line_type: data.line_type ?? null      // souvent vide en version gratuite
    };

    res.json(result);

  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ error: "Erreur interne au serveur" });
  }
});

// =========================
//   Lancer le serveur
// =========================
app.listen(3000, () => {
  console.log("Backend lancé sur http://localhost:3000");
});
